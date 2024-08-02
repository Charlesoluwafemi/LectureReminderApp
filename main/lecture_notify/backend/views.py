from django.http import HttpResponse, JsonResponse
from django.views import View
from rest_framework import viewsets
from .models import Lecture
from .serializers import LectureSerializer
import pandas as pd
from datetime import datetime
from .tasks import send_whatsapp_notification_to_students
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from .models import Student
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
import openpyxl
from datetime import datetime, timedelta
import csv

from django.contrib.auth import authenticate, get_user_model
from .models import Faculty, Department, Lecturer, Course

import logging

logger = logging.getLogger(__name__)

def root_view(request):
    return HttpResponse("Welcome to Lecture Notify!")

class LectureViewSet(viewsets.ModelViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer

def excel_serial_date_to_datetime(serial):
    # Excel serial date to datetime conversion
    return datetime(1899, 12, 30) + timedelta(days=serial)

@method_decorator(csrf_exempt, name='dispatch')
class UploadExcelView(View):
    
    def post(self, request, *args, **kwargs):
        if 'file' in request.FILES:
            excel_file = request.FILES['file']
            try:
                if not excel_file.name.endswith('.xlsx'):
                    return JsonResponse({'error': 'The uploaded file is not an Excel file'}, status=400)
                
                df = pd.read_excel(excel_file, engine='openpyxl')
                print(f"Read {len(df)} rows from the uploaded file.")
                
                # Log the columns of the DataFrame for debugging
                print(f"DataFrame columns: {df.columns.tolist()}")
                
                expected_columns = ['department', 'venue', 'course_title', 'course_code', 'date', 'time']
                missing_columns = [col for col in expected_columns if col not in df.columns]
                
                if missing_columns:
                    return JsonResponse({'error': f'Missing columns in the uploaded file: {", ".join(missing_columns)}'}, status=400)

                success_count = 0
                error_messages = []

                for index, row in df.iterrows():
                    try:
                        department = row['department']
                        venue = row['venue']
                        course_title = row['course_title']
                        course_code = row['course_code']
                        date = row['date']
                        time = row['time']

                        # Log row data for debugging
                        print(f"Processing row {index + 1}: {row.to_dict()}")

                        # Convert Excel serial date to datetime if necessary
                        if isinstance(date, (float, int)):
                            date = excel_serial_date_to_datetime(date).date()
                        if isinstance(time, (float, int)):
                            time = excel_serial_date_to_datetime(time).time()

                        lecture_time = datetime.combine(date, time)

                        lecture = Lecture.objects.create(
                            department=department,
                            venue=venue,
                            course_title=course_title,
                            course_code=course_code,
                            date=lecture_time.date(),
                            time=lecture_time.time()
                        )

                    

                        success_count += 1
                    except Exception as e:
                        error_messages.append(f"Error processing row {index + 1}: {str(e)}")
                        print(f"Error processing row {index + 1}: {str(e)}")

                print(f"Successfully processed {success_count} rows.")
                if error_messages:
                    return JsonResponse({'message': f'File uploaded with {success_count} successful entries.', 'errors': error_messages}, status=400)
                else:
                    return JsonResponse({'message': f'File uploaded and lectures added successfully ({success_count} entries).'})
            
            except Exception as e:
                print(f"Error processing file: {str(e)}")
                return JsonResponse({'error': f"Error processing file: {str(e)}"}, status=500)
        
        else:
            print("No file provided.")
            return JsonResponse({'error': 'No file provided in the request.'}, status=400)

class CSRFView(View):
    def get(self, request):
        return JsonResponse({'csrfToken': get_token(request)})
    

# Set up logging
logger = logging.getLogger(__name__)
MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5 MB

@csrf_exempt
def upload_students(request):
    if request.method == "POST" and request.FILES.get("file"):
        excel_file = request.FILES["file"]
        logger.debug("File received for upload.")

        # Check if the file is an Excel file
        if not (excel_file.name.endswith('.xls') or excel_file.name.endswith('.xlsx')):
            logger.error("Uploaded file is not an Excel file.")
            return JsonResponse({"error": "Uploaded file is not an Excel file."}, status=400)

        # Attempt to read the Excel file
        try:
            df = pd.read_excel(excel_file)
            logger.debug("Excel file read successfully.")

            for index, row in df.iterrows():
                try:
                    logger.debug(f"Processing row {index}: {row}")
                    # Convert all values to strings and strip them
                    name = str(row['name']).strip() if pd.notna(row['name']) else None
                    department_name = str(row['department']).strip() if pd.notna(row['department']) else None
                    phone_number = str(row['phone_number']).strip() if pd.notna(row['phone_number']) else None
                    course_title = str(row['course']).strip() if pd.notna(row['course']) else None
                    faculty_name = str(row['faculty']).strip() if pd.notna(row['faculty']) else None

                    if not all([name, department_name, phone_number, course_title, faculty_name]):
                        logger.error(f"Missing data in row {index}")
                        return JsonResponse({"error": f"Missing data in row {index}"}, status=400)

                    # If foreign key fields are not required, use None or default values
                    department = Department.objects.filter(name=department_name).first() if department_name else None
                    course = Course.objects.filter(course_title=course_title).first() if course_title else None
                    faculty = Faculty.objects.filter(name=faculty_name).first() if faculty_name else None

                    # Save the student instance to the database
                    student = Student(
                        name=name,
                        department=department,
                        phone_number=phone_number,
                        course=course,
                        faculty=faculty
                    )
                    student.save()
                    logger.info(f"Saved student: {name}, Department: {department}, Phone: {phone_number}, Course: {course}, Faculty: {faculty}")

                except KeyError as e:
                    logger.error(f"Column missing in row {index}: {e}")
                    return JsonResponse({"error": f"Column missing in row {index}: {str(e)}"}, status=400)
                except Exception as e:
                    logger.error(f"Error processing row {index}: {e}")
                    return JsonResponse({"error": f"Error processing row {index}: {str(e)}"}, status=500)

            logger.debug("File processed and data saved successfully.")
            return JsonResponse({"message": "File uploaded and data saved successfully"})
        except Exception as e:
            logger.error(f"Error reading Excel file: {e}")
            return JsonResponse({"error": f"Error reading Excel file: {str(e)}"}, status=500)

    logger.error("Invalid request method or missing file parameter.")
    return JsonResponse({"error": "POST request with 'file' parameter required"}, status=400)



# Set up logging
logger = logging.getLogger(__name__)

User = get_user_model()

@api_view(['POST'])
def login_view(request):
    logger.debug('Login view called')

    username = request.data.get('username')
    password = request.data.get('password')
    
    logger.debug('Received username: %s', username)
    logger.debug('Received password: %s', password)

    if not username or not password:
        logger.warning('Username or password not provided')
        return Response({'error': 'Username and password are required'}, status=400)

    try:
        user_exists = User.objects.filter(username=username).exists()
        logger.debug('User exists: %s', user_exists)

        if user_exists:
            user = authenticate(username=username, password=password)
            logger.debug('Authenticated user: %s', user)
            
            if user:
                logger.debug('Authentication successful for user: %s', user.username)
                try:
                    token = jwt.encode({'username': user.username}, settings.SECRET_KEY, algorithm='HS256')
                    logger.debug('Token generated successfully: %s', token)
                    return Response({'token': token})
                except Exception as jwt_error:
                    logger.error('JWT generation failed: %s', jwt_error)
                    return Response({'error': 'Token generation error'}, status=500)
            else:
                logger.warning('Authentication failed for username: %s', username)
                return Response({'error': 'Invalid man'}, status=401)
        else:
            logger.warning('User does not exist: %s', username)
            return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        logger.error('An error occurred during login: %s', str(e))
        return Response({'error': 'Internal server error'}, status=500)


User = get_user_model()

@api_view(['POST'])
def register_admin_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Hash the password
    hashed_password = make_password(password)

    try:
        # Create the user in the database
        user = User.objects.create(username=username, password=hashed_password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def upload_faculties(request):
    file = request.FILES['file']
    df = pd.read_csv(file)
    for _, row in df.iterrows():
        Faculty.objects.create(name=row['name'], description=row['description'])
    return JsonResponse({'status': 'success'})

@api_view(['POST'])
def upload_departments(request):
    file = request.FILES['file']
    df = pd.read_csv(file)
    for _, row in df.iterrows():
        faculty = Faculty.objects.get(name=row['faculty_name'])
        Department.objects.create(name=row['name'], faculty=faculty, description=row['description'])
    return JsonResponse({'status': 'success'})

@api_view(['POST'])
def upload_lecturers(request):
    file = request.FILES['file']
    df = pd.read_csv(file)
    for _, row in df.iterrows():
        department = Department.objects.get(name=row['department_name'])
        Lecturer.objects.create(first_name=row['first_name'], last_name=row['last_name'], email=row['email'], department=department)
    return JsonResponse({'status': 'success'})

@api_view(['POST'])
def upload_courses(request):
    file = request.FILES['file']
    df = pd.read_csv(file)
    for _, row in df.iterrows():
        faculty = Faculty.objects.get(name=row['faculty_name'])
        department = Department.objects.get(name=row['department_name'])
        lecturer = Lecturer.objects.get(email=row['lecturer_email'])
        Course.objects.create(code=row['code'], name=row['name'], faculty=faculty, department=department, lecturer=lecturer, description=row['description'])
    return JsonResponse({'status': 'success'})

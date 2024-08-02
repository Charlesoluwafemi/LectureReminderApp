import os
import django
from datetime import datetime, time,timedelta
import pytz
from django.utils import timezone
import pywhatkit as kit


# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lecture_notify.settings')
django.setup()

from backend.models import Lecture, Student

# Time zone setup for Nigeria
nigeria_tz = pytz.timezone('Africa/Lagos')

# Current time in Nigeria
now_nigeria = timezone.now().astimezone(nigeria_tz)
print(f"Current Nigerian time: {now_nigeria}")

# Lecture time is 22:20
lecture_time = time(22, 20)
notification_time = (datetime.combine(datetime.today(), lecture_time) - timedelta(minutes=1)).time()
print(f"Notification time: {notification_time}")

# Find lectures scheduled at the lecture time
lectures = Lecture.objects.filter(time=lecture_time)

if not lectures:
    print(f"No lectures scheduled at {lecture_time}.")
else:
    for lecture in lectures:
        # Get students in the same department as the lecture
        students = Student.objects.filter(department=lecture.department)

        for student in students:
            try:
                print(f"Scheduling notification for student: {student.name} ({student.phone_number})")
                kit.sendwhatmsg(
                    phone_no=f"+{student.phone_number}",
                    message=f"Reminder: You have a lecture '{lecture.name}' for the course '{lecture.course_title}' at {lecture.date} {lecture.time}. Venue: {lecture.venue}",
                    time_hour=notification_time.hour,
                    time_min=notification_time.minute,
                    wait_time=10,
                    tab_close=True,
                    close_time=3
                )
                print(f"Message scheduled successfully for {student.name}: {student.phone_number}")
            except Exception as e:
                print(f"Failed to schedule message for {student.name}: {e}")

# Test message to ensure functionality
try:
    test_phone_number = '+2349162220402'  # Replace with a phone number for testing
    print(f"Scheduling test message for: {test_phone_number}")
    kit.sendwhatmsg(
        phone_no=test_phone_number,
        message="This is a test message from pywhatkit.",
        time_hour=notification_time.hour,
        time_min=notification_time.minute,
        wait_time=10,
        tab_close=True,
        close_time=3
    )
    print(f"Test message scheduled successfully for: {test_phone_number}")
except Exception as e:
    print(f"Failed to schedule test message: {e}")



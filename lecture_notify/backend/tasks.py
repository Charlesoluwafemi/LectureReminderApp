from datetime import datetime, timedelta
import pytz
from django.utils import timezone
from twilio.rest import Client
from backend.models import Lecture, Student
from celery import shared_task

# Twilio credentials
account_sid = ''
auth_token = ''
twilio_number = ''

@shared_task
def send_whatsapp_notification_to_students():
    # Time zone setup for Nigeria
    nigeria_tz = pytz.timezone('Africa/Lagos')

    # Current time in Nigeria
    now_nigeria = timezone.now().astimezone(nigeria_tz)
    print(f"Current Nigerian time: {now_nigeria}")

    # Calculate the time 24 hours from now
    notification_window_start = now_nigeria + timedelta(hours=24)
    notification_window_end = notification_window_start + timedelta(minutes=5)

    # Query lectures scheduled to start within the notification window
    lectures = Lecture.objects.filter(
        date=notification_window_start.date(),
        time__range=(notification_window_start.time(), notification_window_end.time())
    )

    if not lectures:
        print("No lectures scheduled in the notification window.")
        return

    for lecture in lectures:
        lecture_datetime = datetime.combine(lecture.date, lecture.time)
        lecture_datetime_nigeria = nigeria_tz.localize(lecture_datetime)
        
        # Get students in the same department as the lecture
        students = Student.objects.filter(department=lecture.department)
        client = Client(account_sid, auth_token)

        for student in students:
            try:
                message = client.messages.create(
                    body=f"Reminder: You have a lecture '{lecture.name}' for the course '{lecture.course}' at {lecture_datetime_nigeria}. Venue: {lecture.venue}",
                    from_=f'whatsapp:{twilio_number}',
                    to=f'whatsapp:{student.phone_number}'
                )
                print(f"Message sent successfully to {student.name}: {message.sid}")
            except Exception as e:
                print(f"Failed to send message to {student.name}: {e}")



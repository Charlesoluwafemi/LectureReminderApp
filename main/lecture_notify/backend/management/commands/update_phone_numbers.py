# In your Django app, create a management command file (e.g., update_phone_numbers.py)

from django.core.management.base import BaseCommand
from backend.models import Student

class Command(BaseCommand):
    help = 'Update phone numbers to E.164 format'

    def handle(self, *args, **kwargs):
        students = Student.objects.all()
        for student in students:
            # Assuming your phone_number field needs cleaning
            phone_number = student.phone_number.strip().replace(" ", "").replace("-", "")
            if not phone_number.startswith('+'):
                phone_number = '+' + phone_number  # Ensure it starts with '+'
            student.phone_number = phone_number
            student.save()
            self.stdout.write(self.style.SUCCESS(f"Updated phone number for {student.name}"))

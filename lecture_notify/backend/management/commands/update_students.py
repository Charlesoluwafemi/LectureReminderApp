# backend/management/commands/update_students.py

from django.core.management.base import BaseCommand
from backend.models import Student

class Command(BaseCommand):
    help = 'Create or update students with specific details (phone number, department, course)'

    def handle(self, *args, **kwargs):
        students_data = [
            {'name': 'Charles', 'phone_number': '+2349162220402', 'department': 'Computer Science', 'course': 'Programming'},
            {'name': 'Suzzy', 'phone_number': '+2349123456789', 'department': 'Mathematics', 'course': 'Statistics'},
            # Add more students with their details as needed
        ]

        for student_data in students_data:
            # Create or get the student by name
            student, created = Student.objects.get_or_create(name=student_data['name'])
            
            # Update the student's details
            student.phone_number = student_data['phone_number']
            student.department = student_data['department']
            student.course = student_data['course']
            
            student.save()  # Save the changes
            
            self.stdout.write(self.style.SUCCESS(f'Student: {student.name}, Phone Number: {student.phone_number}, Department: {student.department}, Course: {student.course}'))


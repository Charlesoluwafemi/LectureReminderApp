# backend/management/commands/send_reminders_now.py

from django.core.management.base import BaseCommand
from backend.tasks import send_whatsapp_reminders

class Command(BaseCommand):
    help = 'Send WhatsApp reminders for testing purposes'

    def handle(self, *args, **kwargs):
        send_whatsapp_reminders.delay()
        self.stdout.write(self.style.SUCCESS('Successfully sent WhatsApp reminders'))

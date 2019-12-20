from django.conf import settings
from django.core.management.base import BaseCommand
from nhl.load_data.db_loader import load_data


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        load_data()

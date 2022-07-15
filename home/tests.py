from django.test import TestCase,SimpleTestCase

# Create your tests here.

from wagtail.test.utils import WagtailPageTests
from .models import HomePage,Slide

class MyPageTests(WagtailPageTests):
    def test_can_create_under_home_page(self):
        # You can create a ContentPage under a HomePage
        # self.assertCanNotCreateAt(HomePage,Slide)
        self.assertCanCreateAt(HomePage,Slide)


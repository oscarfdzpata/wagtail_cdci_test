from django.db import models
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.core.fields import RichTextField
from wagtail.core.models import Page
# Create your models here.

class LegalPage(Page):
    body = RichTextField(blank=True)
    max_count = 1
    content_panels = Page.content_panels + [
        FieldPanel('body', classname="full")
    ]

class CookiesPage(Page):
    body = RichTextField(blank=True)
    max_count = 1
    content_panels = Page.content_panels + [
        FieldPanel('body', classname="full")
    ]

class PrivacityPage(Page):
    body = RichTextField(blank=True)
    max_count = 1
    content_panels = Page.content_panels + [
        FieldPanel('body', classname="full")
    ]
from importlib.resources import contents
from pydoc import classname
from django.db import models

from wagtail.admin.edit_handlers import FieldPanel
from wagtail.core.fields import RichTextField
from wagtail.core.models import Page
from wagtail.images.edit_handlers import ImageChooserPanel



class HomePage(Page):
    body = RichTextField(blank=True)
    template= 'home/home_page_typo3.html'
    template= 'home/home_page.html'

    content_panels = Page.content_panels + [
        FieldPanel('body', classname="full"),
    ]

    def get_context(self, request):
        context = super().get_context(request)
        list_banners = Banner.objects.all()
        context['list_banners'] = list_banners
        return context


class Slide(models.Model):
    title = models.CharField(max_length=150)
    description = models.CharField(max_length=200)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    panels = [
        FieldPanel('title'),
        FieldPanel('description'),
        ImageChooserPanel('image'),
    ]

    class Meta:
        verbose_name = "Diapositiva"


class Banner(models.Model):
    text = models.CharField(max_length=100)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    link = models.CharField(max_length=200)

    panels = [
        FieldPanel('text'),
        ImageChooserPanel('image'),
        FieldPanel('link'),
    ]  


from django.db import models
from django.forms import CharField

from wagtail.admin.edit_handlers import FieldPanel
from wagtail.core.fields import RichTextField
from wagtail.core.models import Page
from wagtail.images.edit_handlers import ImageChooserPanel

class IndexPremiosPage(Page):
    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro', classname="full")
    ]


class PremioPage(Page):
    short_title = models.CharField(max_length=150, default="")
    subtitle = models.CharField(max_length=250)
    description = RichTextField(blank=True)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    link = models.CharField(max_length=200)
    value = models.CharField(max_length=6, default="0")

    # short_title, value y link en una sección diferente del resto
    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        FieldPanel('description'),
        ImageChooserPanel('image'),
        FieldPanel('short_title'),
        FieldPanel('value'),
        FieldPanel('link'),
    ]

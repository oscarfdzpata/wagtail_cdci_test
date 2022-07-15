from django.db import models
from wagtail.core.models import Page, Orderable
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.search import index
from wagtail.images.edit_handlers import ImageChooserPanel

from modelcluster.fields import ParentalKey

class StudiesIndexPage(Page):
    intro = RichTextField(blank=True)
    image = models.ForeignKey(
            'wagtailimages.Image', on_delete=models.SET_NULL, related_name='+', blank=True, null= True
        )
    max_count = 1
    subpage_types = [
        'studies.StudiesPage',
    ]
    content_panels = Page.content_panels + [
        FieldPanel('intro', classname="full"),
        ImageChooserPanel('image'),
    ]

class StudiesPage(Page):
    date = models.DateField("Post date")
    intro = RichTextField(blank=True)
    body = RichTextField(blank=True)
    icon =  models.ForeignKey(
            'wagtailimages.Image', on_delete=models.PROTECT, related_name='+', blank=True, null= True
        )
    search_fields = Page.search_fields + [
        index.SearchField('body'),
    ]

    content_panels = Page.content_panels + [
        FieldPanel('date'),
        FieldPanel('intro', classname="full"),
        FieldPanel('body', classname="full"),
        ImageChooserPanel('icon'),
        InlinePanel('gallery_images', label="Gallery images"),
    ]

class StudiesPageGalleryImage(Orderable):
    page = ParentalKey(StudiesPage, on_delete=models.CASCADE, related_name='gallery_images')
    image = models.ForeignKey(
        'wagtailimages.Image', on_delete=models.CASCADE, related_name='+'
    )
    caption = models.CharField(blank=True, max_length=250)

    panels = [
        ImageChooserPanel('image'),
        FieldPanel('caption'),
    ]
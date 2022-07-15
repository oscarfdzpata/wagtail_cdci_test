from django.db import models

from wagtail.admin.edit_handlers import FieldPanel
from wagtail.core.fields import RichTextField
from wagtail.core.models import Page
from wagtail.images.edit_handlers import ImageChooserPanel

class SabiasQuePage(Page):
    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro', classname="full")
    ]

    def get_context(self, request):
        context = super().get_context(request)
        article_hightlights = ArticleHightlight.objects.all()
        context['article_hightlights'] = article_hightlights
        return context


class ArticleHightlight(models.Model):
    title = models.CharField(max_length=200, default="")
    description = models.CharField(max_length=400, default="")
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


class ArticlePage(Page):
    text = RichTextField(blank=True)
    hightlight = models.BooleanField(default=False)

    content_panels = Page.content_panels + [
        FieldPanel('text', classname="full"),
        FieldPanel('hightlight'),
    ]

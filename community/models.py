from django.db import models
from wagtail.core.models import Page
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.images.edit_handlers import ImageChooserPanel


from django.contrib.auth.forms import AuthenticationForm


class CommunityPage(Page):
    intro = RichTextField(blank=True)
    image = models.ForeignKey(
            'wagtailimages.Image', on_delete=models.SET_NULL, related_name='+', blank=True, null= True
        )

    register_title = models.CharField(max_length=150)
    register_body = RichTextField(blank=True)
    register_image = models.ForeignKey(
            'wagtailimages.Image', on_delete=models.SET_NULL, related_name='+', blank=True, null= True
        )
    member_title = models.CharField(max_length=150)
    member_body = RichTextField(blank=True)
    member_image = models.ForeignKey(
            'wagtailimages.Image', on_delete=models.SET_NULL, related_name='+', blank=True, null= True
        )
    max_count = 1
    subpage_types = []
    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        ImageChooserPanel('image'),
        FieldPanel('register_title'),
        ImageChooserPanel('register_image'),
        FieldPanel('register_body'),
        FieldPanel('member_title'),
        ImageChooserPanel('member_image'),
        FieldPanel('member_body'),
    ]

    def get_context(self, request, *args, **kwargs):
        context =  super().get_context(request, *args, **kwargs)
        context["loginform"] = AuthenticationForm
        print(request.user)
        return context

class CommunityWellcomePage(Page):
    max_count = 1
    subpage_types = []
    intro = RichTextField(blank=True)
    image = models.ForeignKey(
            'wagtailimages.Image', on_delete=models.PROTECT, related_name='+', blank=True, null= True
        )
    password_required_template = '../userManagement/templates/userManagement/register_page.html'
    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        ImageChooserPanel('image'),
    ]
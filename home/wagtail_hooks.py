from wagtail.contrib.modeladmin.options import (
    ModelAdmin, modeladmin_register)
from .models import Banner, Slide


class SlideAdmin(ModelAdmin):
    model = Slide
    menu_label = 'Diapositiva'  # ditch this to use verbose_name_plural from model
    menu_icon = 'resubmit'  # change as required
    menu_order = 200  # will put in 3rd place (000 being 1st, 100 2nd)
    add_to_settings_menu = False  # or True to add your model to the Settings sub-menu
    exclude_from_explorer = False # or True to exclude pages of this type from Wagtail's explorer view
    list_display = ('title', 'description')

class BannerAdmin(ModelAdmin):
    model = Banner
    menu_label = 'Banner'
    menu_icon = 'placeholder'
    menu_order = 300
    add_to_settings_menu = False
    exclude_from_explorer = False
    list_display = ('text', 'link')

# Now you just need to register your customised ModelAdmin class with Wagtail
modeladmin_register(SlideAdmin)
modeladmin_register(BannerAdmin)
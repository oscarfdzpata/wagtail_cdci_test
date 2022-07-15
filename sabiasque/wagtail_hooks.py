from wagtail.contrib.modeladmin.options import (
    ModelAdmin, modeladmin_register)
from .models import ArticleHightlight


class ArticleHightlightAdmin(ModelAdmin):
    model = ArticleHightlight
    menu_label = 'Artículo destacado' 
    menu_icon = 'pick' 
    menu_order = 400 
    add_to_settings_menu = False 
    exclude_from_explorer = False
    list_display = ('title', 'description')


modeladmin_register(ArticleHightlightAdmin)
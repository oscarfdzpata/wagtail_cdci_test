from django.db import models
from django import forms
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator


from wagtail.core.models import Page, Orderable
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.search import index
from wagtail.images.edit_handlers import ImageChooserPanel

from modelcluster.fields import ParentalKey, ParentalManyToManyField
from modelcluster.contrib.taggit import ClusterTaggableManager
from taggit.models import TaggedItemBase

from modelcluster.fields import ParentalKey


class BlogIndexPage(Page):
    """Page that lists all the blog posts (from the class BlogPage) and has a search filter"""
    
    image = models.ForeignKey(
            'wagtailimages.Image', on_delete=models.SET_NULL, related_name='+', blank=True, null= True
        )
    content_panels = Page.content_panels + [
        ImageChooserPanel('image'),
    ]
    max_count = 1
    subpage_types = [
        'blog.BlogPage',  
    ]
    def get_context(self, request,*args, **kwargs):
        """Custom querys for the context"""
        context = super().get_context(request, *args, **kwargs)
        context["all_categories"] = BlogCategory.objects.all()
        context["all_tags"] = BlogPageTag.objects.all()
        # context["posts"]= BlogPage.objects.live().public().order_by('-date')
        all_posts = self.get_children().live().public().order_by('-id')
        all_posts_dated = sorted(all_posts, key = lambda p: p.specific.date)
        context["all_posts"] = all_posts_dated.reverse()
        context["indexpage"] = self

        paginator = Paginator(all_posts_dated, 4)
        page = request.GET.get("page")
        try:
            # If the page exists and the ?page=x is an int
            posts = paginator.page(page)
        except PageNotAnInteger:
            # If the ?page=x is not an int; show the first page
            posts = paginator.page(1)
        except EmptyPage:
            # If the ?page=x is out of range (too high most likely)
            # Then return the last page
            posts = paginator.page(paginator.num_pages)
        context["posts"] = posts
        return context

    def get_child_tags(self):
        tags = []
        news_pages = BlogPage.objects.live().descendant_of(self)
        for page in news_pages:
            # Not tags.append() because we don't want a list of lists
            tags += page.get_tags
        tags = sorted(set(tags))
        return tags

    
class BlogPageTag(TaggedItemBase):
    content_object = ParentalKey(
        'BlogPage',
        related_name='tagged_items',
        on_delete=models.CASCADE
    )
from wagtail.core import hooks
class BlogPage(Page):
    """Class fot al the posts created from the BlogIndexPage"""
    date = models.DateField("Post date", blank=True, null=True)
    body = RichTextField(blank=True)
    tags = ClusterTaggableManager(through=BlogPageTag, blank=True)
    categories = ParentalManyToManyField('blog.BlogCategory', blank=True)
    view_count = models.PositiveBigIntegerField(default=0, db_index=True)
    search_fields = Page.search_fields + [
        index.SearchField('title'),
        index.SearchField('body'),
    ]
    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('date'),
            FieldPanel('tags'),
            FieldPanel('categories', widget=forms.CheckboxSelectMultiple),
        ], heading="Blog information"),
        FieldPanel('body'),
    ]
    def get_context(self, request,*args, **kwargs):
        context = super().get_context(request, *args, **kwargs)
        context["categories"] = self.categories.all()
        return context

    @property
    def get_tags(self):
        """
        Similar to the authors function above we're returning all the tags that
        are related to the blog post into a list we can access on the template.
        We're additionally adding a URL to access BlogPage objects with that tag
        """
        tags = self.tags.all()
        for tag in tags:
            tag.url = '/' + '/'.join(s.strip('/') for s in [
                self.get_parent().url,
                'tags',
                tag.slug
            ])
        return tags

    """Hook that increments page.view_count by one each time someone enters this page"""
    @hooks.register("before_serve_page")
    def increment_view_count(page, request, serve_args, serve_kwargs):
        if page.specific_class == BlogPage:
            BlogPage.objects.filter(pk=page.pk).update(view_count=page.view_count + 1)

    @property
    def get_comments(self):
        comments = Comment.objects.filter(post = self)
        print(comments)
        return comments

    def serve(self, request, *args, **kwargs):
        from django.shortcuts import render
        from .forms import CaptchaTestForm

        context = super().get_context(request)
        context["categories"] = self.categories.all()
        comments = Comment.objects.filter(post=self)

        if request.method == 'POST':
            form = CaptchaTestForm(request.POST)
            if form.is_valid():
                print("Es humano")
                comment = Comment.objects.create(
                    post = self,
                    author = request.user,
                    title = request.POST.get("titulo"),
                    body = request.POST.get("texto"),
                )
                comment.save()
            else:
                print("Es un robot!!")
        else:
            form = CaptchaTestForm()

        return render(request, 'blog/blog_page.html', {
            'context': context,
            'page': self,
            'form': form,
            'comments': comments,
        })

from wagtail.snippets.models import register_snippet

@register_snippet
class BlogCategory(models.Model):
    name = models.CharField(max_length=255)
    icon = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+'
    )

    panels = [
        FieldPanel('name'),
        ImageChooserPanel('icon'),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'blog categories'

class BlogTagIndexPage(Page):

    def get_context(self, request,*args, **kwargs):

        # Filter by tag
        tag = request.GET.get('tag')
        blogpages = BlogPage.objects.filter(tags__name=tag)

        # Update template context
        context = super().get_context(request, *args, **kwargs)
        context['blogpages'] = blogpages
        return context
# Create your models here.
class Comment(models.Model):
    post = models.ForeignKey(BlogPage, on_delete=models.PROTECT, null = True)
    title = models.CharField(max_length=255)
    web = models.CharField(max_length=255, null = True, blank = True)
    body = models.TextField()
    comment_date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey("userManagement.AppUser", on_delete=models.PROTECT, null = True)
    

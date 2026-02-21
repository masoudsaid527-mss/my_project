Django Integration for Restored HTML Pages

1. Add app in Django settings:
   INSTALLED_APPS = [
       ...,
       "django_hostel_pages",
   ]

2. Include URLs in your project urls.py:
   from django.urls import include, path

   urlpatterns = [
       ...,
       path("", include("django_hostel_pages.urls")),
   ]

3. Ensure templates/static are enabled in settings.py (default Django project already has this).

Available pages:
- /about/
- /rooms/
- /booking/
- /contact/
- /services/

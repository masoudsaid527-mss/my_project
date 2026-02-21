from django.urls import path

from . import views

urlpatterns = [
    path("about/", views.about_page, name="about_page"),
    path("rooms/", views.rooms_page, name="rooms_page"),
    path("booking/", views.booking_page, name="booking_page"),
    path("contact/", views.contact_page, name="contact_page"),
    path("services/", views.services_page, name="services_page"),
    # API endpoints
    path("api/register/", views.register, name="register"),
    path("api/login/", views.login_view, name="login"),
]

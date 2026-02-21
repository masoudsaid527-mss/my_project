from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    Admin configuration for UserProfile model
    """
    list_display = (
        'get_full_name',
        'user',
        'role',
        'is_verified',
        'created_at'
    )
    list_filter = ('role', 'is_verified', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at', 'updated_at', 'get_phone_display')
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'role', 'is_verified')
        }),
        ('Personal Details', {
            'fields': ('phone_number', 'date_of_birth', 'bio', 'profile_picture')
        }),
        ('Address', {
            'fields': ('address', 'city', 'state', 'postal_code', 'country'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    ordering = ('-created_at',)
    
    def get_full_name(self, obj):
        """Display user's full name"""
        return obj.full_name
    get_full_name.short_description = 'Full Name'
    
    def get_phone_display(self, obj):
        """Display phone number or 'Not provided'"""
        return obj.phone_number or 'Not provided'
    get_phone_display.short_description = 'Phone Number'

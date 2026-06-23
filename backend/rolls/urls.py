from django.urls import path
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from . import views, auth_views

urlpatterns = [
    # Auth
    path('auth/register/', auth_views.register),
    path('auth/login/', auth_views.login_view),
    path('auth/logout/', auth_views.logout_view),
    path('auth/me/', auth_views.me),

    # Profile
    path('profile/', views.profile),
    path('profile/bonus/', views.add_coins),

    # Play
    path('play/', views.play),
    path('rolls/', views.roll_history),
    path('rolls/clear/', views.roll_clear),
    path('stats/', views.stats),

    # Leaderboard (public)
    path('leaderboard/', views.leaderboard),
]

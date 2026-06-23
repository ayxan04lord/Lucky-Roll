from django.contrib import admin
from .models import Roll, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'coins', 'total_won', 'total_spent', 'games_played')
    search_fields = ('user__username',)
    ordering = ('-total_won',)


@admin.register(Roll)
class RollAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'game_type', 'sides', 'total', 'bet', 'winnings', 'timestamp')
    list_filter = ('game_type', 'sides')
    search_fields = ('user__username',)
    ordering = ('-timestamp',)
    readonly_fields = ('timestamp',)

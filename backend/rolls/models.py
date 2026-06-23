from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    coins = models.IntegerField(default=1000)
    total_won = models.IntegerField(default=0)
    total_spent = models.IntegerField(default=0)
    games_played = models.IntegerField(default=0)
    last_bonus = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} — {self.coins} coins"


class Roll(models.Model):
    GAME_TYPES = [
        ('classic', 'Classic Dice'),
        ('lucky7', 'Lucky 7'),
        ('jackpot', 'Jackpot'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rolls')
    game_type = models.CharField(max_length=20, choices=GAME_TYPES, default='classic')
    values = models.JSONField()
    sides = models.IntegerField()
    total = models.IntegerField()
    bet = models.IntegerField(default=10)
    winnings = models.IntegerField(default=0)   # net gain (can be negative)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} — {self.game_type} — bet:{self.bet} won:{self.winnings}"

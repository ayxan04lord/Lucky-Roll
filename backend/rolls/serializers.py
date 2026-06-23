from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Roll, Profile


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'coins', 'total_won', 'total_spent', 'games_played', 'last_bonus']


class RollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roll
        fields = ['id', 'game_type', 'values', 'sides', 'total', 'bet', 'winnings', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    games_played = serializers.IntegerField()

    class Meta:
        model = Profile
        fields = ['username', 'coins', 'total_won', 'games_played']

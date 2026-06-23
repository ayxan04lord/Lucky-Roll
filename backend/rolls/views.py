from django.db.models import Max, Avg, Sum
from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Roll, Profile
from .serializers import RollSerializer, ProfileSerializer, LeaderboardSerializer


def get_or_create_profile(user):
    profile, _ = Profile.objects.get_or_create(user=user)
    return profile


# ── Profile ───────────────────────────────────────────

@api_view(['GET'])
def profile(request):
    p = get_or_create_profile(request.user)
    return Response(ProfileSerializer(p).data)


@api_view(['POST'])
def add_coins(request):
    """Daily bonus — 500 coins, once every 24 hours."""
    from django.utils import timezone
    from datetime import timedelta

    p = get_or_create_profile(request.user)

    if p.last_bonus:
        next_bonus = p.last_bonus + timedelta(hours=24)
        now = timezone.now()
        if now < next_bonus:
            remaining = next_bonus - now
            total_seconds = int(remaining.total_seconds())
            hours = total_seconds // 3600
            minutes = (total_seconds % 3600) // 60
            seconds = total_seconds % 60
            return Response(
                {
                    'error': 'Bonus already claimed.',
                    'next_bonus_in': f'{hours:02d}:{minutes:02d}:{seconds:02d}',
                    'next_bonus_at': next_bonus.isoformat(),
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

    from django.utils import timezone
    p.coins += 500
    p.last_bonus = timezone.now()
    p.save()
    return Response({'coins': p.coins, 'message': '🎁 +500 bonus coins added!'})


# ── Rolls / Play ──────────────────────────────────────

@api_view(['GET'])
def roll_history(request):
    rolls = Roll.objects.filter(user=request.user)[:50]
    return Response(RollSerializer(rolls, many=True).data)


@api_view(['POST'])
def play(request):
    """
    Place a bet and roll.
    Body: { game_type, sides, dice_count, bet }
    Returns: { roll, profile }
    """
    import random

    game_type = request.data.get('game_type', 'classic')
    sides = int(request.data.get('sides', 6))
    dice_count = int(request.data.get('dice_count', 3))
    bet = int(request.data.get('bet', 10))

    if bet <= 0:
        return Response({'error': 'Bet must be positive.'}, status=status.HTTP_400_BAD_REQUEST)
    if dice_count < 1 or dice_count > 6:
        return Response({'error': 'Dice count must be 1-6.'}, status=status.HTTP_400_BAD_REQUEST)

    p = get_or_create_profile(request.user)

    if p.coins < bet:
        return Response({'error': 'Not enough coins.'}, status=status.HTTP_400_BAD_REQUEST)

    values = [random.randint(1, sides) for _ in range(dice_count)]
    total = sum(values)
    max_total = sides * dice_count
    min_total = dice_count

    # ── Win calculation ────────────────────────────────
    winnings = 0
    result_label = 'lose'

    if game_type == 'lucky7':
        # Lucky 7: total == 7 → 5x, contains a 7 → 2x
        if total == 7:
            winnings = bet * 5
            result_label = 'jackpot'
        elif 7 in values:
            winnings = bet * 2
            result_label = 'win'

    elif game_type == 'jackpot':
        # Jackpot: all same → 10x, top 20% → 3x, top 40% → 1.5x
        if len(set(values)) == 1:
            winnings = bet * 10
            result_label = 'jackpot'
        elif total >= max_total * 0.8:
            winnings = int(bet * 3)
            result_label = 'big_win'
        elif total >= max_total * 0.6:
            winnings = int(bet * 1.5)
            result_label = 'win'

    else:  # classic
        # Classic: top 25% → 3x, top 50% → 1.5x
        threshold_high = min_total + (max_total - min_total) * 0.75
        threshold_mid = min_total + (max_total - min_total) * 0.5
        if total >= threshold_high:
            winnings = int(bet * 3)
            result_label = 'big_win'
        elif total >= threshold_mid:
            winnings = int(bet * 1.5)
            result_label = 'win'

    net = winnings - bet  # net change to coins

    with transaction.atomic():
        p.coins += net
        p.total_spent += bet
        if winnings > 0:
            p.total_won += winnings
        p.games_played += 1
        p.save()

        roll = Roll.objects.create(
            user=request.user,
            game_type=game_type,
            values=values,
            sides=sides,
            total=total,
            bet=bet,
            winnings=winnings,
        )

    return Response({
        'roll': RollSerializer(roll).data,
        'profile': ProfileSerializer(p).data,
        'result_label': result_label,
        'net': net,
    })


@api_view(['DELETE'])
def roll_clear(request):
    Roll.objects.filter(user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── Stats ─────────────────────────────────────────────

@api_view(['GET'])
def stats(request):
    rolls = Roll.objects.filter(user=request.user)
    total_rolls = rolls.count()

    if total_rolls == 0:
        return Response({
            'totalRolls': 0,
            'highestTotal': 0,
            'averageTotal': 0.0,
            'totalWon': 0,
            'totalSpent': 0,
            'faceFrequency': {},
        })

    p = get_or_create_profile(request.user)
    from collections import Counter
    face_freq: Counter = Counter()
    for roll in rolls:
        face_freq.update(roll.values)

    return Response({
        'totalRolls': total_rolls,
        'highestTotal': rolls.aggregate(Max('total'))['total__max'] or 0,
        'averageTotal': round(rolls.aggregate(Avg('total'))['total__avg'] or 0, 2),
        'totalWon': p.total_won,
        'totalSpent': p.total_spent,
        'faceFrequency': dict(face_freq),
    })


# ── Leaderboard ───────────────────────────────────────

@api_view(['GET'])
def leaderboard(request):
    from rest_framework.permissions import AllowAny
    top = Profile.objects.select_related('user').order_by('-total_won')[:20]
    return Response(LeaderboardSerializer(top, many=True).data)

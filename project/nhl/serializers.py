from rest_framework import serializers
from nhl.models import Player, Team

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        exclude = ('created_at', )

""" 
class TeamPlayersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('firstname', 'lastname', 'ice_position', 'team',)
"""

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        exclude = ('created_at', )


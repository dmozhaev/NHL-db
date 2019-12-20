from django.db import models
from nhl.enums import Conference, Country, Division, IcePosition, Shoots


class Team(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, unique=True)
    national_team = models.BooleanField(default=False)
    conference = models.CharField(
      max_length=20,
      choices=[(tag.name, tag.value) for tag in Conference],
      null=True
    )
    division = models.CharField(
      max_length=20,
      choices=[(tag.name, tag.value) for tag in Division],
      null=True
    )
    founded = models.IntegerField(default=0)
    arena = models.CharField(max_length=100, null=True)
    wins = models.IntegerField(default=0)
    logo = models.ImageField(upload_to='team_logos', null=True)


class Player(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    country = models.CharField(
      max_length=3,
      choices=[(tag.name, tag.value) for tag in Country]
    )
    ice_position = models.CharField(
      max_length=2,
      choices=[(tag.name, tag.value) for tag in IcePosition]
    )
    shoots = models.CharField(
      max_length=1,
      choices=[(tag.name, tag.value) for tag in Shoots]
    )
    jersey = models.IntegerField(default=0)
    logo = models.ImageField(upload_to='player_logos', null=True)
    line = models.IntegerField(default=None, blank=True, null=True)

    class Meta:
        unique_together = ("team", "jersey")


class History(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    season = models.CharField(max_length=20)

    class Meta:
        unique_together = ("player", "season")


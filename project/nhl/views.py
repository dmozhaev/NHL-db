from rest_framework import parsers, viewsets
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from django.core.paginator import Paginator
from django.http import HttpResponse, Http404
import json
from random import choice

from nhl.models import Player, Team, History
from .serializers import PlayerSerializer, TeamSerializer

class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    queryset = Team.objects.all()


class PlayerViewSet(viewsets.ModelViewSet):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all()

    def list(self, request, *args, **kwargs):

        # filtering
        queryset = Player.objects.all()
        teams = request.GET.getlist('team[]')
        if teams: 
            queryset = queryset.filter(team__name__in=teams)
        countries = request.GET.getlist('country[]')
        if countries: 
            queryset = queryset.filter(country__in=countries)
        ice_positions = request.GET.getlist('ice_position[]')
        if ice_positions: 
            queryset = queryset.filter(ice_position__in=ice_positions)
        shoots = request.GET.getlist('shoots[]')
        if shoots: 
            queryset = queryset.filter(shoots__in=shoots)

        # sorting
        sort_field = request.GET.get('sortField')
        sort_order = request.GET.get('sortOrder')

        if sort_order is not None: 
            if sort_order == 'descend':
                sort_field = '-{}'.format(sort_field)

        if sort_field is not None:    
            queryset = queryset.order_by(sort_field)

        # pagination
        page = request.GET.get('page')
        results = request.GET.get('results')

        if results is not None: 
            paginator = Paginator(queryset, results)
        else:
            paginator = Paginator(queryset, 20)  

        if page is not None:
            players = paginator.get_page(page)
        else:
            players = paginator.get_page(1)

        serializer = self.get_serializer(players, many=True)
        return Response(serializer.data)


class PlayersCount(GenericViewSet):
    """
    list:
        Get total number of players.
    """
    def list(self, request, *args, **kwargs):

        # filtering
        queryset = Player.objects.all()
        teams = request.GET.getlist('team[]')
        if teams: 
            queryset = queryset.filter(team__name__in=teams)
        countries = request.GET.getlist('country[]')
        if countries: 
            queryset = queryset.filter(country__in=countries)
        ice_positions = request.GET.getlist('ice_position[]')
        if ice_positions: 
            queryset = queryset.filter(ice_position__in=ice_positions)
        shoots = request.GET.getlist('shoots[]')
        if shoots: 
            queryset = queryset.filter(shoots__in=shoots)

        return Response(
            {"player_count": queryset.count()}
        )


class TeamPlayersSeason(GenericViewSet):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all()

    """
    list:
        Get player list for a given team and season.
    """
    def list(self, request, team_id=None):
        season = request.GET.get('season')
        if season:
            player_ids = History.objects.filter(team=team_id, season=season).values('player')
            queryset = Player.objects.filter(id__in=player_ids).order_by('lastname', 'firstname')
        else:
            queryset = Player.objects.filter(team=team_id).order_by('lastname', 'firstname')

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TransferViewSet(GenericViewSet):

    def generate_jersey(self, used_jerseys, current_jersey):
        if current_jersey in used_jerseys:
            return choice([i for i in range(1,98) if i not in used_jerseys])
        else:
            return current_jersey


    def change_team(self, playersIds, new_team, create_mode): 
        players = Player.objects.filter(id__in=playersIds)
        used_jerseys_queryset = Player.objects.filter(team__id=new_team.id).values_list('jersey', flat=True)
        used_jerseys = list(used_jerseys_queryset)
        for player in players:
            if create_mode:
                player.pk = None
            player.team = new_team

            # generate new jersey if there is a conflict
            if len(used_jerseys) < 98:
                player.jersey = self.generate_jersey(used_jerseys, player.jersey)
            used_jerseys.append(player.jersey)

            player.save()

    """
    create:
        perform transfer
    """
    def create(self, request):
        json_data = json.loads(request.body)
        team1Id = json_data['team1Id']
        playersTeam1Ids = json_data['playersTeam1Ids']
        team2Id = json_data['team2Id']
        playersTeam2Ids = json_data['playersTeam2Ids']

        # double-check for POST data on server side
        if team1Id is None or team2Id is None:
            raise Http404("Both teams should be present in order to complete the transfer")
        if not playersTeam1Ids and not playersTeam2Ids:
            raise Http404("Players at least from one team should be present in order to complete the transfer")

        team1 = Team.objects.get(pk=team1Id)
        team2 = Team.objects.get(pk=team2Id)

        if team1 == team2:
            raise Http404("Please select different teams to perform transfer")
        if team1.national_team and team2.national_team:
            raise Http404("Transfer cannot happen between two national teams")

        # ordinary trade between two NHL teams
        if not team1.national_team and not team2.national_team:
            if playersTeam1Ids:
                self.change_team(playersTeam1Ids, team2, False)
            if playersTeam2Ids:
                self.change_team(playersTeam2Ids, team1, False)
            return HttpResponse('')    
                
        # one-way "trade" between NHL tam and natioanl team (copying the player)
        elif team1.national_team and not team2.national_team:
            national_team = team1
            if playersTeam2Ids:
                playersIds = playersTeam2Ids
            else:
                raise Http404("Players from NHL team should be present in order to complete the transfer")    
        else:
            national_team = team2
            if playersTeam1Ids:
                playersIds = playersTeam1Ids
            else:
                raise Http404("Players from NHL team should be present in order to complete the transfer")  
        self.change_team(playersIds, national_team, True)
        return HttpResponse('')


class EditLinesViewSet(GenericViewSet):

    def update_line(self, player_ids, line_value=None):
        players = Player.objects.filter(id__in=player_ids)
        for player in players:
            player.line = line_value
        Player.objects.bulk_update(players, ['line'])

    """
    create:
        confirm line changes
    """
    def create(self, request):
        json_data = json.loads(request.body)
        bench = json_data['bench']
        line1 = json_data['line1']
        line2 = json_data['line2']
        line3 = json_data['line3']
        line4 = json_data['line4']

        if bench:
            self.update_line(bench)
        if line1:
            self.update_line(line1, 1)
        if line2:
            self.update_line(line2, 2)
        if line3:
            self.update_line(line3, 3)
        if line4:
            self.update_line(line4, 4)

        return HttpResponse('')


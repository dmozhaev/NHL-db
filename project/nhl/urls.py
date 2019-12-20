from nhl.views import PlayerViewSet, TeamViewSet, PlayersCount, TeamPlayersSeason, TransferViewSet, EditLinesViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers as nested_routers
from django.urls import include, re_path

router = DefaultRouter()
router.register(r'players/count', PlayersCount, base_name='players-count')
router.register(r'players', PlayerViewSet, base_name='players')
router.register(r'teams', TeamViewSet, base_name='teams')
router.register(r'teams/(?P<team_id>[0-9]+)/players', TeamPlayersSeason, base_name='players-season')
router.register(r'transfer/perform', TransferViewSet, base_name='transfer-perform')
router.register(r'editlines/save', EditLinesViewSet, base_name='editlines-save')
urlpatterns = router.urls


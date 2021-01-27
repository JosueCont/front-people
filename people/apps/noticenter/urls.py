from . import views
from rest_framework import routers

app_name = 'noticenter'

router = routers.SimpleRouter()
router.register(r'notification', views.NotificationViewSet)

urlpatterns = [
    #path('import-export-person', views.ImportExportPersonViewSet.as_view()),
]

urlpatterns = router.urls + urlpatterns

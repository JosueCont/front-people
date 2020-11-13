from . import views
from rest_framework import routers

app_name = 'business'

router = routers.SimpleRouter()
router.register(r'node', views.NodeViewSet)
router.register(r'node-person', views.NodePersonViewSet)

urlpatterns = router.urls
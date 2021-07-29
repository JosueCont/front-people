from . import views
from rest_framework import routers

app_name = 'business'

router = routers.SimpleRouter()
router.register(r'node', views.NodeViewSet)
router.register(r'node-person', views.NodePersonViewSet)
router.register(r'department', views.DepartmentViewSet)
router.register(r'job-department', views.JobDepartmentViewSet)

urlpatterns = router.urls
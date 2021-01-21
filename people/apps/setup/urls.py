from . import views
from rest_framework import routers

app_name = 'setup'

router = routers.SimpleRouter()
router.register(r'relationship', views.RelationshipViewSet)
router.register(r'banks', views.BankViewSet)
router.register(r'experience-type', views.ExperienceTypeViewSet)
router.register(r'reason-separation', views.ReasonSeparationViewSet)
router.register(r'labor-relationship', views.LaborRelationshipViewSet)

urlpatterns = router.urls

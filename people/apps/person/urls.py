from . import views
from rest_framework import routers

app_name = 'person'

router = routers.SimpleRouter()
router.register(r'person', views.PersonViewSet)
router.register(r'person-type', views.PersonTypeViewSet)
router.register(r'job', views.JobViewSet)

router.register(r'general-person', views.GeneralPersonViewSet)
router.register(r'address', views.AddressViewSet)
router.register(r'training', views.TrainingViewSet)
router.register(r'bank-account', views.BankAccountViewSet)

urlpatterns = router.urls

from django.urls import path

from . import views
from rest_framework import routers

app_name = 'person'

router = routers.SimpleRouter()
router.register(r'person', views.PersonViewSet)
router.register(r'person-type', views.PersonTypeViewSet)
router.register(r'job', views.JobViewSet)

router.register(r'general-person', views.GeneralPersonViewSet)
router.register(r'family', views.FamilyViewSet)
router.register(r'contact-emergency', views.ContactEmergencyViewSet)
router.register(r'experience-job', views.ExperienceJobViewSet)
router.register(r'address', views.AddressViewSet)
router.register(r'training', views.TrainingViewSet)
router.register(r'bank-account', views.BankAccountViewSet)
router.register(r'phone', views.PhoneViewSet)

urlpatterns = [
    path('import-export-person', views.ImportExportPersonViewSet.as_view()),
    path('import-export-person/<format_file>', views.ImportExportPersonViewSet.as_view()),
]

urlpatterns = router.urls + urlpatterns

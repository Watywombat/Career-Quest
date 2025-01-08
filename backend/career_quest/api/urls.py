from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, UserProfileViewSet, CompanyViewSet, JobOfferViewSet, ApplicationViewSet, RegisterView

router = DefaultRouter()
router.register(r'users', UserProfileViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'joboffers', JobOfferViewSet)
router.register(r'applications', ApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]

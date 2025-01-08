from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from .models import UserProfile, Company, JobOffer, Application
from .serializers import UserProfileSerializer, UserProfileUpdateSerializer, CompanySerializer, JobOfferSerializer, \
                         ApplicationSerializer



class RegisterView(generics.GenericAPIView):
    permission_classes = [AllowAny]  # Allow any user to register

    def post(self, request, *args, **kwargs):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            # Create the user and UserProfile
            user_profile = serializer.save()

            # Retrieve or create the token for the newly registered user
            token, created = Token.objects.get_or_create(user=user_profile.user)

            # Get the `is_recruiter` field from the UserProfile
            is_recruiter = user_profile.is_recruiter

            # Return token and is_recruiter in the response
            return Response({
                "token": token.key,
                "is_recruiter": is_recruiter,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]  # Allow any user to access this endpoint

    # No serializer is required for this simple login
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        print(username, password)


        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        token, created = Token.objects.get_or_create(user=user)

        try:
            user_profile = UserProfile.objects.get(user=user)
            user_id = user_profile.id
            is_recruiter = user_profile.is_recruiter
        except UserProfile.DoesNotExist:
            return Response({"detail": "UserProfile not found."}, status=status.HTTP_404_NOT_FOUND)

            # Return token and the `is_recruiter` flag in the response
        return Response({
            "token": token.key,
            "user_id": user_id,
            "is_recruiter": is_recruiter,
        }, status=status.HTTP_200_OK)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [IsAdminUser]
        elif self.action == 'profile':
            permission_classes = [IsAuthenticated]
        elif self.action == ['edit_user', 'delete_user']:
            permission_classes = [IsAdminUser]  # Only admins can delete any user
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        user_profile = self.get_queryset().get(user=request.user)

        if request.method == 'PATCH':
            serializer = UserProfileUpdateSerializer(user_profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(user_profile)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-company/(?P<company_id>\d+)',
            permission_classes=[IsAuthenticated])
    def by_company(self, request, company_id=None):
        """
        Filter profiles based on the company_id provided in the URL
        """

        # Filter profiles based on the company_id and exclude the current user
        user_profiles = UserProfile.objects.filter(company_id=company_id).exclude(user=request.user)

        # Check if there are any profiles left after excluding the current user
        if not user_profiles.exists():
            return Response({"detail": "No other users found for this company."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the remaining user profiles
        serializer = self.get_serializer(user_profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], permission_classes=[IsAuthenticated])
    def delete_account(self, request):
        user = request.user
        user.delete()

        return Response({"detail": "User account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['patch'], url_path='edit-user/(?P<user_id>\d+)',
            permission_classes=[IsAdminUser])
    def edit_user(self, request, user_id=None):
        """
        Allows an admin to edit a user's profile by their user ID.
        Supports both partial and full updates (PATCH/PUT).
        """
        try:
            # Get the UserProfile based on the user_id
            user_profile = UserProfile.objects.get(user_id=user_id)

            if request.method == 'PATCH':
                # Partial update
                serializer = UserProfileUpdateSerializer(user_profile, data=request.data, partial=True)
            else:
                # Full update (PUT)
                serializer = UserProfileUpdateSerializer(user_profile, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except UserProfile.DoesNotExist:
            return Response({"detail": "UserProfile not found."}, status=status.HTTP_404_NOT_FOUND)

    # New action to allow admin to delete any user by ID
    @action(detail=False, methods=['delete'], url_path='delete-user/(?P<user_id>\d+)',
            permission_classes=[IsAdminUser])
    def delete_user(self, request, user_id=None):
        """
        Allows an admin to delete a user and their profile by the user ID
        """
        try:
            # Get the User object by user_id
            user_to_delete = User.objects.get(id=user_id)

            # The associated UserProfile will be automatically deleted due to the on_delete=models.CASCADE
            user_to_delete.delete()  # Deletes the user and cascades to UserProfile

            return Response({"detail": "User and profile deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]


class JobOfferViewSet(viewsets.ModelViewSet):
    queryset = JobOffer.objects.all()
    serializer_class = JobOfferSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], url_path='by-company/(?P<company_id>\d+)',
            permission_classes=[IsAuthenticated])
    def by_company(self, request, company_id=None):
        """
        Filter profiles based on the company_id provided in the URL
        """

        # Filter profiles based on the company_id and exclude the current user
        job_offers = JobOffer.objects.filter(company_id=company_id)

        # Check if there are any profiles left after excluding the current user
        if not job_offers.exists():
            return Response({"detail": "No other job offers found for this company."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the remaining user profiles
        serializer = self.get_serializer(job_offers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Always return applications for the authenticated user
        return Application.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        # Call the superclass list method to handle serialization and response
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

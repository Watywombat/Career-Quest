from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import UserProfile, Company, JobOffer, Application


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    # Fields from the related User model
    id = serializers.ReadOnlyField(source='user.id')
    username = serializers.CharField(source='user.username', required=True)
    email = serializers.EmailField(source='user.email', required=True)
    password = serializers.CharField(source='user.password', write_only=True, style={'input_type': 'password'},
                                     required=True)

    # Fields from the UserProfile model
    description = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    company = CompanySerializer(required=False, allow_null=True)
    is_recruiter = serializers.BooleanField(required=True)
    is_staff = serializers.BooleanField(source='user.is_staff', required=False)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'password', 'description', 'company', 'is_recruiter', 'is_staff']

    def validate_email(self, value):
        """
        Check if the email already exists in the User model.
        """
        user = self.instance.user if self.instance else None
        if User.objects.filter(email=value).exclude(id=user.id if user else None).exists():
            raise ValidationError("This email is already in use.")
        return value

    def create(self, validated_data):
        # Extract user-related fields from validated_data
        user_data = validated_data.pop('user')
        username = user_data.get('username')
        email = user_data.get('email')
        password = user_data.get('password')

        # Create the User
        user = User.objects.create_user(username=username, email=email, password=password)

        # Create the UserProfile with the user
        user_profile = UserProfile.objects.create(user=user, **validated_data)

        return user_profile


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    # Fields from the related User model
    username = serializers.CharField(source='user.username', required=True)
    email = serializers.EmailField(source='user.email', required=True)
    password = serializers.CharField(source='user.password', write_only=True, style={'input_type': 'password'},
                                     required=True)

    # Fields from the UserProfile model
    description = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    is_recruiter = serializers.BooleanField(required=True)
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'password', 'description', 'is_recruiter', 'company']

    def update(self, instance, validated_data):
        # Extract user-related fields from validated_data
        user_data = validated_data.pop('user', None)

        # Update the User model fields (if provided)
        if user_data:
            instance.user.username = user_data.get('username', instance.user.username)
            instance.user.email = user_data.get('email', instance.user.email)

            # Update the password if it was provided
            password = user_data.get('password')
            if password:
                instance.user.set_password(password)
            instance.user.save()

        # Update UserProfile fields
        instance.description = validated_data.get('description', instance.description)
        instance.is_recruiter = validated_data.get('is_recruiter', instance.is_recruiter)

        if 'company' in validated_data:
            # If 'company' is a dictionary, it means it's coming from the serializer,
            # else it's an ID and we will just set the company ID.
            company_data = validated_data.get('company', None)
            if isinstance(company_data, dict):
                # This means it's detailed information from the CompanySerializer.
                company_id = company_data.get('id', None)
                if company_id:
                    instance.company_id = company_id
            else:
                # It's an ID being sent from the frontend directly.
                instance.company_id = company_data
        instance.save()

        return instance


class JobOfferSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), write_only=True)
    company_details = CompanySerializer(source='company', read_only=True)
    created_at = serializers.DateTimeField(format="%B %d, %Y %I:%M %p", read_only=True)

    class Meta:
        model = JobOffer
        fields = '__all__'

    def to_representation(self, instance):
        # Get the default representation
        representation = super().to_representation(instance)
        # Add the company details under the 'company' key
        representation['company'] = representation.pop('company_details')
        return representation


class ApplicationSerializer(serializers.ModelSerializer):
    job_offer = serializers.PrimaryKeyRelatedField(queryset=JobOffer.objects.all(), write_only=True)
    job_offer_details = JobOfferSerializer(source='job_offer', read_only=True)
    applied_date = serializers.DateTimeField(format="%B %d, %Y %I:%M %p", read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job_offer', 'job_offer_details', 'applied_date']

    def to_representation(self, instance):
        # Get the default representation
        representation = super().to_representation(instance)
        # Add the company details under the 'company' key
        representation['job_offer'] = representation.pop('job_offer_details')
        return representation



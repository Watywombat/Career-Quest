from django.db import models
from django.contrib.auth.models import User


class Company(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    resume = models.FileField(upload_to='media/resumes/', blank=True, null=True)
    is_recruiter = models.BooleanField(default=False)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, related_name='users', blank=True, null=True)

    def __str__(self):
        return self.user.username


class JobOffer(models.Model):
    CATEGORY_CHOICES = [
        ('cdi', 'CDI'),
        ('cdd', 'CDD'),
        ('stage', 'stage'),
        ('alternance', 'alternance'),
        ('full-time', 'Full_Time'),
        ('part-time', 'Part_Time')
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs_offers')
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)
    working_time = models.IntegerField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Application(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name='applications')
    applied_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job_offer')  # Ensures a user can only apply once per job offer

    def __str__(self):
        return f"{self.user.username} applied for {self.job_offer.title}"


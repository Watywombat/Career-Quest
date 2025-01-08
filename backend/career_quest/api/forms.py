from django import forms
from .models import Company, JobOffer


class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = '__all__'


class JobForm(forms.ModelForm):
    class Meta:
        model = JobOffer
        fields = ['title', 'description', 'location', 'company', 'category', 'working_time', 'salary']
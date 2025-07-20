from rest_framework import serializers
from .models import UserSignup

class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSignup
        fields = '__all__'

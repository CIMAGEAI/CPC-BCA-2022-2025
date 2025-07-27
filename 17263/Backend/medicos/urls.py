from django.urls import path
from .views import get_products, recommend_products, chat_assistant

urlpatterns = [
    path('products/', get_products),
    path('recommend/', recommend_products),      # for Smart Recommendation
    path('chat/', chat_assistant),              # for AI Chat Assistant
]

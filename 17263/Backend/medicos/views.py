import os
from dotenv import load_dotenv
import google.generativeai as genai
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer


load_dotenv()
genai.configure(api_key=os.getenv("OPENAI_API_KEY"))

@api_view(['GET'])
def get_products(request):
    category = request.GET.get('category')
    products = Product.objects.filter(category=category) if category else Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def recommend_products(request):
    symptom = request.data.get("symptom")
    prompt = f"""
    A user reports the symptom: "{symptom}".
    Suggest 2-3 over-the-counter medicines or home remedies that are commonly available at a pharmacy.
    Keep it short and simple.
    """
    try:
        model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")  `
        chat = model.start_chat(history=[])
        response = chat.send_message(prompt)
        return Response({"recommendation": response.text})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def chat_assistant(request):
    question = request.data.get("question")
    prompt = f"""
    A user asks: "{question}".
    Respond as a friendly and clear medical assistant in simple language.
    """
    try:
        model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")
        chat = model.start_chat(history=[])
        response = chat.send_message(prompt)
        return Response({"answer": response.text})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

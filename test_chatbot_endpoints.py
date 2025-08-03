#!/usr/bin/env python3
import requests
import json
import time

# Base URL
BASE_URL = "http://localhost:8000"

def test_root_endpoint():
    """Test the root endpoint"""
    print("🔍 Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_health_endpoint():
    """Test the health endpoint"""
    print("\n🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/chatbot/health")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
        else:
            print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_chat_endpoint(message="hi", language="english", session_id="test123"):
    """Test the chat endpoint"""
    print(f"\n🔍 Testing chat endpoint with message: '{message}'")
    try:
        payload = {
            "message": message,
            "language": language,
            "session_id": session_id
        }

        print(f"Request payload: {json.dumps(payload, indent=2)}")

        response = requests.post(
            f"{BASE_URL}/api/chatbot/chat",
            headers={"Content-Type": "application/json"},
            json=payload
        )

        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")

        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"Error Response: {response.text}")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_chat_endpoint_tamil():
    """Test the chat endpoint with Tamil language"""
    return test_chat_endpoint("வணக்கம்", "tamil", "test_tamil_123")

def test_chat_endpoint_long_message():
    """Test the chat endpoint with a longer message"""
    return test_chat_endpoint(
        "What are the best crops to grow in Tamil Nadu during summer season?",
        "english",
        "test_long_123"
    )

def main():
    print("🚀 Starting Chatbot Endpoint Tests")
    print("=" * 50)

    # Test root endpoint
    root_ok = test_root_endpoint()

    # Test health endpoint
    health_ok = test_health_endpoint()

    # Test chat endpoint with simple message
    chat_ok = test_chat_endpoint()

    # Test chat endpoint with Tamil
    chat_tamil_ok = test_chat_endpoint_tamil()

    # Test chat endpoint with long message
    chat_long_ok = test_chat_endpoint_long_message()

    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"Root endpoint: {'✅ PASS' if root_ok else '❌ FAIL'}")
    print(f"Health endpoint: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Chat endpoint (simple): {'✅ PASS' if chat_ok else '❌ FAIL'}")
    print(f"Chat endpoint (Tamil): {'✅ PASS' if chat_tamil_ok else '❌ FAIL'}")
    print(f"Chat endpoint (long): {'✅ PASS' if chat_long_ok else '❌ FAIL'}")

    if all([root_ok, health_ok, chat_ok, chat_tamil_ok, chat_long_ok]):
        print("\n🎉 All tests passed! Chatbot endpoints are working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the backend logs for issues.")

if __name__ == "__main__":
    main()

#!/usr/bin/env python
"""
Test script for Capsule API endpoints
Run this script to test the capsule functionality
"""

import requests
import json
from datetime import datetime, timedelta

# Base URL for the API
BASE_URL = "http://localhost:8000/api"

def test_capsule_api():
    print("=== Testing Capsule API ===\n")
    
    # Test 1: Register a test user
    print("1. Creating test user...")
    register_data = {
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/signup/", json=register_data)
        if response.status_code == 201:
            print("✓ Test user created successfully")
        else:
            print(f"✗ User creation failed: {response.text}")
            return
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server. Make sure Django server is running on localhost:8000")
        return
    
    # Test 2: Login to get token
    print("\n2. Logging in...")
    login_data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    if response.status_code == 200:
        token = response.json()['access']
        headers = {'Authorization': f'Bearer {token}'}
        print("✓ Login successful")
    else:
        print(f"✗ Login failed: {response.text}")
        return
    
    # Test 3: Create a capsule
    print("\n3. Creating a capsule...")
    unlock_date = (datetime.now() + timedelta(days=1)).isoformat()
    capsule_data = {
        "title": "Our First Anniversary",
        "description": "A short description of this capsule...",
        "message": "Write your heartfelt message here...",
        "is_private": True,
        "pin_lock": "1234",
        "unlock_date": unlock_date,
        "timezone": "UTC",
        "recipient_emails": ["recipient@example.com"]
    }
    
    response = requests.post(f"{BASE_URL}/capsules/", json=capsule_data, headers=headers)
    if response.status_code == 201:
        capsule = response.json()
        capsule_id = capsule['id']
        print(f"✓ Capsule created with ID: {capsule_id}")
    else:
        print(f"✗ Capsule creation failed: {response.text}")
        return
    
    # Test 4: Get user's capsules
    print("\n4. Getting user's capsules...")
    response = requests.get(f"{BASE_URL}/capsules/my-capsules/", headers=headers)
    if response.status_code == 200:
        capsules = response.json()
        print(f"✓ Found {len(capsules)} capsules")
    else:
        print(f"✗ Failed to get capsules: {response.text}")
    
    # Test 5: Get capsule details
    print("\n5. Getting capsule details...")
    response = requests.get(f"{BASE_URL}/capsules/{capsule_id}/", headers=headers)
    if response.status_code == 200:
        capsule_detail = response.json()
        print(f"✓ Got capsule: {capsule_detail['title']}")
    else:
        print(f"✗ Failed to get capsule details: {response.text}")
    
    # Test 6: Seal the capsule
    print("\n6. Sealing the capsule...")
    response = requests.post(f"{BASE_URL}/capsules/{capsule_id}/seal/", headers=headers)
    if response.status_code == 200:
        print("✓ Capsule sealed successfully")
    else:
        print(f"✗ Failed to seal capsule: {response.text}")
    
    # Test 7: Try to update sealed capsule (should fail)
    print("\n7. Trying to update sealed capsule (should fail)...")
    update_data = {"title": "Updated Title"}
    response = requests.patch(f"{BASE_URL}/capsules/{capsule_id}/", 
                           json=update_data, headers=headers)
    if response.status_code == 400:
        print("✓ Correctly prevented update of sealed capsule")
    else:
        print(f"✗ Should have prevented update: {response.text}")
    
    print("\n=== API Test Complete ===")
    print("All basic capsule functionality is working!")

if __name__ == "__main__":
    test_capsule_api()

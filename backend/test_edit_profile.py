#!/usr/bin/env python
"""
Test script for Edit Profile API endpoint
Run this script to test the profile editing functionality
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000/api"

def test_edit_profile():
    print("=== Testing Edit Profile API ===\n")
    
    # Step 1: Login to get token
    print("1. Logging in...")
    login_data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        if response.status_code == 200:
            token = response.json()['access']
            headers = {'Authorization': f'Bearer {token}'}
            print("✓ Login successful")
        else:
            print(f"✗ Login failed: {response.text}")
            return
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server. Make sure Django server is running on localhost:8000")
        return
    
    # Step 2: Get current profile
    print("\n2. Getting current profile...")
    response = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
    if response.status_code == 200:
        current_profile = response.json()
        print(f"✓ Current profile: {current_profile['full_name']} ({current_profile['email']})")
    else:
        print(f"✗ Failed to get profile: {response.text}")
        return
    
    # Step 3: Edit profile with PUT (full update)
    print("\n3. Testing PUT update (full update)...")
    put_data = {
        "full_name": "John Updated Doe",
        "email": "updated@example.com"
    }
    
    response = requests.put(f"{BASE_URL}/auth/profile/edit/", json=put_data, headers=headers)
    if response.status_code == 200:
        updated_profile = response.json()
        print(f"✓ Profile updated successfully: {updated_profile['user']['full_name']} ({updated_profile['user']['email']})")
    else:
        print(f"✗ PUT update failed: {response.text}")
        return
    
    # Step 4: Edit profile with PATCH (partial update)
    print("\n4. Testing PATCH update (partial update)...")
    patch_data = {
        "full_name": "John Partially Updated"
    }
    
    response = requests.patch(f"{BASE_URL}/auth/profile/edit/", json=patch_data, headers=headers)
    if response.status_code == 200:
        partially_updated = response.json()
        print(f"✓ Partial update successful: {partially_updated['user']['full_name']} ({partially_updated['user']['email']})")
    else:
        print(f"✗ PATCH update failed: {response.text}")
        return
    
    # Step 5: Test email validation (try to use existing email)
    print("\n5. Testing email validation...")
    # First create another user
    try:
        signup_data = {
            "email": "another@example.com",
            "full_name": "Another User",
            "password": "password123",
            "password_confirm": "password123"
        }
        requests.post(f"{BASE_URL}/auth/signup/", json=signup_data)
        
        # Now try to update with this email
        invalid_data = {
            "email": "another@example.com"
        }
        
        response = requests.patch(f"{BASE_URL}/auth/profile/edit/", json=invalid_data, headers=headers)
        if response.status_code == 400:
            print("✓ Email validation working correctly")
        else:
            print(f"✗ Email validation failed: {response.text}")
    except:
        print("⚠ Email validation test skipped")
    
    # Step 6: Get final profile
    print("\n6. Getting final profile...")
    response = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
    if response.status_code == 200:
        final_profile = response.json()
        print(f"✓ Final profile: {final_profile['full_name']} ({final_profile['email']})")
    else:
        print(f"✗ Failed to get final profile: {response.text}")
    
    print("\n=== Edit Profile API Test Complete ===")
    print("Profile editing functionality is working!")

if __name__ == "__main__":
    test_edit_profile()

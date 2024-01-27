import requests
import urllib.parse
from datetime import datetime, timedelta
import secrets
import string

CLIENT_ID = 'c0ecea08e95a467ab50824a0c9e2e150'
CLIENT_SECRET = 'e7c5c2c3246c441b97fc244f2985fdbc'
REDIRECT_URI = 'http://localhost:5000/callback'

AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'

def login_url():
    scope = 'user-read-private user-read-email'
    params = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri': REDIRECT_URI
    }
    return f"{AUTH_URL}?{urllib.parse.urlencode(params)}"

def generate_random_string(length):
    possible_chars = string.ascii_letters + string.digits
    return ''.join(secrets.choice(possible_chars) for _ in range(length))

code_verifier = generate_random_string(64)

auth_code = requests.get(AUTH_URL, {
    'client_id': CLIENT_ID,
    'response_type': 'code',
    'redirect_uri': 'https://open.spotify.com/collection/playlists',
    'scope': 'playlist-modify-private',
})
print(auth_code.text)
print(auth_code)

def get_access_token(auth_code):
    req_body = {
        'code': auth_code,
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    print(req_body)
    response = requests.post(TOKEN_URL, data=req_body)
    if response.status_code == 400:
        print(response.text)
    print(response)
    token_info = response.json()
    print(token_info)
    access_token = token_info.get('access_token')
    refresh_token = token_info.get('refresh_token')
    expires_in = token_info.get('expires_in')
    expires_at = datetime.now().timestamp() + expires_in if expires_in is not None else None
    return access_token, refresh_token, expires_at

def refresh_token(refresh_token):
    req_body = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    response = requests.post(TOKEN_URL, data=req_body)
    new_token_info = response.json()
    
    new_access_token = new_token_info.get('access_token')
    new_expires_in = new_token_info.get('expires_in')
    new_expires_at = datetime.now().timestamp() + new_expires_in if new_expires_in is not None else None

    return new_access_token, new_expires_at
print(get_access_token(auth_code))
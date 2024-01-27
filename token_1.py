import requests
import urllib.parse
from datetime import datetime, timedelta

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

def get_access_token(auth_code):
    req_body = {
        'code': auth_code,
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    response = requests.post(TOKEN_URL, data=req_body)
    token_info = response.json()

    access_token = token_info.get('access_token')
    refresh_token = token_info.get('refresh_token')
    expires_at = datetime.now().timestamp() + token_info.get('expires_in')

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
    new_expires_at = datetime.now().timestamp() + new_token_info.get('expires_in')

    return new_access_token, new_expires_at
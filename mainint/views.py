from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from google.cloud import secretmanager
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import subprocess
import json
from google.oauth2 import service_account
from google.cloud import compute_v1
from django.views.decorators.csrf import csrf_exempt

def authenticate_with_service_account_key(key):
    # Write the service account key to a temporary file
    with open("/tmp/service-account-key.json", "w") as key_file:
        key_file.write(key)

    # Authenticate with gcloud using the service account key
    subprocess.run(["gcloud", "auth", "activate-service-account", "--key-file=/tmp/service-account-key.json"])




def get_user_ip(request):
    user_ip = request.META.get('HTTP_X_APPENGINE_USER_IP', None)
    return JsonResponse({'ip': user_ip})


def homepage(request):
    return render(request, "mainpage.html")



@csrf_exempt
def add_ip_to_firewall(request):
    if request.method == 'POST':
        # Assuming the IP address is sent in the request data
        data = json.loads(request.body.decode('utf-8'))
        user_ip = data.get('user_ip')
        # print(user_ip)
        if not user_ip:
            return JsonResponse({'error': 'User IP not provided in the request body'})

        project_id = "plenary-anagram-408413"
        secret_id = "fwservice"
        version_id = "latest"

        client = secretmanager.SecretManagerServiceClient()

        secret_version_name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"

        try:
            # Access the specified secret version
            response = client.access_secret_version(name=secret_version_name)

            # Decode the payload
            credentials = json.loads(response.payload.data.decode("UTF-8"))

        except Exception as e:
            return JsonResponse({'error': f"Error accessing secret version: {e}"})

        try:
            credentials_object = service_account.Credentials.from_service_account_info(credentials)
            compute = build('compute', 'v1', credentials=credentials_object)
            rule_name = "mcserver"
            firewall_body = compute.firewalls().get(project=project_id, firewall=rule_name).execute()
            source_ranges = firewall_body.get('sourceRanges', [])
            source_ranges.append(f"{user_ip}/32")
            firewall_body['sourceRanges'] = source_ranges

            compute.firewalls().update(project=project_id, firewall=rule_name, body=firewall_body).execute()
            return JsonResponse({'message': "Firewall rule updated successfully"})

        except HttpError as e:
            return JsonResponse({'error': f"Error updating firewall rule: {e.content}"})

    else:
        return HttpResponse("Invalid request method. Use POST.")
    
@csrf_exempt
def add_ip_to_firewall2(request):
    try:
        # Parse the JSON data from the request body
        data = json.loads(request.body.decode('utf-8'))
        user_ip = data.get('user_ip')
        print(user_ip)

        if not user_ip:
            return JsonResponse({'error': 'User IP not provided in the request body'})

        # Your existing logic for adding to the firewall goes here

        return JsonResponse({'message': 'Firewall rule updated successfully'})
    except json.JSONDecodeError as e:
        return JsonResponse({'error': f'Error decoding JSON: {str(e)}'})
    except Exception as e:
        return HttpResponse('Internal Server Error', status=500)

        
from google.cloud import secretmanager
import json
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
from google.oauth2 import service_account


def edit_firewall_rule(user_ip, credentials, pid):
    credentials_object = service_account.Credentials.from_service_account_info(credentials)
    compute = build('compute', 'v1', credentials=credentials_object)
    rule_name = "mcserver"
    firewall_body = compute.firewalls().get(project=pid, firewall=rule_name).execute()
    source_ranges = firewall_body.get('sourceRanges', [])
    source_ranges.append(f"{user_ip}/32")
    firewall_body['sourceRanges'] = source_ranges
    try:
        compute.firewalls().update(project=pid, firewall=rule_name, body=firewall_body).execute()
        print("Firewall rule updated successfully")

    except HttpError as e:
        print(f"Error updating firewall rule: {e.content}")

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
    print(f"Error accessing secret version: {e}")
    credentials = {}

user_ip = input("Enter user's IP address: ")

# authenticate_with_service_account_key(credentials)
edit_firewall_rule(user_ip, credentials, project_id)
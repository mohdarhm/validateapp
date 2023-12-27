FIREWALL WHITELISTING WEBAPP

A simple website built in Django that resides on Google Cloud App Engine that adds user's IP address to the firewall that affects the entire GCP project. The specfic use case here
is that a compute engine vm currently runs a minecraft server with the firewall set to allow only speicifed IPs. since ISPs can change the public IP, in order to play the game the 
firewall needs constant updation. This application effectively achieves that. Heres a basic overview of how it was achieved on Google Cloud.

--It is assumed that the vm is up and running, and the firewall rule is created to allow 0.0.0.0/0 @ TCP port 25565, standard stuff for a public minecraft server.

--It is also assumed that you are looking for firewall-level protection instead of ingame whitelist as it can be more secure. (no one can simply hack the firewall that easily)

1. A service account was created, with the permissions: Editor. you can give specific Permissions to edit firewall rules as well as view secrets.
2. Principals are set, who can access this account.
3. A private key json is created for the service account.
4. This json is stored as a secret. 
5. At the local developmental stage, the service account needs activation to manipulate cloud resources, as well as gcloud auth is needed.
6. secret_version_name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}" this variable format is necessary to fetch the secret. replace with your variables.
7. see the Django view add_ip_to_firewall(request) defined in the views.py. It is the one handling the addition. While uploading the app on App engine, the authentication is handled automatically. it is important
   bind the same service account to the app as the one created earlier. 

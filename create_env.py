import os
import shutil
import re

# Set the environment name from the GitHub workflow environment variable
full_ref = os.getenv("GITHUB_HEAD_REF")
if full_ref:
    branch_match = re.match(r'^refs/heads/(.+)', full_ref)
    if branch_match:
        environment_name = branch_match.group(1)
    else:
        environment_name = full_ref
else:
    print("Environment variable GITHUB_HEAD_REF is not set.")
    exit(1)


# Ensure that the environment name starts with "dev"
if not environment_name or not environment_name.startswith("dev"):
    print("Invalid environment name. It must start with 'dev'.")
    exit(1)

# Define the base directory where YAML files are located
base_directory = "k8s"

# Create a directory for the new environment
environment_directory = os.path.join(base_directory, environment_name)
os.makedirs(environment_directory, exist_ok=True)

# Define subdirectories
subdirectories = ["backend", "frontend", "common", "database"]

# Copy YAML files to the new environment directory
for subdirectory in subdirectories:
    source_directory = os.path.join(base_directory, "main", subdirectory)
    destination_directory = os.path.join(environment_directory, subdirectory)
    os.makedirs(destination_directory, exist_ok=True)
    for filename in os.listdir(source_directory):
        if filename.endswith(".yaml"):
            source_path = os.path.join(source_directory, filename)
            destination_path = os.path.join(destination_directory, filename)
            
            # Read the contents of the YAML file
            with open(source_path, 'r') as source_file:
                yaml_content = source_file.read()
            
            # Replace occurrences of 'main' with the environment name in the YAML content
            yaml_content = yaml_content.replace("main", environment_name)
            
            # If the YAML file is an Ingress file under 'backend', update the host match pattern
            if subdirectory == "backend" and re.search(r"match: Host\(`[a-zA-Z0-9-]+\.heyrahul\.cloud`\)", yaml_content):
                yaml_content = re.sub(r"match: Host\(`[a-zA-Z0-9-]+\.heyrahul\.cloud`\)", f"match: Host(`api-{environment_name}.heyrahul.cloud`)", yaml_content)
            
            # If the YAML file is an Ingress file under 'frontend', update the host match pattern
            if subdirectory == "frontend" and re.search(r"match: Host\(`heyrahul\.cloud`\)", yaml_content):
                yaml_content = re.sub(r"match: Host\(`heyrahul\.cloud`\)", f"match: Host(`app-{environment_name}.heyrahul.cloud`)", yaml_content)
            
            # If the YAML file is a ConfigMap in the 'common' directory, update the API URL
            if subdirectory == "common":
                yaml_content = yaml_content.replace("http://api.heyrahul.cloud/api/v1", f"http://api-{environment_name}.heyrahul.cloud/api/v1")
            
            # Write the updated YAML content to the destination file
            with open(destination_path, 'w') as destination_file:
                destination_file.write(yaml_content)

print(f"Created YAML files for the environment: {environment_name}")

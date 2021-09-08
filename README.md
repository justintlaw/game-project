 ### First time setup steps (only required once):

 ## Step 1:
Use this script to create the connection to github (the repo and branch is specified in 'lib/game-project-pipeline.ts'). Copy the output arn and put this in the connection method.

```
aws codestar-connections create-connection \
    --provider-type GitHub \
    --connection-name game-project
```
## Step 2:
Run the following. Make sure the profile is configured in the credentials file.

```
cdk deploy --profile admin
```

## Step 3:
Connect to github

```
Go to the CodePipeline console and connect the repository manually (only required once while setting up)
```

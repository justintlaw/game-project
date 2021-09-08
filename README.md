 ### First time setup steps:

 ## Step 1:
* use this script to create the connection to github (the repo and branch is specified in 'lib/game-project-pipeline.ts')
* copy the output arn and put this in the connection method

aws codestar-connections create-connection \
    --provider-type GitHub \
    --connection-name game-project

## Step 2:
* run the following
* make sure the profile is configured in the credentials file

cdk deploy --profile admin

## Step 3:
* connect github

Go to the CodePipeline console and connect the repository manually (only required once while setting up)

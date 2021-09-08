# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


## Setup scripts

* use this script to create the connection to github (the repo and branch is specified in 'lib/game-project-pipeline.ts')
* copy the output arn and put this in the connection method

aws codestar-connections create-connection \
    --provider-type GitHub \
    --connection-name game-project

* script to deploy
cdk deploy --profile admin
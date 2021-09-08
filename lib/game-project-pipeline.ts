import * as cdk from '@aws-cdk/core'
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from '@aws-cdk/pipelines'
import { GameProjectPipelineAppStage } from './game-project-pipeline-stage'

export class GameProjectPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const gameProjectPipeline = new CodePipeline(this, 'GameProjectPipeline', {
      pipelineName: 'GameProjectPipeline',
      synth: new ShellStep('Synth', {
        // input: CodePipelineSource.gitHub('justintlaw/game-project', 'master'),
        // temporarily using below code until the issues with authentication the above code has can be fixed
        input: CodePipelineSource.connection('justintlaw/game-project', 'master', {
          connectionArn: 'arn:aws:codestar-connections:us-east-1:163961535528:connection/1a560871-ae21-4fd4-a3dd-bbb92aa287f0'
        }),
        commands: ['cd src && npm install', 'cd ..', 'npm install', 'npm run build', 'npx cdk synth']
      })
    })

    const devStage = gameProjectPipeline.addStage(new GameProjectPipelineAppStage(this, 'dev', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
      }
    }))

    const prodStage = gameProjectPipeline.addStage(new GameProjectPipelineAppStage(this, 'prod', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
      }
    }))
    prodStage.addPre(new ManualApprovalStep('approval'))
  }
}

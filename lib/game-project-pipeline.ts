import * as cdk from '@aws-cdk/core'
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from '@aws-cdk/pipelines'
import { GameProjectPipelineAppStage } from './game-project-pipeline-stage'

export class GameProjectPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const gameProjectPipeline = new CodePipeline(this, 'GameProjectPipeline', {
      pipelineName: 'GameProjectPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('justintlaw/game-project', 'master'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'] // ADD MORE HERE
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
    prodStage.addPost(new ManualApprovalStep('approval'))
    
  }
}

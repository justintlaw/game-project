import * as cdk from '@aws-cdk/core';
import { GameProjectStack } from './game-project-stack';

export class GameProjectPipelineAppStage extends cdk.Stage {
    
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new GameProjectStack(this, 'GameProjectStack');      
  }
}

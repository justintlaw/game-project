import * as cdk from '@aws-cdk/core'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { Duration } from '@aws-cdk/core'

export class GameProjectStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Create the database
    const gameTable = new dynamodb.Table(this, 'GamesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    })

    // Create the lambda infrastructure for the endpoints
    const endpointsLambda = new lambda.Function(this, 'EndpointsLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('../src'),
      handler: 'handler/index.handler',
      environment: {
        TABLE_NAME: gameTable.tableName
      },
      timeout: Duration.seconds(6)
    })

    // Create the API Gateway Lambda integration
    new apigateway.LambdaRestApi(this, 'GameAPI', {
      handler: endpointsLambda
    })
  }
}

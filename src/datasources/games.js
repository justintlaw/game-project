'use strict'

import { uuid } from 'uuidv4'
import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb"
const { TABLE_NAME: TableName } = process.env

const client = new DynamoDB({})
const ddbClient = DynamoDBDocumentClient.from(client)

/**
 * The basic CRUD functions to work with the game list
 */

const createGame = async (gameData) => {
  const { title, year, genre } = gameData

  await ddbClient.send(new PutCommand({
    TableName,
    Item: {
      id: uuid(),
      title: title,
      year: year,
      genre: genre ?? ""
    }
  }))
}

const getAllGames = async () => {
  const res = await ddbClient.send(new ScanCommand({
    ProjectionExpression: "title, year, genre"
  }))

  return res
}

const getGame = async (id) => {
  const res = await ddbClient.send(new GetCommand({
    TableName,
    Key: {
      id
    }
  }))

  return res
}

const updateGame = async (id, gameData) => {
  const { title, year, genre } = gameData

  let updateExpression = 'SET '
  let expressionAttributeValues = {}

  if (title) {
    updateExpression += `title=:title`
    expressionAttributeValues[':title'] = title
  }

  if (year) {
    updateExpression += ',year=:year'
    expressionAttributeValues[':year'] = year
  }

  if (genre) {
    updateExpression += ',genre=:genre'
    expressionAttributeValues['genre'] = genre
  }

  const res = await ddbClient.send(new UpdateCommand({
    TableName,
    Key: { id: id },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }))

  return res
}

const deleteGame = async (id) => {
  await ddbClient.send(new DeleteCommand({
    TableName,
    Key: {
      id
    }
  }))
}

export {
  createGame,
  getAllGames,
  getGame,
  updateGame,
  deleteGame
}

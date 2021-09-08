'use strict'

const { uuid } = require('uuidv4')
const { DynamoDB, ScanCommand } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, GetCommand, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb')
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

  return res.Items
}

const getGame = async (id) => {
  const res = await ddbClient.send(new GetCommand({
    TableName,
    Key: {
      id
    }
  }))

  return res.Item
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

  return mapItem(res.Attributes)
}

const deleteGame = async (id) => {
  await ddbClient.send(new DeleteCommand({
    TableName,
    Key: {
      id
    }
  }))

  return {}
}

/**
 * A function to map the attributes from the updateItem dynamodb call
 *
 * @param {object} attributes - dynamodb attributes
 */
const mapItem = (attributes) => {
  return attributes
    ? {
        id: attributes.id ?? null,
        title: attributes.title ?? null,
        year: attributes.year ?? null,
        genre: attributes.genre ?? null
      }
    : null
}

module.exports = {
  createGame,
  getAllGames,
  getGame,
  updateGame,
  deleteGame
}

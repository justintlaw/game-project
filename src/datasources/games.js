'use strict'

const { v4: uuidv4 } = require('uuid')
const { DynamoDB } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, GetCommand, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb')
const { TABLE_NAME: TableName } = process.env

const client = new DynamoDB({})
const ddbClient = DynamoDBDocumentClient.from(client)

/**
 * The basic CRUD functions to work with the game list
 */

const createGame = async ({ title, yearReleased, genre }) => {
  await ddbClient.send(new PutCommand({
    TableName,
    Item: {
      id: uuidv4(),
      title: title,
      year_released: yearReleased,
      genre: genre ?? ""
    }
  }))

  return {}
}

const getAllGames = async () => {
  const res = await ddbClient.send(new ScanCommand({
    TableName,
    ProjectionExpression: "id, title, year_released, genre"
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

const updateGame = async (id, {title, yearReleased, genre }) => {
  let updateExpression = 'SET '
  let expressionAttributeValues = {}

  if (title) {
    updateExpression += `title=:title`
    expressionAttributeValues[':title'] = title
  }

  if (yearReleased) {
    updateExpression += ',year_released=:year_released'
    expressionAttributeValues[':year_released'] = yearReleased
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

  return mapItem(res.Attributes, id)
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
 * @param {object} item - dynamodb item
 * @param {String} id - uuid of item
 */
const mapItem = (item, id = null) => {
  return item
    ? {
        id: id ?? null,
        title: item.title ?? null,
        yearReleased: item.year_released ?? null,
        genre: item.genre ?? null
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

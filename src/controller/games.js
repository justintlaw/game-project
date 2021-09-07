'use strict'

import * as datasources from '../datasources'

const createGame = async (gameData) => {
  let res

  try {
    res = await datasources.games.createGame(gameData)
  } catch (err) {
    console.error('Failed to create item:', err)
  }

  return response(res)
}

const response = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: body,
    headers = {
      'Content-Type': 'application/json'
    }
  }
}
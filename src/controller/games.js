'use strict'

const datasources = require('../datasources')

const createGame = async (gameData) => {
  const { title, yearReleased, genre } = gameData

  if (!title) {
    return response(400, { status: 'error', message: 'Required field "title" is missing.' })
  }
  
  if (!yearReleased) {
    return response(400, { status: 'error', message: 'Required field "year" is missing.' })
  }

  try {
    await datasources.games.createGame({ title, yearReleased, genre })
  } catch (err) {
    console.error('Failed to create item:', err)
    return response(500, { status: 'error', message: 'Failed to create item.' })
  }

  return response(201, { status: 'success', data: null })
}

const getAllGames = async () => {
  let games

  try {
    games = await datasources.games.getAllGames()
  } catch (err) {
    console.error('Failed to get games.', err)
    return response(500, { status: 'error', message: 'Failed to get games.' })
  }

  if (!games || games.length < 1) {
    return response(404, { status: 'error', message: 'No games were found.' })
  }

  return response(200, { status: 'success', data: [...games] })
}

const getGame = async (id) => {
  let game

  try {
    game = await datasources.games.getGame(id)
  } catch (err) {
    console.error(`Failed to get game with id ${id}`)
    return response(400, { status: 'error', message: `Failed to get game with id ${id}.` })
  }

  if (!game) {
    return response(404, { status: 'error', message: `Game not found for id ${id}` })
  }

  return response(200, { status: 'success', data: { ...game } })
}

const updateGame = async (id, { title, yearReleased, genre }) => {
  let game

  try {
    game = await datasources.games.updateGame({ title, yearReleased, genre })
  } catch (err) {
    console.error(`Failed to update game with id ${id}.`, err)
    return response(500, { status: 'error', message: `Failed to update game with id ${id}.` })
  }

  return response (200, { status: 'success', data: { ...game } })
}

const deleteGame = async (id) => {
  try {
    await datasources.games.deleteGame(id)
  } catch (err) {
    console.error(`Failed to delete game with id ${id}.`)
    return response (500, { status: 'error', data: null, message: `Failed to delete game with id ${id}.` })
  }

  return response(204, { status: 'success', data: null, message: `Deleted game with id ${id}.` })
}

/**
 * A function to generate a response for the Lambda API Gateway integration 
 *
 * @param {number} statusCode - the code returned by the api
 * @param {object} body - the data returned, if any
 * @returns 
 */
const response = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

module.exports = {
  createGame,
  getAllGames,
  getGame,
  updateGame,
  deleteGame
}

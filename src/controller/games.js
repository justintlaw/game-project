'use strict'

import * as datasources from '../datasources'

const createGame = async (gameData) => {
  let game

  const { title, year } = gameDate

  if (!title) {
    return response(400, { message: 'Title is missing from input.' })
  }
  
  if (!year) {
    return response(400, { message: 'Year is missing from input.' })
  }

  try {
    game = await datasources.games.createGame(gameData)
  } catch (err) {
    console.error('Failed to create item:', err)
    return response(500, { message: 'Failed to create item.' })
  }

  return response(201, game)
}

const getAllGames = async () => {
  let games

  try {
    games = await datasources.games.getAllGames()
  } catch (err) {
    console.error('Failed to get games.', err)
    return response(500, { message: 'Failed to get games.' })
  }

  if (!games) {
    return response(404, { message: 'No games were found.' })
  }

  return response(200, games)
}

const getGame = async (id) => {
  let game

  try {
    game = await datasources.games.getGame(id)
  } catch (err) {
    console.error(`Failed to get game with id ${id}`)
    return response(400, { message: `Failed to get game with id ${id}.` })
  }

  if (!game) {
    return response(404, { message: `Game not found for id ${id}` })
  }

  return response(200, game)
}

const updateGame = async (id, gameData) => {
  let game

  try {
    game = await datasources.games.updateGame(gameData)
  } catch (err) {
    console.error(`Failed to update game with id ${id}.`)
    return response(500, { message: `Failed to update game with id ${id}.` })
  }

  return response (200, game)
}

const deleteGame = async () => {
  try {
    await datasources.games.deleteGame(id)
  } catch (err) {
    console.error(`Failed to delete game with id ${id}.`)
    return response (500, { message: `Failed to delete game with id ${id}.` })
  }

  return response(204, { message: `Deleted game with id ${id}.` })
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

export {
  createGame,
  getAllGames,
  getGame,
  updateGame,
  deleteGame
}

'use strict'

import { createGame, getAllGames, getGame, updateGame, deleteGame } from '../controller/games'

const rootPath = '/games'

exports.handler = async function(event, context) {
  // select path
  const { path, pathParameters, httpMethod, body } = event
  const { id } = pathParameters

  let res

  // Create game
  if (path === `${rootPath}/` && httpMethod === 'POST') {
    res = await createGame(body)
  }
  // Get all games
  else if (path === `${rootPath}/` && httpMethod === 'GET') {
    res = await getAllGames()
  }
  // Get a game by id
  else if (path === `${rootPath}/` && id && httpMethod === 'GET') {
    res = await getGame(id)
  }
  // Update a game by id
  else if (path === `${rootPath}/` && id && httpMethod === 'POST') {
    res = await updateGame(id, body)
  }
  // Delete a game by id
  else if(path === `${rootPath}/` && id && httpMethod === 'DELETE') {
    res = await deleteGame(id)
  }

  return res
}
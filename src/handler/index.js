'use strict'

const { createGame, getAllGames, getGame, updateGame, deleteGame } = require('../controller/games')

const rootPath = '/games'

exports.handler = async function(event, context) {
  console.log('event', JSON.stringify(event, null, 2))

  const { path, queryStringParameters, httpMethod, body } = event
  const { id } = queryStringParameters ?? {}

  // convert the body to JSON
  let requestBody
  if (body) {
    try {
      requestBody = JSON.parse(body)
    } catch {
      requestBody = body
    }
  }

  let res

  // Create game
  if (path === `${rootPath}` && !id && httpMethod === 'POST') {
    res = await createGame(requestBody)
  }
  // Get a game by id
  else if (path === `${rootPath}` && id && httpMethod === 'GET') {
    res = await getGame(id)
  }
  // Get all games
  else if (path === `${rootPath}` && !id && httpMethod === 'GET') {
    res = await getAllGames()
  }
  // Update a game by id
  else if (path === `${rootPath}` && id && httpMethod === 'POST') {
    res = await updateGame(id, requestBody)
  }
  // Delete a game by id
  else if(path === `${rootPath}` && id && httpMethod === 'DELETE') {
    res = await deleteGame(id)
  }
  // return a default error if the controller fails
  else {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        message: 'An unhandled error has occurred.'
      })
    }
  }

  return res
}

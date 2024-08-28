const {
  apiRoot,
  httpStatusCodes,
  httpMethods,
  collectionNames
} = require('../../utils/constants')
const {
  secretKey,
  decodeToken,
  generateId,
  getDataFromRequest
} = require('../helper')

async function handleAddTask (request, response) {
  try {
    const body = await getDataFromRequest(request)
    const { task, username } = body

    const bearerToken =
      request.headers.authorization &&
      request.headers.authorization.split(' ')[1]

    if (!bearerToken) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED
      response.end('Unauthorized: No token provided')
      return
    }
    const [userId, secretKeyFromToken] = decodeToken(bearerToken).split(':')

    if (secretKeyFromToken !== secretKey) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED
      response.end('Unauthorized: Invalid token')
      return
    }

    const newTask = {
      ...task,
      ownerId: userId,
      id: generateId()
    }

    const result = await fetch(`${apiRoot}/api/create`, {
      method: httpMethods.POST,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collection: collectionNames.TASK,
        record: newTask
      })
    })

    if (result.status !== httpStatusCodes.CREATED) {
      response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
      response.end('Failed to create task')
      return
    }

    response.statusCode = httpStatusCodes.CREATED
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(newTask))
  } catch (error) {
    console.error('Error handling task creation:', error)
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
    response.end('Internal Server Error')
  }
}

async function handleGetTasksByUser (request, response) {
  try {
    const bearerToken =
      request.headers.authorization &&
      request.headers.authorization.split(' ')[1]
    if (!bearerToken) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED
      response.end('Unauthorized: No token provided')
      return
    }

    const [idUser, secretKeyFromToken] = decodeToken(bearerToken).split(':')

    if (secretKeyFromToken !== secretKey) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED
      response.end('Unauthorized: Invalid token')
      return
    }

    const tasksResponse = await fetch(`${apiRoot}/api/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collection: collectionNames.TASK,
        filter: { ownerId: string(idUser) }
      })
    })

    const tasks = await tasksResponse.json()

    response.statusCode = httpStatusCodes.OK
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(tasks))
  } catch (error) {
    console.error('Error handling get tasks by user:', error)
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
    response.end('Internal Server Error')
  }
}

async function handleUpdateTask (request, response) {
  try {
    const bearerToken =
      request.headers.authorization &&
      request.headers.authorization.split(' ')[1]

    if (!bearerToken) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED
      response.end('Unauthorized')
      return
    }

    const secretKeyFromToken = decodeToken(bearerToken).split(':')[1]
    if (secretKeyFromToken !== secretKey) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED
      response.end('Unauthorized: Invalid token')
      return
    }

    const updateTask = await getDataFromRequest(request)

    const updateResponse = await fetch(`${apiRoot}/api/update`, {
      method: httpMethods.PUT,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collection: collectionNames.TASK,
        filter: { id: updateTask.id },
        update: updateTask
      })
    })

    if (updateResponse.status !== httpStatusCodes.NO_CONTENT) {
      response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
      response.end('Internal Server Error')
      return
    }

    response.statusCode = httpStatusCodes.NO_CONTENT
    response.end()
  } catch (error) {
    console.error('Error handling update task:', error)
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
    response.end('Internal Server Error')
  }
}

async function handleDeleteTaskById (request, response) {
  const body = await getDataFromRequest(request)
  taskId = body.id
  
  const bearerToken =
    request.headers.authorization && request.headers.authorization.split(' ')[1]
  if (!bearerToken) {
    response.statusCode = httpStatusCodes.UNAUTHORIZED
    response.end('Unauthorized')
    return
  }

  if(!taskId){
    response.statusCode = httpStatusCodes.NOT_FOUND
    response.end('Invalid task id')
    return
  }

  const secretKeyFromToken = decodeToken(bearerToken).split(':')[1]
  if (secretKeyFromToken !== secretKey) {
    response.statusCode = httpStatusCodes.UNAUTHORIZED
    response.end('Unauthorized: Invalid token')
    return
  }

  const taskResponse = await fetch(`${apiRoot}/api/read`, {
    method: httpMethods.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      collection: 'task',
      filter: {
        id: taskId
      }
    })
  })

  const task = await taskResponse.json()


  if (task.length === 0) {
    response.statusCode = httpStatusCodes.NOT_FOUND
    response.end()
    return
  }

  const res = await fetch(`${apiRoot}/api/delete`, {
    method: httpMethods.DELETE,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      collection: 'task',
      filter: {
        id: taskId
      }
    })
  })
  if (res.status !== httpStatusCodes.NO_CONTENT) {
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
    response.end()
    return
  }
  response.statusCode = httpStatusCodes.NO_CONTENT
  response.end()
}

module.exports = {
  handleAddTask,
  handleUpdateTask,
  handleGetTasksByUser,
  handleDeleteTaskById
}

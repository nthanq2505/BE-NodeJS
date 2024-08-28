const { encodeToken, generateId, getDataFromRequest } = require('../helper')
const {
  apiRoot,
  httpStatusCodes,
  httpMethods
} = require('../../utils/constants')

async function handleLogin (request, response) {
  try {
    const reqData = await getDataFromRequest(request)
    
    const userResponse = await fetch(`${apiRoot}/api/read`, {
      method: httpMethods.POST,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collection: 'user',
        filter: {
          username: reqData.username,
          password: reqData.password
        }
      })
    })

    const user = await userResponse.json()
    

    if (user.length === 0) {
      response.statusCode = httpStatusCodes.NOT_FOUND
      response.end()
      return
    }

    response.statusCode = httpStatusCodes.OK
    response.setHeader('Content-Type', 'application/json')
    response.end(
      JSON.stringify({
        username: user[0].username,
        token: user[0].token
      })
    )
  } catch (error) {
    console.error('Login failed:', error)
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
    response.end('500 Internal Server Error')
  }
}

async function handleRegister (req, res) {
  try {
    const reqData = await getDataFromRequest(req)

    const userRes = await fetch(`${apiRoot}/api/read`, {
      method: httpMethods.POST,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collection: 'user',
        filter: {
          username: reqData.username
        }
      })
    })

    const user = await userRes.json()

    if (user.length > 0) {
      res.statusCode = httpStatusCodes.CONFLICT
      res.end()
      return
    }

    const newId = generateId()
    const token = encodeToken(newId)
    const newUser = {
      id: newId,
      token: token,
      ...reqData
    }

    const databaseRes = await fetch(`${apiRoot}/create`, {
      method: httpMethods.POST,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collection: 'user',
        record: newUser
      })
    })

    if (databaseRes.status !== httpStatusCodes.CREATED) {
      res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
      res.end()
    } else {
      res.statusCode = httpStatusCodes.CREATED
      res.end()
    }
  } catch (error) {
    console.error('Error during registration:', error)
    res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
    res.end('500 Internal Server Error')
  }
}

module.exports = {
  handleLogin,
  handleRegister
}

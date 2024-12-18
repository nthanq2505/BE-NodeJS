const { encodeToken, getCollection } = require('../../helpers')
const {
  httpStatusCodes,
  collectionNames
  // CAN USE IN FUTURE
  // apiRoot,
  // httpMethods,
  // databaseName,
  // uriMongo,
} = require('../../utils/constants')
const { sendResponse } = require('../../utils/helpers')

const usersCollection = getCollection(collectionNames.USER)

async function handlePing(req, res) {
  res.writeHead(200);
  res.end("pong");
}

async function handleLogin (req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return sendResponse(
        res,
        httpStatusCodes.BAD_REQUEST,
        'error',
        'email and password cannot be empty'
      )
    }

    const user = await usersCollection.findOne({
      email: email
    })
    if (!user) {
      return sendResponse(
        res,
        httpStatusCodes.NOT_FOUND,
        'error',
        'Incorrect email address. Please try again'
      )
    }

    if (password !== user?.password) {
      return sendResponse(
        res,
        httpStatusCodes.UNAUTHORIZED,
        'error',
        'Incorrect password. Please try again'
      )
    }

    return sendResponse(
      res,
      httpStatusCodes.OK,
      'success',
      'Login successfully',
      {
        fullName: user.fullName,
        email: user.email,
        token: user.token
      }
    )
  } catch (error) {
    return sendResponse(
      res,
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      'error',
      'Internal Server Error'
    )
  }
}

async function handleRegister (req, res) {
  try {
    console.log(req.body)

    const { email, password, fullName } = req.body
    if (!email || !password || !fullName) {
      return sendResponse(
        res,
        httpStatusCodes.BAD_REQUEST,
        'error',
        'email, fullname and password cannot be empty'
      )
    }

    const user = await usersCollection.findOne({ email: email })
    if (user) {
      return sendResponse(
        res,
        httpStatusCodes.CONFLICT,
        'error',
        'The user already exists'
      )
    }

    const result = await usersCollection.insertOne({
      fullName: fullName,
      email: email,
      password: password,
      token: encodeToken(email)
    })

    if (result.insertedId) {
      return sendResponse(
        res,
        httpStatusCodes.CREATED,
        'success',
        'Register successfully'
      )
    }
  } catch (error) {
    return sendResponse(
      res,
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      'error',
      'Internal Server Error'
    )
  }
}

module.exports = {
  handleLogin,
  handleRegister,
  handlePing
}

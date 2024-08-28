const apiRoot = 'http://127.0.0.1:8080'

const uriMongo = "mongodb+srv://nqthang:123@mongodb.ksg90.mongodb.net/";
const databaseName = 'todo_app'

const httpMethods = {
  POST: 'POST',
  GET: 'GET',
  DELETE: 'DELETE',
  PUT: 'PUT'
}

const httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
}

const collectionNames = {
  TASK :'tasks',
  USER : 'users'
}


module.exports = { apiRoot, httpMethods, httpStatusCodes, collectionNames, uriMongo, databaseName }

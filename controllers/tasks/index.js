const { httpStatusCodes, collectionNames } = require('../../utils/constants')
const { getCollection } = require('../../helpers')
const { ObjectId } = require('mongodb')
const { sendResponse } = require('../../utils/helpers')
const url = require('url');
const tasksCollection = getCollection(collectionNames.TASK)

async function handleAddTask (req, res) {
  try {
    const task = req.body
    const user = req.user

    if (!task || !task?.name) {
      return sendResponse(
        res,
        httpStatusCodes.BAD_REQUEST,
        'error',
        'Incorrect task information . Please try again'
      )
    }

    await tasksCollection.insertOne({
      ...task,
      isDone: false,
      ownerId: user._id
    })

    return sendResponse(
      res,
      httpStatusCodes.CREATED,
      'success',
      'Create task successfully'
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

async function handleGetTasksByUser (req, res) {
  try {
    const user = req.user
    const parsedUrl = url.parse(req.url, true)
    const { query } = parsedUrl

    const filter = {
      ownerId: user._id
    }

    if (query.isDone === 'done') {
      filter.isDone = true; 
    } else if (query.isDone === 'not_done') {
      filter.isDone = false; 
    }


    const tasks = await tasksCollection
      .find(filter)
      .toArray()

    return sendResponse(
      res,
      httpStatusCodes.OK,
      'success',
      'Get tasks successfully',
      tasks
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
      res,
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      'error',
      'Internal Server Error'
    )
  }
}

async function handleUpdateTask (req, res) {
  try {
    const task = req.body

    if (!task || !task._id || !ObjectId.isValid(task._id)) {
      res.statusCode = httpStatusCodes.BAD_REQUEST
      res.end()
      return
    }

    const result = await tasksCollection.updateOne(
      {
        _id: new ObjectId(task._id),
        ownerId: new ObjectId(task.ownerId)
      },
      {
        $set: {
          name: task.name,
          isDone: task.isDone
        }
      }
    )

    res.statusCode = httpStatusCodes.NO_CONTENT
    res.end()
    return
  } catch (error) {
    console.error('Error handling update task:', error)
    res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
    res.end('Internal Server Error')
  }
}

async function handleDeleteTaskById (req, res) {
  try {
    const taskId = req.url.split('/').pop()

    const user = req.user

    if (!taskId || !ObjectId.isValid(taskId)) {
      res.statusCode = httpStatusCodes.BAD_REQUEST
      res.end('Invalid task ID')
      return
    }

    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(taskId),
      ownerId: user._id
    })

    if (result.deletedCount === 0) {
      res.statusCode = httpStatusCodes.NOT_FOUND
      res.end()
      return
    }

    res.statusCode = httpStatusCodes.NO_CONTENT
    res.end()
  } catch (error) {
    console.error('Error handling delete task by id:', error)
    res.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
    res.end('Internal Server Error')
  }
}

module.exports = {
  handleAddTask,
  handleUpdateTask,
  handleGetTasksByUser,
  handleDeleteTaskById
}

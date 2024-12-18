module.exports = {
  task: {
    addTask: {
      value: '/api/add-task'
    },
    updateTask: {
      value: '/api/update-task'
    },
    getTasks: {
      value: '/api/get-tasks'
    },
    deleteTask: {
      value: '/api/delete-task/:taskId'
    }
  },
  user: {
    login: {
      value: '/api/login'
    },
    register: {
      value: '/api/register'
    },
    ping: {
      value: '/api/ping'
    }
  }
}

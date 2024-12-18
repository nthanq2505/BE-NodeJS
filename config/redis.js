const redis = require('redis');

const redisClient = redis.createClient()

redisClient.on('error', err => {
  console.error('Redis Client Error', err)
})

redisClient
  .connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis Connection Error', err))

module.exports = redisClient

function sendResponse (
  res,
  statusCode,
  status,
  message,
  data = null,
  errors = null
) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(
    JSON.stringify({
      status,
      message,
      data,
      errors
    })
  )
}
module.exports = { sendResponse }

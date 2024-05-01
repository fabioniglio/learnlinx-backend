const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

const isAuthenticated = (req, res, next) => {
  try {
    
    // get the token from headers "Bearer 123XYZ..."
    const token = req.headers.authorization.split(' ')[1] 


    // decode token and get payload
    const payload = jwt.verify(token, process.env.TOKEN_SECRET) 

    req.tokenPayload = payload // to pass the decoded payload to the next route
    next()
  } catch (error) {
    // the middleware will catch error and send 401 if:
    // 1. There is no token
    // 2. Token is invalid
    // 3. There is no headers or authorization in req (no token)
    res.status(401).json('token not provided or not valid')
  }

// const isAdmin = async (req, res, next) => {
//   const { userId } = req.tokenPayload
//   try {
//     const user = await User.findById(userId)
//     if (user.roles.includes('ADMIN')) {
//       next()
//     } else {
//       res.status(403).json('You shall not pass')
//     }
//   } catch (error) {
//     res.status(500).json(error)
//   }
// }
}
module.exports = { isAuthenticated /*, isAdmin*/ }
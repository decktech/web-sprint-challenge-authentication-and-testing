const User = require('../users/users-model')
const jwt = require('jsonwebtoken');

const validateUsernamePassword = (req, res, next) => {
    if (req.body.username == null || req.body.password == null) {
      next({ status: 401, message: 'username and password required' }) 
    } else {
      next()
    }
}

const checkUsernameFree = async (req, res, next) => {
    try {
      const users = await User.findBy({ username: req.body.username })
      if(users.length === 0) {
        next()
      } else {
        next({ message: "username taken", status: 401 })
      }
    } catch (err) {
      next(err)
    }
  }

  async function checkUsernameExists(req, res, next) {
    try {
      const users = await User.findBy({ username: req.body.username })
      if(users.length !== 0) {
        req.existingUser = users[0]
        next()
      } else {
        next({ message: "invalid credentials", status: 401 })
      }
    } catch (err) {
      next(err)
    }
  }

  module.exports = {
    checkUsernameFree,
    checkUsernameExists,
    validateUsernamePassword
  }
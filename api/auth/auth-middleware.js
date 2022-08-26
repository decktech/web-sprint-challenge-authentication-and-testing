const { JWT_SECRET } = require("../secrets"); // use this secret!
const User = require()
const jwt = require('jsonwebtoken');

const validateUsernamePassword = (req, res, next) => {
    if (!req.body.username || !req.body.username.trim()) {
        req.username 
    }
}

const checkUsernameFree = async (req, res, next) => {
    try {
      const users = await User.findBy({ username: req.body.username })
      if(users.length === 0) {
        next()
      } else {
        next({ message: "Username taken", status: 422 })
      }
    } catch (err) {
      next(err)
    }
  }

  async function checkUsernameExists(req, res, next) {
    try {
      const users = await User.findBy({ username: req.body.username })
      if(users.length !== 0) {
        req.user = users[0]
        next()
      } else {
        next({ message: "Invalid credentials", status: 401 })
      }
    } catch (err) {
      next(err)
    }
  }
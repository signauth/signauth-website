const express = require('express')
const router = express.Router()

const Auth = require('../lib/Auth')
const auth = new Auth()

const authMiddleware = require('./authMiddleware')


router.post('/challenge/:scope', async (req, res) => {

  const {email} = req.body
  const scope = req.params.scope

  if (!auth.validate(email)) {
    res.json({
      success: false,
      error: 'The email is not valid'
    })
  } else {
    try {
      const exists = await auth.exists(email)
      if (!exists && scope === 'signin') {
        res.json({
          success: false,
          error: 'User not found; please signup'
        })
      } else if (exists && scope === 'signup') {
        res.json({
          success: false,
          error: 'The user already exists; please signin'
        })
      } else {
        res.json({
          success: true,
          challenge: await auth.newChallenge(email, scope)
        })
      }
    } catch (e) {
      console.log(e)
      res.json({
        success: false,
        error: 'Something went wrong :-('
      })
    }
  }
})

router.post('/signin', async (req, res) => {


  const {email, payload} = req.body

  if (!auth.validate(email)) {
    res.json({
      success: false,
      message: 'The email is not valid'
    })
  } else if (!auth.verifyPayload(payload)) {
    res.json({
      success: false,
      message: 'The payload is not valid'
    })
  } else {
    try {
      const accessToken = await auth.signin(email, payload)
      res.json({
        success: true,
        accessToken
      })
    } catch (e) {
      res.json({
        success: false,
        error: e.message
      })
    }
  }
})

router.post('/signup', async (req, res) => {


  const {email, payload} = req.body

  if (!auth.validate(email)) {
    res.json({
      success: false,
      message: 'The email is not valid'
    })
  } else if (!auth.verifyPayload(payload)) {
    res.json({
      success: false,
      message: 'The payload is not valid'
    })
  } else {
    try {
      const accessToken = await auth.signup(email, payload)
      res.json({
        success: true,
        accessToken
      })
    } catch (e) {
      res.json({
        success: false,
        error: e.message
      })
    }
  }
})

router.get('/info', authMiddleware, async (req, res) => {

  const {email} = req.query
  res.json({
    success: true,
    info: await auth.getInfo(email)
  })
})

router.get('/signout', async (req, res) => {

  const {email} = req.query
  const token = req.get('Access-Token')
  if (token && email && auth.validate(email)) {
    try {
      auth.signout(email, token)
      res.json({
        success: true
      })
    } catch (e) {
      res.json({
        success: false,
        error: e.message
      })
    }
  } else {
    res.json({
      success: false,
      error: 'No email or token'
    })
  }
})

module.exports = router

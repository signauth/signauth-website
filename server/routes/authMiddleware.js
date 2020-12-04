const Auth = require('../lib/Auth')

module.exports = async (req, res, next) => {
  const auth = new Auth()
  const accessToken = req.get('Access-Token')
  if (!accessToken) {
    res.status(401).json({
      message: 'Access not authorized.'
    })
  } else {
    try {
      await auth.checkToken(accessToken)
      next()
    } catch (e) {
      res.status(401).json({
        message: 'Access not authorized.',
        error: e.message
      })
    }
  }
}

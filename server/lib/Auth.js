const SignAuth = require('signauth')
const {b32Hash, fromBase32, toBase32, getRandomBase32String} = SignAuth.Crypto
const signAuth = new SignAuth()

class Auth {

  constructor() {
    this.db = require('./Db')
  }

  validate(email) {
    // eslint-disable-next-line no-control-regex
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
    return expression.test(email.toLowerCase())
  }

  getKey(email) {
    return 'email:' + toBase32(email)
  }

  async getUser(email) {
    let result = await this.db.knex.select('*').from('users').where({email})
    if (result && result[0]) {
      return result[0]
    }
  }

  async exists(email) {
    if (await this.getUser(email)) {
      return true
    } else {
      return false
    }
  }

  async newChallenge(email, scope) {
    let user
    if (scope === 'signin') {
      user = await this.getUser(email)
    } else {
      user = {
        nonce: 1
      }
    }
    return signAuth.newChallenge(email, user.nonce)
  }

  verifyPayload(payload) {
    return signAuth.verifyPayload(payload)
  }

  async signin(email, payload) {
    let user = await this.getUser(email)
    if (user.public_key === payload.publicKey) {
      await this.db.knex('users').update({
        nonce: user.nonce + 1,
        last_signin_at: Date.now()
      }).where({email})
      let [token, expiration] = await this.newToken(email)
      await this.db.knex.insert({
        email,
        token,
        expiration
      }).into('tokens')

      // To purge expired tokens. it should be scheduled
      await this.db.knex('tokens').where('expiration', '<', Date.now()).del()

      return token
    } else {
      throw new Error('The public key is wrong; double check your passphrase')
    }
  }

  async signout(email, token) {
    if (!await this.checkToken(token)) {
      throw new Error('The user is not logged in')
    }
    await this.db.knex('tokens').where({email, token}).del()
    return true
  }

  async signup(email, payload) {
    if (await this.exists(email)) {
      throw new Error('The user already exists; please signin')
    }
    const [token, expiration] = await this.newToken(email)
    await this.db.knex.insert({
      email,
      public_key: payload.publicKey,
      nonce: 2,
      created_at: Date.now(),
      last_signin_at: Date.now()
    }).into( 'users')
    await this.db.knex.insert({
      email,
      token,
      expiration
    }).into('tokens')
    return token
  }

  async checkToken(token) {
    // this should be cached for better performances

    const email = fromBase32(token.split(';')[0]).toString()
    if (!this.validate(email)) {
      throw new Error('The token is not valid')
    } else if (!this.exists(email)) {
      throw new Error('The user associated with the token does not exist')
    } else {
      let tokens = await this.db.knex.select('*').from('tokens').where({email})
      let found = false
      for (let t of tokens) {
        if (t.token === token) {
          found = true
          break
        }
      }
      if (!found) {
        throw new Error('Token not found')
      }
      return true
    }
  }

  async getInfo(email) {
    let user = await this.getUser(email)
    let tokens = await this.db.knex.select('*').from('tokens').where({email})
    return {
      createdAt: user.created_at,
      lastSigninAt: user.last_signin_at,
      activeSessions: tokens.length,
      publicKey: user.public_key
    }
  }

  async newToken(email) {
    // In this example, tokens expire in 3 days
    let expiration = (Date.now() + 1000 * 3600 * 24 * 3)
    let token = [
      toBase32(email),
      getRandomBase32String(8),
      expiration
    ].join(';')
    token += ';' + b32Hash(token).substring(0, 1)
    return [token, expiration]
  }
}

module.exports = Auth


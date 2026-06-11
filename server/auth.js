// Simple in-memory token auth for the exam prototype.
// NOTE: This is a demo login for the prototype, NOT production-grade security.
// A real app would hash passwords and use signed JWTs or server-side sessions.
const crypto = require('crypto')

// Demo credentials for the festival manager.
const DEMO_USERNAME = 'festivalsjef'
const DEMO_PASSWORD = '2inf2026'

// Valid tokens are kept in memory only and are lost on restart. That is fine
// for a single-container prototype.
const validTokens = new Set()

// True if the given username/password match the demo credentials.
function checkCredentials(username, password) {
  return username === DEMO_USERNAME && password === DEMO_PASSWORD
}

// Create and remember a new random token.
function issueToken() {
  const token = crypto.randomBytes(24).toString('hex')
  validTokens.add(token)
  return token
}

// True if the token is one we have issued.
function isValidToken(token) {
  return Boolean(token) && validTokens.has(token)
}

// Express middleware: require a valid "Authorization: Bearer <token>" header.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!isValidToken(token)) {
    return res
      .status(401)
      .json({ message: 'Ikke autorisert. Logg inn som festivalsjef.' })
  }
  next()
}

module.exports = { checkCredentials, issueToken, isValidToken, requireAuth }

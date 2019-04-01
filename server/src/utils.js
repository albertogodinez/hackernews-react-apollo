const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some'; // used to sign JWT's

/**
 * Helper function that you'll call in resolvers which require
 * authentication (such as post). It retrieves the Authorization
 * header (which contains the User's JWT) from the context. It then
 * verifies the JWT and retrieves the User's ID from it.
 * @param {*} context
 */
function getUserId(context) {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error('Not authenticated');
}

module.exports = {
  APP_SECRET,
  getUserId
};

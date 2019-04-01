const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function vote(parent, args, context, info) {
  // 1. validate the incoming JWT
  const userId = getUserId(context);

  // 2. auto generated $exists function that is created by prisma
  // takes in a where filter object that allows to specify certain conditions
  // about elements of that type. Only if the condition applies to at least one
  // element in the database does the $exists function return true.
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  // 3.
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  });
}

async function signup(parent, args, context, info) {
  // 1. Encrypts the User's password using the bcrypt.js library
  const password = await bcrypt.hash(args.password, 10);

  // 2. Use the prisma client instance to store the new User in the database
  const user = await context.prisma.createUser({ ...args, password });

  // 3. Generate a JWT which is signed with an APP_SECRET
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4. Return the token and the user in an object that adheres to
  // the shape of an AuthPayload object
  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  // 1. Uses the prisma client instance to retrieve the existing User record
  // by the email address that was sent along as an argument in the login mutation
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error('No such user found');
  }

  // 2. Compare the provided password with the one that is stored in the database.
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3. Return the token and user
  return {
    token,
    user
  };
}

function post(parent, args, context, info) {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
}

module.exports = {
  signup,
  login,
  post,
  vote
};

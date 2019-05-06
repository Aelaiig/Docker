const { UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server');
const axios = require('axios');

const { GraphQLScalarType } = require('graphql');
const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');
const fs = require('fs');
const http = require('http');
const movieDB = require('moviedb-scrapper-hypertube');
const OS = require('opensubtitles-api');
const torrentFinder = require('torrentfinder-hypertube');
const sendMail = require('./helpers/sendMail.js');
const jwt = require('jsonwebtoken');
const { User } = require('./models/User.js');
const { Movie } = require('./models/Movie.js');
const validator = require('./helpers/validator.js');
const helpers = require('./helpers/helpers.js');

function getToken(context) {
  return jwt.verify(context.response.req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
}

const resolvers = {
  Query: {
    async getUserInfo(_, { id }) {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new UserInputError('Incorrect ID.');
        }
        const user = await User.findById(id, 'login firstname lastname picture -_id');
        if (!user) {
          throw new UserInputError('User not found.');
        }
        return user;
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async signIn(_, { login, password }) {
      try {
        const token = await validator.checkSignIn(login, password);
        return token;
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async askToken(_, args, context) {
      const user = await validator.IsValidAuthKey(args.authKey);
      if (user !== false) {
        return helpers.generateToken(user);
      }
      return false;
    },
    getBackgrounds(_, args, context) {
      const dir = './../client/public/background/';
      return new Promise((resolve, error) => fs.readdir(dir, (err, files) => {
        resolve(`/background/${files[Math.floor(Math.random() * Math.floor(files.length))]}`);
      }));
    },
    getAvatars(_, args, context) {
      const avatars = [];
      const dir = './../client/public/avatar/';
      return new Promise((resolve, error) => fs.readdir(dir, (err, files) => {
        files.forEach((file) => {
          avatars.push(`/avatar/${file}`);
        });
        resolve(avatars);
      }));
    },
    async selectedAvatar(_, args, context) {
      const avatar = await helpers.randomAvatar();
      return avatar;
    },
    async sendResetPassword(_, { email }, context) {
      const user = await validator.emailExist(email);
      sendMail(user.email, 'Please reset your password',
        `Please follow this link in order to confirm your new email address :
        ${process.env.SERVER_CLIENT}/resetPassword/${user.authKey}`);
      return 'Check your email to reset your password';
    },
  },
  Mutation: {
    async signUp(_, {login, firstname, lastname, email, password, picture }) {
      try {
        const authKey = await helpers.generateAuthKey();
        const errorMessage = await validator.checkDbSignup(login, email, picture);
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          login,
          firstname,
          lastname,
          email,
          password: hashPassword,
          picture,
          authKey,
        });
        return user;
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async signUpOmniauth(_, { authKey, login, firstname, lastname, email, picture }) {
      const errorMessage = await validator.checkDbSignupOmniauth2(authKey, login, email, picture);
      const updateUser = await User.updateOne({ authKey }, { $set: { 
        login,
        firstname,
        lastname,
        email,
        picture,
      }});
      const user = await User.findOne({ authKey });
      return helpers.generateToken(user);
    },
    async changeEmail(_, { id, password, newEmail }) {
      try {
        if (!helpers.validateEmail(newEmail)) throw new UserInputError('Please enter a valid email address');
        const user = await User.findById(id, 'email password strategy -_id');
        if (!user) throw new UserInputError('No user corresponding to this ID.');
        if (newEmail === user.email) throw new UserInputError('You already use this email');
        const checkEmail = await User.find({ email: newEmail });
        if (checkEmail.length > 0) throw new ForbiddenError('Email already in use.');
        if (user.strategy === 'locale' && !await bcrypt.compare(password, user.password)) throw new AuthenticationError('Incorrect Password');
        const newEmailToken = Math.random().toString(36).substr(2)
          + Math.random().toString(36).substr(2);
        await User.updateOne({ _id: id }, { newEmail, newEmailToken });
        sendMail(newEmail,
          'Please confirm your new email address',
          `Please follow this link in order to confirm your new email address : 
          ${process.env.SERVER_CLIENT}/confirmNewEmail/${newEmailToken}`);
        return `You received an email on your new email address, 
          you must confirm it before it will be taken into account`;
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
    async resetPassword(_, args, context) {
      try {
        console.log('args.authKey', args.authKey);
        const isvalid = await validator.IsValidAuthKey2(args.authKey);
        if (isvalid !== false) {
          await User.updateOne({ authKey: args.authKey }, { password: await bcrypt.hash(args.password, 10) });
          return true;
        }
        throw new AuthenticationError('Invalid authentification');
      } catch (err) {
        return helpers.errorHandler(err);
      }
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue: value => moment(value).toDate(), // value from the client
    serialize: value => value.getTime(), // value sent to the client
    parseLiteral: ast => ast,
  }),
};

module.exports = resolvers;

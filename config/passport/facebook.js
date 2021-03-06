/* jshint esversion: 6 */

// Modules
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const mongoose = require('mongoose')

// Variables
const AUTH = require('../app/auth')
const CONFIG = {
  clientID: AUTH.facebookAuth.clientID,
  clientSecret: AUTH.facebookAuth.clientSecret,
  callbackURL: AUTH.facebookAuth.callbackURL,
  profileFields: [
    'id',
    'email',
    'gender',
    'photos',
    'link',
    'locale',
    'name',
    'timezone',
    'updated_time',
    'verified'
  ]
}

// Models
const User = mongoose.model('User')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

// Facebook
passport.use(new FacebookStrategy(CONFIG, (token, refreshToken, profile, done) => {
  process.nextTick(() => {
    let FILTER = {
      'facebook.id': profile.id
    }

    User
      .findOne(FILTER, (err, user) => {
        if (err) {
          return done(err)
        }

        if (user) {
          // Devuelvo usuario encontrado
          return done(null, user)
        } else {
          FILTER = {
            'local.email': profile.emails[0].value
          }

          User
            .findOne(FILTER, (err, user) => {
              if (err) {
                return res.failure(-1, 'Error social', 200)
              } else if (!user) {
                // Usuario local no existe
                const newUser = new User({
                  facebook: {
                    id: profile.id,
                    token,
                    name: `${profile.name.givenName} ${profile.name.familyName}`,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                  },
                  local: {
                    createdAt: Date.now(),
                    roles: [
                      'user'
                    ],
                    username: `${profile.name.givenName} ${profile.name.familyName}`,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    creationMethod: 'fb',
                    isConfirmed: true
                  }
                })

                newUser
                  .save(err => {
                    if (err) {
                      throw err
                    } else {
                      return done(null, newUser)
                    } // if/else
                  }) // newUser.save()
              } else {
                // Usuario local ya existe
                if (!user.local.username) {
                  user.local.username = `${profile.name.givenName} ${profile.name.familyName}`
                }

                if (!user.local.email) {
                  user.local.email = profile.emails[0].value
                }

                user.facebook = {
                  id: profile.id,
                  token,
                  name: `${profile.name.givenName} ${profile.name.familyName}`,
                  email: profile.emails[0].value,
                  avatar: profile.photos[0].value
                }

                user
                  .save((err, updatedUser) => {
                    if (err) {
                      throw err
                    } else {
                      return done(null, updatedUser)
                    } // if/else
                  }) // user.save()
              } // if/else
            }) // User.findOne()
        } // if/else
      }) // User.findOne()
  })
}))
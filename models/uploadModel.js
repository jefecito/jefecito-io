/* jshint esversion: 6 */

// Modulos
const mongoose = require('mongoose')

// Declare schema
const uploadSchema = new mongoose.Schema({
  uploadedAt: Date,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadName: String,
  uploadSize: Number,
  uploadPath: String,
  uploadAlias: String,
  uploadHash: String,
  uploadTo: {
    global: {
      type: Boolean,
      default: false,
      required: true
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    folder: {
      type: String,
      default: 'default'
    }
  },
  downloadCounter: {
    type: Number,
    default: 0
  }
}, {
  collection: 'Upload'
})

module.exports = mongoose.model('Upload', uploadSchema)
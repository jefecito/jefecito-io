var mongoose = require('mongoose');

var uploadSchema = mongoose.Schema({
  uploadedAt: Date,
  uploadedBy: {
    id: String,
    username: String
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
  downloadCounter : {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Upload', uploadSchema);
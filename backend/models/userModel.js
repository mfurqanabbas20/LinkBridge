const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    description: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    stripeAccount: {
      type: String,
      default: null,
    },
    connections: [
      {
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        status: {type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending'},
        requestedAt: {type: Date, default: Date.now},
        connectedAt: {type: Date, default: Date.now}
      }
    ],
    role: {
        type: String,
        required: true,
        enum: ['Student', 'Teacher', 'Industry Professional']
    },
    university: {
        type: String,
        default: null
    },
    industry: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema)



module.exports = userModel

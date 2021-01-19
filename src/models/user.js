const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(input) {
      if (input.length <= 6) {
        throw new Error('Password must be at least 6 characters')
      }
      if (input.toLowerCase().includes('password')) {
        throw new Error('Password must not include "password"')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  },
}, {
  timestamps: true
});
// This is not real data, just guidiance to determine relationships
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});
// Instance methods
// We trim the user data not to send back unnecessary stuff
// This is called every time userData gets stringifyed by express
userSchema.methods.toJSON = function () {
  const user = this;
  // Return raw user data
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
}
// Generate a new auth token on create/login
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
}
//model methods
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
}

// This is a mongoose middleware that runs before the call
// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  // this is true on creation and update too
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  // We need to call next in oder to tell the program we are done!
  next();
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
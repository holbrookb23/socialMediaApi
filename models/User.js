const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    thoughts: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Thought',
    }],
    friends: [{ 
      type: Schema.Types.ObjectId,
      ref: [this],
    }],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

userSchema.virtual('friendCount').get(function() {
  return this.friends.length
});

const User = model('User', userSchema);

module.exports = User;

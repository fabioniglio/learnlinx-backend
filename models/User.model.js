const { Schema, model , mongoose} = require('mongoose')

// TODO: Please make sure you edit the Book model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    profilePictureUrl: {
      type: String
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true
    },
    courseId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    isTeacher: {
      type: Boolean,
      default: false
    },    
    isAdmin: {
      type: Boolean,
      default: false
    }
})

const User = model('User', userSchema)

module.exports = User

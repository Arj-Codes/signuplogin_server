const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not a valid email");
      }
    },
  },
  otp: {
    type: String,
    required: true,
  },
  isVerified : {
    type:String,
    required:true,
    default: "false",
  }
});

userSchema.pre("save",async function(next){
  next();
});

const users = new mongoose.model("users", userSchema);
module.exports = users;


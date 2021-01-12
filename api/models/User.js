const mongoose = require('mongoose');
const word = require('./Word');

const UserSchema = mongoose.Schema ({
     email:String,
     username: String,
     password: String,
     mobileNumber: String,
     isVerified:{
          type: Boolean,
          default: false
     },
     score: {
        type: Number,
        default: 0
     },
     lastUpdated: Date,
     completed: [{
          type:mongoose.Schema.Types.ObjectId,
          ref:'word'
     }],
     verificationCode: String,
     passwordResetId: String
})


module.exports = mongoose.model('user', UserSchema);

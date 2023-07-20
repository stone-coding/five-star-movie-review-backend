const mongoose = require("mongoose")
const bcrypt = require('bcrypt');


const passwordResetTokenSchema = mongoose.Schema({
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    //email token validate for 1 hour(3600s) amd validate as it has been created
    createAt: {
        type:Date,
        expires: 3600,
        default: Date.now()
    }
})

// run the function before save token, this is 'newUser'
// next() after hashing the token, userSchama save the user
passwordResetTokenSchema.pre('save',async function(next) {
    if(this.isModified('token')){
        this.token = await bcrypt.hash(this.token,10)
    }

    next();
})

passwordResetTokenSchema.methods.compareToken = async function(token){
    const result = await bcrypt.compare(token, this.token);
    return result
}

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema)

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        unique: true,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    status:{
        type:Boolean,
        default: true
    }
});

module.exports = mongoose.model('User',userSchema);
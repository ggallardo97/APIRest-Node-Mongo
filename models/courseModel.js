const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    students:{
        type:Number,
        default:0
    },
    published:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('Course',courseSchema);
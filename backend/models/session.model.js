const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    role:{
        type:String,
        require:true
    },
    experience:{
        type:String,
        require:true
    },
    topicToFocus:{
        type:String,
        require:true,
    },
    description:{
        type:String,
    },
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Question"
    }],
},
{
    timestamps:true
})
module.exports = mongoose.model("Session",sessionSchema);
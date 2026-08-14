const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
        unique : true
    },

    email : {
        type : String,
        required : true , 
        unique : true 
    },

    password : {
       type : String,
       required : true, 
    },

    role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default: "employee"
    },

    department: {
    type: String,
    enum: [
            "HR", "Production", "Maintenance", "Quality", "Safety", "IT",
            "Finance", "Logistics", "Research and Development", "Sales",
            "Marketing", "Customer Service", "Legal", "Procurement",
            "Administration", "Training", "Security", "Environmental",
            "Engineering", "Project Management", "Business Development",
            "Public Relations",
        ]
    },

    profilePicture: {
        type: String,
        default: "default"
    },

    isVerified: {
        type : Boolean,
        default : false,
    },

    verificationcode: {
        type : String,
    },

    verificationcodeexpires: {
        type : Date,
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },
})
const userModel = mongoose.model("user" , userSchema);

module.exports = userModel 
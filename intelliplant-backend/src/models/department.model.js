const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})
const departmentModel = mongoose.model('Department', departmentSchema);

module.exports = departmentModel;

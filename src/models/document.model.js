const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    filetype: {
        type: String,
        required: true
    },
    filesize: {
        type: Number,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const documentModel = mongoose.model("Document", documentSchema);

module.exports = documentModel;
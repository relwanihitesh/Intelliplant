const documentModel = require('../models/document.model');
const storageService = require('../services/storageService');
const { processDocument , deleteDocumentEmbeddings} = require('../services/documentProcessingService');
const { uploadDocumentSchema } = require('../validations/documentValidation');
const logger = require('../config/logger');

const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const validation = uploadDocumentSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: "validation failed",
                errors: validation.error.issues.map(e => e.message)
            });
        }

        const { title, department } = validation.data;
        const { originalname, mimetype, size, buffer } = req.file;
        const uploadResult = await storageService.uploadFile(buffer, originalname);

        const newDocument = new documentModel({
            title,
            filename: originalname,
            filepath: uploadResult.url,
            filetype: mimetype,
            filesize: size,
            uploadedBy: req.user.id,
            department,
        });

        await newDocument.save();

        processDocument(buffer, newDocument._id, title, department, mimetype).catch(err => {
            console.error("Background processing failed:", err);
        });

        return res.status(201).json({ message: "Document uploaded successfully", document: newDocument });
    } catch (error) {
        logger.error(`Error uploading document: ${error.message}`);
        return res.status(500).json({ message: "internal server error", error: error.message });
    }
};

const getAllDocuments = async (req, res) => {
    console.log("User role:", req.user.role);
    console.log("User department:", req.user.department);

    try {
        if (req.user.role === "admin") {
            const documents = await documentModel.find();
            console.log("Admin query result:", documents);
            return res.status(200).json({ documents });
        } else {
            const documents = await documentModel.find({ department: req.user.department });
            console.log("Employee query result:", documents);
            return res.status(200).json({ documents });
        }
    } catch (error) {
        logger.error(`Error fetching documents: ${error.message}`);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getSingleDocument = async (req, res) => {
    try {
        const document = await documentModel.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (req.user.role !== "admin" && document.department !== req.user.department) {
            return res.status(403).json({ message: "forbidden access" });
        }

        return res.status(200).json({ document });
    } catch (error) {
        logger.error(`Error fetching document: ${error.message}`);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const document = await documentModel.findByIdAndDelete(req.params.id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        await deleteDocumentEmbeddings(req.params.id).catch(err => {
            console.error("Failed to delete embeddings:", err);
        });

        return res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting document: ${error.message}`);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { uploadDocument, getAllDocuments, getSingleDocument, deleteDocument };
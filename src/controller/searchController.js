const documentModel = require('../models/document.model');
const { searchSimilarDocuments } = require('../services/semanticSearchService');
const logger = require('../config/logger');

const searchDocuments = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({ message: "keyword is required" });
        }

        let documents;

        if (req.user.role === "admin") {
            documents = await documentModel.find({
                title: { $regex: keyword, $options: 'i' }
            });
        } else {
            documents = await documentModel.find({
                title: { $regex: keyword, $options: 'i' },
                department: req.user.department
            });
        }

        return res.status(200).json({
            message: "search completed successfully",
            count: documents.length,
            documents,
        });
    } catch (error) {
        logger.error(`Error searching documents: ${error.message}`);
        return res.status(500).json({ message: "internal server error", error: error.message });
    }
};

const semanticSearch = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ message: "search query (q) is required" });
        }

        const results = await searchSimilarDocuments(q, req.user.department, req.user.role);

        return res.status(200).json({
            message: "semantic search completed",
            count: results.length,
            results,
        });
    } catch (error) {
        logger.error(`Error in semantic search: ${error.message}`);
        return res.status(500).json({ message: "internal server error", error: error.message });
    }
};

module.exports = { searchDocuments, semanticSearch };
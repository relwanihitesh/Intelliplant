const { generateEmbedding } = require('./embeddingService');
const pinecone = require('../config/pinecone');
const logger = require('../config/logger');

const searchSimilarDocuments = async (query, userDepartment, userRole) => {
    try {
        const queryEmbedding = await generateEmbedding(query);

        const index = pinecone.index("document-embeddings");

        const queryOptions = {
            vector: queryEmbedding,
            topK: 5,
            includeMetadata: true,
        };

        if (userRole !== "admin") {
            queryOptions.filter = { department: userDepartment };
        }

        const searchResult = await index.query(queryOptions);

        const results = searchResult.matches.map((match) => ({
            title: match.metadata.title,
            department: match.metadata.department,
            textSnippet: match.metadata.text.substring(0, 200) + "...",
            similarityScore: match.score,
        }));

        return results;
    } catch (error) {
        logger.error(`Error in semantic search: ${error.message}`);
        throw error;
    }
};

module.exports = { searchSimilarDocuments };
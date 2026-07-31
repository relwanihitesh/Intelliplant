const genAI = require('../config/gemini');

const generateEmbedding = async (text) => {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent({
        content: { parts: [{ text }] },
        outputDimensionality: 2048
    });
    return result.embedding.values;
};

module.exports = { generateEmbedding };
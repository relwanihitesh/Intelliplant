const { generateEmbedding } = require('./embeddingService');
const genAI = require('../config/gemini');
const pinecone = require('../config/pinecone');
const logger = require('../config/logger');

const askQuestion = async (question, userDepartment, userRole) => {
    try {

        const questionEmbedding = await generateEmbedding(question);

        const index = pinecone.index("document-embeddings");

        const queryOptions = {
            vector: questionEmbedding,
            topK: 5,
            includeMetadata: true,
        };

        if (userRole !== "admin") {
            queryOptions.filter = { department: userDepartment };
        }

        const searchResult = await index.query(queryOptions);

        if (!searchResult.matches || searchResult.matches.length === 0) {
            return {
                answer: "I couldn't find any relevant information in the available documents.",
                sources: [],
            };
        }

        const contextChunks = searchResult.matches.map((match) => match.metadata.text);
        const context = contextChunks.join("\n\n---\n\n");

        console.log("=== MATCHED CHUNKS ===");
        console.log(context);
        console.log("=== END ===");

        const sources = [
            ...new Set(searchResult.matches.map((match) => match.metadata.title)),
        ];

        const prompt = `You are a company knowledge assistant. Answer the employee's question using ONLY the context provided below. If the answer is not present in the context, say you don't have that information. Do not make up information.

Context:
${context}

Question: ${question}

Answer:`;

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        return { answer, sources };
    } catch (error) {
        logger.error(`Error in askQuestion: ${error.message}`);
        throw error;
    }
};

module.exports = { askQuestion };
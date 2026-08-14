const { extractTextFromPDF } = require('./textExtractionService');
const { chunkText } = require('./chunkingService');
const { generateEmbedding } = require('./embeddingService');
const pinecone = require('../config/pinecone');
const logger = require('../config/logger');

const processDocument = async (buffer, documentId, title, department, fileType) => {
    try {
        
        if (fileType !== "application/pdf") {
            console.log(`Skipping AI processing for ${title} — unsupported file type: ${fileType}`);
            return { success: false, reason: "unsupported file type" };
        }

        const text = await extractTextFromPDF(buffer);
        const chunks = await chunkText(text);
        const index = pinecone.index("document-embeddings");

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const embedding = await generateEmbedding(chunk);
            const uniqueId = `${documentId}-chunk-${i}`;

            await index.upsert([
                {
                    id: uniqueId,
                    values: embedding,
                    metadata: {
                        text: chunk,
                        documentId: documentId.toString(),
                        title: title,
                        department: department,
                    },
                },
            ]);
        }

        console.log(`Processed and stored ${chunks.length} chunks for document ${documentId}`);
        return { success: true, chunksProcessed: chunks.length };
    } catch (error) {
        logger.error(`Error processing document: ${error.message}`);
        throw error;
    }
};

const deleteDocumentEmbeddings = async (documentId) => {
    const index = pinecone.index("document-embeddings");

    await index.deleteMany({
        filter: {
            documentId: documentId.toString(),
        },
    });

    console.log(`Deleted embeddings for document ${documentId}`);
};

module.exports = { processDocument , deleteDocumentEmbeddings};
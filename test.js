require('dotenv').config();
const { generateEmbedding } = require('./src/services/embeddingService');
const pinecone = require('./src/config/pinecone');

const testPineconeUpsert = async () => {
    const index = pinecone.index("document-embeddings"); // apna index naam daalo

const embedding = await generateEmbedding("The HR policy allows 12 casual leaves per year.");
console.log("Embedding length before upsert:", embedding.length); // ye line add karo

await index.upsert([
    {
        id: "test-chunk-1",
        values: embedding,
        metadata: { text: "The HR policy allows 12 casual leaves per year." }
    }
]);

    console.log("Upsert done!");

    // Ab search karke dekho
    const queryEmbedding = await generateEmbedding("How many leaves do employees get?");

    const searchResult = await index.query({
        vector: queryEmbedding,
        topK: 1,
        includeMetadata: true
    });

    console.log("Search Result:", JSON.stringify(searchResult, null, 2));
};

testPineconeUpsert();
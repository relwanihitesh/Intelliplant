const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');

const chunkText = async (text) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const chunks = await textSplitter.splitText(text);
    return chunks;
};

module.exports = { chunkText };
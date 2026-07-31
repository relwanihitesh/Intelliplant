const imagekit = require('../config/imagekit');

const uploadFile = async (fileBuffer, fileName, fileType) => {
    const uploadResponse = await imagekit.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: "documents"
    });
    return uploadResponse;   
};

const deleteFile = async (fileId) => {
    const deleteResponse = await imagekit.deleteFile(fileId);
    return deleteResponse;
};

module.exports = { uploadFile , deleteFile };
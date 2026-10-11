const config = require("../Config/config");
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    privateKey : config.IMAGEKIT_PRIVATE_KEY,
    publicKey : config.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint : config.IMAGEKIT_URL_ENDPOINT
})

async function uploadfile(file, fileName){
    const result = await imagekit.upload({
        file: file,
        fileName : fileName,
    })
    return result;
}

module.exports = {uploadfile};
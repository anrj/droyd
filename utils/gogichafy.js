const { Client } = require('@gradio/client');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function getImageAsBlob(attachment) {
	if (typeof attachment === 'string') {
		const buffer = fs.readFileSync(attachment);
		const ext = path.extname(attachment).toLowerCase();
		const mimeTypes = {
			'.jpg': 'image/jpeg',
			'.jpeg': 'image/jpeg',
			'.png': 'image/png',
			'.gif': 'image/gif',
			'.webp': 'image/webp',
		};
		const contentType = mimeTypes[ext] || 'image/jpeg';
		return new Blob([buffer], { type: contentType });
	}
	
	if (!attachment.contentType.includes('image/')) {
		throw new Error('File must be an image');
	}
	const response = await axios.get(attachment.url, {
		responseType: 'arraybuffer',
	});
	return new Blob([response.data], { type: response.headers["content-type"] });
}

async function swapFace(sourceImg, targetImg){
  try {

    const client = await Client.connect("sdiffu1024/FaceSwapAll");

    const sourceBlob = await getImageAsBlob(sourceImg);
    const targetBlob = await getImageAsBlob(targetImg);

    const result = await client.predict("/predict", {
      src_img: sourceBlob,
      src_idx: 1,
      dst_img: targetBlob,
      dst_idx: 1,
    });

    // console.log("Full result:", JSON.stringify(result, null, 2));
    // console.log("Result data:", result.data);
    // console.log("Result data[0]:", result.data[0]);

    const swappedImageUrl = result.data[0].url;

    return swappedImageUrl
  } catch (error) {
    console.error("Face swap failed:", error);
    throw error;
  }
}

module.exports = {
	swapFace,
};

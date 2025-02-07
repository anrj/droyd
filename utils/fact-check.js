const sharp = require('sharp');
const axios = require('axios');
const path = require('path');

async function getImage(attachment) {
	if (!attachment.contentType.includes('image/')) {
		throw new Error('File must be an image');
	}
	const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
	return response.data;
}

async function factcheck(image, by, as) {
	const overlayPath = path.join(__dirname, 'media', 'assets', as.toString().toLowerCase() + '.png');
	const outputPath = path.join(__dirname, 'media', 'factcheck.gif');
	const arrowPath = path.join(__dirname, 'media', 'assets', 'arrow.gif');
	const fontPath = path.join(__dirname, 'media', 'assets', 'PassengerSerif.otf');
	const imageBuffer = await getImage(image);
	const imageMetadata = await sharp(imageBuffer).metadata();
	const overlayText = 'This post was fact checked by ' + by;
	const isLandscape = imageMetadata.width - imageMetadata.height > 50;


	const resizedOverlay = await sharp(overlayPath)
		.resize({ width: isLandscape ? Math.round(imageMetadata.height * 0.69) : Math.round(imageMetadata.width * 0.69) })
		.extend({
			bottom: Math.round(imageMetadata.height * 0.05),
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.toBuffer();

	const resizedArrow = await sharp(arrowPath, { animated: true })
		.resize({ width: isLandscape ? Math.floor(imageMetadata.height * 0.25) : Math.floor(imageMetadata.width * 0.25) })
		.toBuffer();
	const resizedArrowMD = await sharp(resizedArrow).metadata();

	const extendedLArrow = await sharp(resizedArrow, { animated: true })
		.extend({
			top: 0,
			bottom: imageMetadata.height - resizedArrowMD.height,
			left: 0,
			right: imageMetadata.width - resizedArrowMD.width,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.toBuffer();
	const extendedRArrow = await sharp(resizedArrow, { animated: true })
		.extend({
			top: 0,
			bottom: imageMetadata.height - resizedArrowMD.height,
			left: imageMetadata.width - resizedArrowMD.width,
			right: 0,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.toBuffer();

	const output = await sharp(imageBuffer).composite(
		[
			{ input: resizedOverlay, gravity: 'south' },
			{ input:
        { text:
          { text: `<span foreground="white">${overlayText}</span>`,
          	font: 'Passenger Serif',
          	fontfile: fontPath,
          	height: isLandscape ? Math.round(imageMetadata.width * 0.2) : Math.round(imageMetadata.height * 0.4),
          	width: Math.round(imageMetadata.width * 0.98),
          	align: 'center',
          	wrap: 'word',
          	rgba: true,
          },
        },
			},
		],
	)
		.toBuffer();

	const toiletRollImage = await sharp({
		create: {
			width: imageMetadata.width,
			height: imageMetadata.height * 2,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	})
		.composite([
			{ input: output, top: 0, left: 0 },
			{ input: output, top: imageMetadata.height, left: 0 },
		])
		.gif({ pageHeight: imageMetadata.height, loop: 0, delay: 80 })
		.toBuffer();

	// Output path
	await sharp(toiletRollImage, { animated : true }).composite(
		[
			{ input: extendedLArrow, animated: true },
			{ input: extendedRArrow, animated: true },
		],
	)
		.toFile(outputPath);


	return outputPath;
}


module.exports = {
	factcheck,
};
const axios = require('axios');
const path = require('node:path');
const sharp = require('sharp');
const tesseract = require('tesseract.js');
const text2caption = require('./text2caption.js');
const { translate } = require('@vitalets/google-translate-api');
const { fetchTenorGif } = require('./fetchTenorGif.js');
const { negate_caption } = require('./negate.js');

// Refactor this code to be DRY

function isTenor(url) {
	const regex = /^https:\/\/tenor\.com(\/.*)?$/;
	return regex.test(url);
}

async function transcaption(link, from, to) {
	const filePath = path.join(__dirname, 'media', 'outputs', 'caption');
	const filePath2 = path.join(__dirname, 'media', 'outputs', 'caption2.jpg');

	try {
		const response = await axios.get(link, { responseType: 'arraybuffer' });
		const metadata = await sharp(response.data).metadata();
		const leftStrip = await sharp(response.data)
			.extract({ left: metadata.width - 3, top: 0, width: 3, height: metadata.height })
			.toBuffer();

		const trimmed = await sharp(leftStrip).trim({ threshold: 6 }).toBuffer();
		const trimmedMetadata = await sharp(trimmed).metadata();
		console.log(`Width: ${metadata.width}, Height: ${metadata.height}`);
		console.log(`Width: ${trimmedMetadata.width}, Height: ${trimmedMetadata.height}`);

		const uncaptionedImage =
		sharp(response.data)
			.extract({ left: 0, top: metadata.height - trimmedMetadata.height, width: metadata.width, height: trimmedMetadata.height })
			.toBuffer();
			// .toFile(filePath);

		// Caption Region
		sharp(response.data)
			.extract({ left: 0, top: 0, width: metadata.width, height: metadata.height - trimmedMetadata.height })
			.toFile(filePath);

		// OCR
		let { data: { text } } = await tesseract.recognize(filePath, from);
		text = text.replace(/\n/g, ' ');
		console.log('Extracted text:', text);

		// Translate
		const { text: translatedText } = await translate(text, { to: to });
		console.log(translatedText);

		const { svgString, svgHeight } = await text2caption.createTextSvgWithFont(translatedText, metadata.width);
		console.log(svgString);

		await sharp(await uncaptionedImage)
			.extend({
				top: svgHeight,
				bottom: 0,
				left: 0,
				right: 0,
				background: { r: 255, g: 255, b: 255, alpha: 255 },
			})
			.composite([{
				input: Buffer.from(svgString),
				top: 0,
				left: 0,
			}])
			.toFile(filePath2);
	}
	catch (err) {
		console.log('Error fetching or saving file: ' + err);
	}
	console.log(filePath2);
	return filePath2;
};

async function transcaption2(link, from, to) {
	const filePath = path.join(__dirname, 'media', 'outputs', 'gif.gif');
	const filePath3 = path.join(__dirname, 'media', 'outputs', 'gifcaption');


	try {
		if (isTenor(link)) { link = await fetchTenorGif(link); };
		const response = await axios.get(link, { responseType: 'arraybuffer' });
		const metadata = await sharp(response.data).metadata();
		if (metadata.format !== 'gif') { return await transcaption(link, from, to); }
		else {
			const leftStrip = await sharp(response.data, { page: 0 })
				.extract({ left: metadata.width - 3, top: 0, width: 3, height: metadata.height })
				.toBuffer();

			const trimmed = await sharp(leftStrip).trim({ threshold: 6 }).toBuffer();
			const trimmedMetadata = await sharp(trimmed).metadata();

			const uncaptionedImage = await sharp(response.data, { animated: true })
				.extract({ left: 0, top: metadata.height - trimmedMetadata.height, width: metadata.width, height: trimmedMetadata.height })
				.toBuffer();
			const uncaptionedMetadata = await sharp(uncaptionedImage).metadata();

			// Captioned
			sharp(response.data)
				.extract({ left: 0, top: 0, width: metadata.width, height: metadata.height - trimmedMetadata.height })
				.toFile(filePath3);

			// OCR
			let { data: { text } } = await tesseract.recognize(filePath3, from);
			text = text.replace(/\n/g, ' ');
			console.log('Extracted text:', text);

			// Translate
			const { text: translatedText } = await translate(text, { to: to });
			console.log(translatedText);

			// Create the svg from the text
			const { svgString, svgHeight } = await text2caption.createTextSvgWithFont(translatedText, metadata.width);
			console.log(svgString);

			const buffer = await sharp(uncaptionedImage, { animated: true })
				.extend({
					top: svgHeight,
					bottom: 0,
					left: 0,
					right: 0,
					background: { r: 255, g: 255, b: 255, alpha: 255 },
				})
				.toBuffer();

			await sharp(buffer, { animated: true }).composite([{
				input: await sharp(Buffer.from(svgString))
					.extend({
						top: 0,
						bottom: uncaptionedMetadata.height,
						left: 0,
						right:0,
						background: { r: 0, g: 0, b: 0, alpha: 0 },
					}).toBuffer(),
				tile: true,
				top: 0,
				left: 0,
			}])
				.gif()
				.toFile(filePath);
		}

	}
	catch (e) {
		console.log(e);
	}
	return filePath;
}

async function evilImage(link) {
	const filePath = path.join(__dirname, 'media', 'outputs', 'evil.jpg');
	const filePath3 = path.join(__dirname, 'media', 'outputs', 'evilcaption');

	try {
		const response = await axios.get(link, { responseType: 'arraybuffer' });
		const metadata = await sharp(response.data).metadata();

		const leftStrip = await sharp(response.data, { page: 0 })
			.extract({ left: metadata.width - 3, top: 0, width: 3, height: metadata.height })
			.toBuffer();

		const trimmed = await sharp(leftStrip).trim({ threshold: 6 }).toBuffer();
		const trimmedMetadata = await sharp(trimmed).metadata();

		// EVIL UNCAPTIONED IMAGE
		const uncaptionedImage = await sharp(response.data)
			.extract({ left: 0, top: metadata.height - trimmedMetadata.height, width: metadata.width, height: trimmedMetadata.height })
			.negate({ alpha: false })
			.toBuffer();
		const uncaptionedMetadata = await sharp(uncaptionedImage).metadata();

		// Captioned
		sharp(response.data)
			.extract({ left: 0, top: 0, width: metadata.width, height: metadata.height - trimmedMetadata.height })
			.toFile(filePath3);

		// OCR
		let { data: { text } } = await tesseract.recognize(filePath3);
		text = text.replace(/\n/g, ' ');
		console.log('Extracted text:', text);

		let evilText = await negate_caption(text);
		evilText = evilText.replace(/\bnot\b/gi, 'NOT');


		// Create the svg from the text
		const { svgString, svgHeight } = await text2caption.createTextSvgWithFont(evilText, metadata.width, true);
		console.log(svgString);

		const buffer = await sharp(uncaptionedImage)
			.extend({
				top: svgHeight,
				bottom: 0,
				left: 0,
				right: 0,
				background: { r: 255, g: 255, b: 255, alpha: 255 },
			})
			.toBuffer();

		await sharp(buffer).composite([{
			input: await sharp(Buffer.from(svgString))
				.extend({
					top: 0,
					bottom: uncaptionedMetadata.height,
					left: 0,
					right:0,
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				}).toBuffer(),
			tile: true,
			top: 0,
			left: 0,
		}])
			.gif()
			.toFile(filePath);

	}
	catch (e) {
		console.log(e);
	}
	return filePath;
}

async function evil(link) {
	const filePath = path.join(__dirname, 'media', 'outputs', 'evilgif.gif');
	const filePath3 = path.join(__dirname, 'media', 'outputs', 'evilgifcaption');

	try {
		if (isTenor(link)) { link = await fetchTenorGif(link); };
		const response = await axios.get(link, { responseType: 'arraybuffer' });
		const metadata = await sharp(response.data).metadata();
		if (metadata.format !== 'gif') { return await evilImage(link); }

		const leftStrip = await sharp(response.data, { page: 0 })
			.extract({ left: metadata.width - 3, top: 0, width: 3, height: metadata.height })
			.toBuffer();

		const trimmed = await sharp(leftStrip).trim({ threshold: 6 }).toBuffer();
		const trimmedMetadata = await sharp(trimmed).metadata();

		// EVIL UNCAPTIONED IMAGE
		const uncaptionedImage = await sharp(response.data, { animated: true })
			.extract({ left: 0, top: metadata.height - trimmedMetadata.height, width: metadata.width, height: trimmedMetadata.height })
			.negate({ alpha: false })
			.toBuffer();
		const uncaptionedMetadata = await sharp(uncaptionedImage).metadata();

		// Captioned
		sharp(response.data)
			.extract({ left: 0, top: 0, width: metadata.width, height: metadata.height - trimmedMetadata.height })
			.toFile(filePath3);

		// OCR
		let { data: { text } } = await tesseract.recognize(filePath3);
		text = text.replace(/\n/g, ' ');
		console.log('Extracted text:', text);

		let evilText = await negate_caption(text);
		evilText = evilText.replace(/\bnot\b/gi, 'NOT');


		// Create the svg from the text
		const { svgString, svgHeight } = await text2caption.createTextSvgWithFont(evilText, metadata.width, true);
		console.log(svgString);

		const buffer = await sharp(uncaptionedImage, { animated: true })
			.extend({
				top: svgHeight,
				bottom: 0,
				left: 0,
				right: 0,
				background: { r: 255, g: 255, b: 255, alpha: 255 },
			})
			.toBuffer();

		await sharp(buffer, { animated: true }).composite([{
			input: await sharp(Buffer.from(svgString))
				.extend({
					top: 0,
					bottom: uncaptionedMetadata.height,
					left: 0,
					right:0,
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				}).toBuffer(),
			tile: true,
			top: 0,
			left: 0,
		}])
			.gif()
			.toFile(filePath);

	}
	catch (e) {
		console.log(e);
	}
	return filePath;
}

module.exports = {
	transcaption,
	transcaption2,
	evil,
};

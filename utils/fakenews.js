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

const escapePango = (text) => {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&apos;')
		.replace(/"/g, '&quot;');
};

async function mtavari1(image, quote, by) {
	const mtavariOverlay = path.join(__dirname, 'media', 'assets', 'mtavari1-overlay.png');
	const outputPath = path.join(__dirname, 'media', 'mtavari1.png');
	const transparentImagePath1 = path.join(__dirname, 'media', 'mt1-transparent1.png');
	const transparentImagePath2 = path.join(__dirname, 'media', 'mt1-transparent2.png');
	const fontPath = path.join(__dirname, 'media', 'assets', 'gugeshashvili_5_mthavruli.ttf');
	const imageBuffer = await getImage(image);

	const resizedImage = await sharp(imageBuffer).resize(1080, 1080, {
		kernel: sharp.kernel.nearest,
		fit: 'cover',
		strategy: sharp.strategy.attention,
	})
		.toBuffer();

	// transparent Image Quote
	await sharp({
		create: {
			width: 400,
			height: 450,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	})
		.toFile(transparentImagePath1);

	// transparent Image By
	await sharp({
		create: {
			width: 320,
			height: 40,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	})
		.toFile(transparentImagePath2);

	const textImageQuote = await sharp(transparentImagePath1).composite([
		{ input:
      { text:
        { text: `<span foreground="white">${escapePango(quote)}</span>`,
        	font: 'Gugeshashvili_5_Mthavruli',
        	fontfile: fontPath,
        	height: 450,
        	width: 400,
        	align: 'center',
        	wrap: 'word',
        	rgba: true,
        },
      },
		},
	]).toBuffer();

	const textImageBy = await sharp(transparentImagePath2).composite([
		{ input:
      { text:
        { text: `<span foreground="#811640">${escapePango(by)}</span>`,
        	font: 'Gugeshashvili_5_Mthavruli',
        	fontfile: fontPath,
        	height: 40,
        	width: 320,
        	align: 'center',
        	wrap: 'word',
        	rgba: true,
        },
      },
		},
	]).toBuffer();

	// Overlaid Image
	await sharp(resizedImage).composite([
		{ input: mtavariOverlay },
		{ input: textImageQuote,
			top: 180,
			left: 85,
		},
		{ input: textImageBy,
			top: 785,
			left: 150,
		},
	]).toFile(outputPath);

	return outputPath;
}

async function mtavari2(image, caption) {
	const mtavariOverlay = path.join(__dirname, 'media', 'assets', 'mtavari2-overlay.png');
	const outputPath = path.join(__dirname, 'media', 'mtavari2.png');
	const transparentImagePath = path.join(__dirname, 'media', 'mt2-transparent.png');
	const fontPath = path.join(__dirname, 'media', 'assets', 'gugeshashvili_5_mthavruli.ttf');
	const imageBuffer = await getImage(image);

	const resizedImage = await sharp(imageBuffer).resize(1080, 1080, {
		kernel: sharp.kernel.nearest,
		fit: 'cover',
		strategy: sharp.strategy.attention,
	})
		.toBuffer();

	// Transparent Image
	await sharp({
		create: {
			width: 1080,
			height: 1010,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	})
		.toFile(transparentImagePath);

	const textImage = await sharp(transparentImagePath).composite([
		{ input:
      { text:
        { text: `<span foreground="white">${escapePango(caption)}</span>`,
        	font: 'Gugeshashvili_5_Mthavruli',
        	fontfile: fontPath,
        	height: 140,
        	width: 1000,
        	align: 'center',
        	wrap: 'word',
        	rgba: true,
        },
      },
		 // top: 870,
		 // left: 45,
		 gravity: 'south',
		},
	]).toBuffer();

	// Overlaid Image
	await sharp(resizedImage).composite([
		{ input: mtavariOverlay },
		{ input: textImage, top: 0, left: 0 },
	]).toFile(outputPath);

	return outputPath;
}

async function inforustavi(image, caption) {
	const InfoOverlay = path.join(__dirname, 'media', 'assets', 'inforustavi-overlay.png');
	const outputPath = path.join(__dirname, 'media', 'inforustavi.png');
	const transparentImagePath = path.join(__dirname, 'media', 'ir1-transparent.png');
	const fontPath = path.join(__dirname, 'media', 'assets', 'ARArchySemiBold.ttf');
	const imageBuffer = await getImage(image);

	const resizedImage = await sharp(imageBuffer).resize(1080, 1080, {
		kernel: sharp.kernel.nearest,
		fit: 'cover',
		strategy: sharp.strategy.attention,
	})
		.toBuffer();

	// Transparent Image
	await sharp({
		create: {
			width: 770,
			height: 160,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	})
		.toFile(transparentImagePath);

	const textImage = await sharp(transparentImagePath).composite([
		{ input:
						{ text:
							{ text: `<span foreground="white">${escapePango(caption)}</span>`,
								font: 'AR Archy',
								fontfile: fontPath,
								width: 750,
							  height: 150,
								align: 'center',
								wrap: 'word',
								rgba: true,
								spacing: 10,
							},
						},
		},
	]).toBuffer();

	// Overlaid Image
	await sharp(resizedImage).composite([
		{ input: InfoOverlay },
		{ input: textImage, top: 840, left: 250 },
	]).toFile(outputPath);

	return outputPath;
}


module.exports = {
	mtavari1,
	mtavari2,
	inforustavi,
};
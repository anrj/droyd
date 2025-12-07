const sharp = require('sharp');
const axios = require('axios');
const path = require('path');

async function getImage(attachment) {
	if (!attachment.contentType.includes('image/')) {
		throw new Error('File must be an image');
	}
	const response = await axios.get(attachment.url, {
		responseType: 'arraybuffer',
	});
	return response.data;
}

async function markupText(forgot) {
	const escapePango = (text) => {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/'/g, '&apos;')
			.replace(/"/g, '&quot;');
	};
	const text = escapePango(forgot.toUpperCase());
	const colors = ['white', '#ed8148'];
	const words = text.split(' ');
	let markupedText =
    '<span foreground="#ed8148">LEBRON JAMES </span><span foreground="white">REPORTEDLY </span><span foreground="#ed8148">FORGOT </span>';
	for (let i = 0; i < words.length; i++) {
		const color = colors[Math.floor(i / 2) % 2];
		markupedText += `<span foreground="${color}">${words[i]}</span> `;
	}

	return markupedText.trim();
}

async function lebronforgot(image, forgot) {
	const textOverlay = await markupText(forgot);
	const lebronOverlay = path.join(
		__dirname,
		'media',
		'assets',
		'lebronforgot',
		'lebronfacepalm.png',
	);
	const raptvOverlay = path.join(
		__dirname,
		'media',
		'assets',
		'lebronforgot',
		'raptv.png',
	);
	const outputPath = path.join(__dirname, 'media', 'outputs', 'forgot.png');
	const transparentImagePath = path.join(
		__dirname,
		'media',
		'outputs',
		'lf1-transparent.png',
	);
	const blackBackgroundPath = path.join(
		__dirname,
		'media',
		'outputs',
		'lf1-background.png',
	);
	const fontPath = path.resolve(
		__dirname,
		'media',
		'assets',
		'fonts',
		'coolvetica compressed hv.otf',
	);
	const imageBuffer = await getImage(image);

	const resizedImage = await sharp(imageBuffer)
		.resize(728, 620, {
			fit: 'fill',
			// strategy: sharp.strategy.attention,
		})
		.toBuffer();

	// Transparent Image
	await sharp({
		create: {
			width: 1000,
			height: 400,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	}).toFile(transparentImagePath);

	// Black Background
	await sharp({
		create: {
			width: 1080,
			height: 1080,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 100 },
		},
	}).toFile(blackBackgroundPath);

	const textImage = await sharp(transparentImagePath)
		.composite([
			{
				input: {
					text: {
						text: textOverlay,
						font: 'Coolvetica Compressed HV',
						fontfile: fontPath,
						width: 1000,
						height: 400,
						align: 'center',
						wrap: 'word',
						rgba: true,
						spacing: -50,
					},
				},
			},
		])
		.toBuffer();

	// Overlaid Image
	await sharp(blackBackgroundPath)
		.composite([
			{ input: resizedImage, gravity: 'northeast' },
			{ input: lebronOverlay },
			{ input: raptvOverlay },
			{ input: textImage, top: 560, left: 40 },
		])
		.toFile(outputPath);

	return outputPath;
}

module.exports = {
	lebronforgot,
};

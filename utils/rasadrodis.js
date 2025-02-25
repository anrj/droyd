const cheerio = require('cheerio');
const fs = require('fs/promises');
const axios = require('axios');
const path = require('path');

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function scrapeMoazrovne() {
	const questionNumber = randomInt(1, 2102);
	const url = `http://moazrovne.net/q/${questionNumber}`;
	const response = await fetch(url);

	const $ = cheerio.load(await response.text());

	const question = $('.question_question').clone().children('img').remove().end().text().trim();
	const questionImageUrl = $('.question_question img').attr('src') || null;
	if (questionImageUrl) {
		const imageResponse = await axios.get(questionImageUrl, { responseType: 'arraybuffer' });
		const imageName = path.basename(questionImageUrl);
		const imageDir = path.join(__dirname, 'media', 'outputs', 'rasadrodis');
		await fs.mkdir(imageDir, { recursive: true });
		const imagePath = path.join(imageDir, imageName);
		await fs.writeFile(imagePath, Buffer.from(imageResponse.data));
	}
	const answer = $('.answer_body .clearfix').first().find('.right_nofloat').text().trim();
	const isExplanation = $('.answer_body .clearfix').eq(1).find('.left').text().trim();
	let explanation = $('.answer_body .clearfix').eq(1).find('.right_nofloat').text().trim();

	if (!isExplanation.startsWith('კომენტარი:')) {
		explanation = null;
	}

	return {
		questionNumber,
		question,
		questionImageUrl,
		answer,
		explanation,
	};
}
module.exports = {
	scrapeMoazrovne,
};

const cheerio = require('cheerio');

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function scrapeMoazrovne() {
	const questionNumber = randomInt(1, 2102);
	const url = `http://moazrovne.net/q/${questionNumber}`;
	const response = await fetch(url);

	const $ = cheerio.load(await response.text());

	const question = $('.question_question').clone().children('img').remove().end().text().trim();
	const questionImage = $('.question_question img').attr('src') || null;
	const answer = $('.answer_body .clearfix').first().find('.right_nofloat').text().trim();
	const isExplanation = $('.answer_body .clearfix').eq(1).find('.left').text().trim();
	let explanation = $('.answer_body .clearfix').eq(1).find('.right_nofloat').text().trim();

	if (!isExplanation.startsWith('კომენტარი:')) {
		explanation = null;
	}

	return {
		questionNumber,
		question,
		questionImage,
		answer,
		explanation,
	};
}

module.exports = {
	scrapeMoazrovne,
};

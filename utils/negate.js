process.env.PYTHON_BIN = 'python';

const { python } = require('pythonia');

async function negate_caption(text) {
	try {
		const { Negator } = await python('negate');
		const negator = await Negator();

		// eslint-disable-next-line no-undef
		const negatedSentence = await negator.negate_sentence(text, prefer_contractions = false);


		console.log('Original Sentence:', text);
		console.log('Negated Sentence:', negatedSentence);
		return negatedSentence;
	}
	catch (err) {
		console.error('Error in negate_caption:', err);
		throw err;
	}
	finally {
		python.exit();
	}
}


module.exports = {
	negate_caption,
};
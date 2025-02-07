const axios = require('axios');
const { tenorAPI } = require('../config.json');

async function fetchTenorGif(link, apiKey = tenorAPI) {
	const gifId = link.split('-').pop();
	const tenorEndpoint = `https://tenor.googleapis.com/v2/posts?ids=${gifId}&key=${apiKey}`;
	try {
		const response = await axios.get(tenorEndpoint);
		const gif = response.data.results.map(result => result.media_formats.gif.url);
		console.log(gif);
		return gif;
	}
	catch (error) {
		console.error(`Error fetching GIF: ${error.message}`);
	}
}

module.exports = {
	fetchTenorGif,
};

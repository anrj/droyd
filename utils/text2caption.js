async function createTextSvgWithFont(caption, imageWidth, evil = false) {
	const evilFilterBackground = evil ? 'black' : 'white';
	const evilFilterCaption = evil ? 'white' : 'black';
	const fontSize = imageWidth / 10;
	// const fontSize2 = fontSize * 0.69;
	const isGeorgianText = /[\u10A0-\u10FF]/.test(caption);
	const adjustedFontSize = isGeorgianText ? fontSize * 0.7 : fontSize;
	const padding = imageWidth / 25;
	const textWidth = imageWidth - 2 * padding;
	const maxLineLength = Math.floor(textWidth / (fontSize * 0.5));

	const lines = wrapText(caption, maxLineLength);

	const svgHeight = Math.ceil(fontSize * lines.length + (fontSize * 0.4));

	const svgString = `
  <svg width="${imageWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
	<defs>
     <style type="text/css">
                text {
                    font-family: 'Futura-Bold', 'Noto Sans Georgian', 'Roboto Condensed', 'Impact', sans-serif;
										font-weight: 800;
                }
      </style>
  </defs>
    <rect width="${imageWidth}" height="${svgHeight}" fill="${evilFilterBackground}"/>
    ${lines.map((line, index) => {
		const yPosition = fontSize * (index + 1);
		return `
        <text x="${imageWidth / 2}" y="${yPosition}" font-size="${adjustedFontSize}" text-anchor="middle" fill="${evilFilterCaption}" dominant-baseline="middle">
          ${line}
        </text>
      `;
	}).join('')}
  </svg>
`;

	return { svgString, svgHeight };
}

function wrapText(text, maxLineLength) {
	const words = text.split(' ');
	const lines = [];
	let currentLine = '';

	words.forEach(word => {
		if ((currentLine + word).length <= maxLineLength) {
			currentLine += (currentLine ? ' ' : '') + word;
		}
		else {
			lines.push(currentLine);
			currentLine = word;
		}
	});

	if (currentLine) {
		lines.push(currentLine);
	}

	return lines;
}


module.exports = {
	createTextSvgWithFont,
};
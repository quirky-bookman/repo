const input = document.querySelector('#colorInput');
const colorName = document.querySelector('#colorName');
const colorBlock = document.querySelector('#colorBlock');
const colorLightness = document.querySelector('#lightness');
const colorAlternativeName = document.querySelector('#alternativeName');

input.oninput = function () {
	if (isColor(input.value) && input.value.length > 5) {
		colorName.textContent = ntc.name(input.value)[3];
		colorLightness.textContent = specificLight(hexToRgb(input.value).replace(/[()rgb]/g, '').split(',')).toFixed(2) * 1000;
		colorAlternativeName.textContent = ntc.name(input.value)[1];
		colorBlock.style.backgroundColor = input.value;
	}
};


function specificLight(rgb) {
	const [r, g, b] = rgb;
	return 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}


function isColor(strColor) {
	const s = new Option().style;
	s.color = strColor;
	return s.color !== '';
}

function hexToRgb(h) {
	var r = parseInt(cutHex(h).substring(0, 2), 16),
		g = parseInt(cutHex(h).substring(2, 4), 16),
		b = parseInt(cutHex(h).substring(4, 6), 16);
	return "rgb(" + r + "," + g + "," + b + ")";
}

function cutHex(h) {
	return h.charAt(0) == "#" ? h.substring(1, 7) : h;
}


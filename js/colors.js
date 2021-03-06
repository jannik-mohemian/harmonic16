function updateLabel(name) {
	setSlider(name, $("#" + name + "_label").val());
	refresh();
}

function updateLabels() {
	var sliders = new Array("hue", "fun", "sat", "val", "ind");
	for (var i = 0; i < sliders.length; i++) {
		//update labels from sliders
		setLabel(sliders[i], getSlider(sliders[i]));
	}
}

function refresh() {
	//generate and output
	output(generate());
	preview(generate());
}

function output(holder) {
	for (var i = 0; i < holder[0].length; i++) {
		$("#"+holder[1][i]).css("background-color", holder[0][i]);
	}
}

function generateColors(offset, baseColor) {
	//save base hue
	var baseHue = baseColor.hue();

	//array to save colors
	var colors = new Array();

	//generate colors
	for (var i = 0; i < offset.length; i++) {
		//adjust hue
		var newHue = baseHue;
		newHue += offset[i];
		//keep hue under 360 (optional)
		if (newHue > 360)
			newHue -= 360;
		//add to array
		colors.push(baseColor.hue(newHue).hex6());
	}

	//return array
	return colors;
}

function generateBases(baseHue) {
	//get vars
	var fun = 0.5 + (getSlider("fun") * 2) / 100;
	
	if ($("#indv").prop("checked"))
		var relSat = (getSlider("ind")) / 100;
	else
		var relSat = (getSlider("sat")) / 100;
	
	//fixed count
	var count = 10;
	//step from count
	var step = 1 / count;

	//array to save bases
	var bases = new Array();

	for (var i = 1, j = 0; i < count && j < 8; i++) {
		//bigger step in middle (leave out 5)
		if (i != 5) {
			//calculate saturation
			var sat = Math.pow(i * step, fun) * 100;
			
			var hue = baseHue;
			if (i < 5 && $("#switch").prop("checked")) {
				hue += 180;
			}

			//keep hue under 360 (optional)
			if (hue > 360)
				hue -= 360;

			var toneColor = pusher.color('hsv', hue, sat * relSat, 100 - sat);
			bases.push(toneColor.hex6());
			j++;
		}
	}

	//return array
	return bases.reverse();
}

function getSlider(name) {
	return $("#" + name).slider("option", "value").toString();
}

function setSlider(name, val) {
	$("#" + name).slider("value", val);
}

function setLabel(name, val) {
	$("#" + name + "_label").val(val);
}

function hideIndividual(name) {
	if ($("#indv").prop("checked")) {
		$("#" + name).css("visibility", "visible");
		$("#" + name + "_label").css("visibility", "visible");
	} else {
		$("#" + name).css("visibility", "hidden");
		$("#" + name + "_label").css("visibility", "hidden");
	}
	refresh();
}

function generate() {
	//update
	updateLabels();

	//get vars
	var hue = getSlider("hue");
	var sat = getSlider("sat");
	var val = getSlider("val");
	//create base color
	var base = pusher.color('hsv', hue, sat, val);

	//offsets
	var symmetrical = new Array(0, 30, 60, 120, 180, 240, 300, 330);
	//var reversed =    new Array(0, 30, 60, 120, 180, 210, 240, 300);	//alternative

	//GENERATE COLORS
	var colors = generateColors(symmetrical, base);
	//var colors = generateColors(reversed, base);						//alternative

	//GENERATE BASES
	var bases;
	if ($("#comp").prop("checked"))
		bases = generateBases(base.complement().hue());		//if checked, use complement
	else
		bases = generateBases(base.hue());

	//COMBINE
	var allColors = bases.concat(colors);		//combine bases with colors

	//LABELS
	var descriptors = new Array("base00", "base01", "base02", "base03", "base04", "base05", "base06", "base07", "base08", "base09", "base0A", "base0B", "base0C", "base0D", "base0E", "base0F");
	
	//return both colors and their descriptors in one array
	return new Array(allColors, descriptors);
}

//Builder
function makeText(holder) {
	var string = "# generated with harmonic16 (https://github.com/janniks/harmonic16)\n";
	string += 'scheme: "harmonic16"\n';
	string += 'author: "Jannik Siebert (https://github.com/janniks)"\n';

	for (var i = 0; i < holder[0].length; i++) {
		string += holder[1][i] + ': "' + holder[0][i].replace(/#/, '') + '"\n';
	}
	return string;
}

function makeFile() {
	var text = makeText(generate());

	var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "base16.yml");
}

//Sass
function makeSass() {
	//text
	var text = "// generated with harmonic16 (github.com/janniks/harmonic16)\n";
	text += '// usage: @import \'colors\';\n';

	//generate
	var holder = generate();
	for (var i = 0; i < holder[0].length; i++) {
		text += '$' + holder[1][i] + ': ' + holder[0][i] + ';\n';
	}

	//file
	var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "_colors.scss");
}

//Preview colors
function preview(holder) {
	// preview1
	$("div.preview.preview1").css("background-color", holder[0][7]);
	$("div.preview.preview1").css("border-color", holder[0][5]);
	$("div.preview-pop.preview1").css("background-color", holder[0][6]);
	$("div.preview-pop.preview1").css("border-color", holder[0][4]);
	$("div.preview-header.preview1").css("border-color", holder[0][4]);
	$("div.preview-header.preview1").css("color", holder[0][3]);
	$("div.preview-content.preview1").css("border-color", holder[0][4]);
	$("div.preview-content.preview1").css("background-color", holder[0][7]);
	$("div.preview-content.preview1").css("color", holder[0][2]);
	$("button.preview-accept.preview1").css("border-color", holder[0][4]);
	$("button.preview-accept.preview1").css("color", holder[0][3]);
	$("button.preview-deny.preview1").css("border-color", holder[0][4]);
	$("button.preview-deny.preview1").css("background-color", holder[0][4]);
	$("button.preview-deny.preview1").css("color", holder[0][2]);

	// preview2
	$("div.preview.preview2").css("background-color", holder[0][4]);
	$("div.preview.preview2").css("border-color", holder[0][3]);
	$("div.preview-pop.preview2").css("background-color", holder[0][5]);
	$("div.preview-pop.preview2").css("border-color", holder[0][3]);
	$("div.preview-header.preview2").css("border-color", holder[0][3]);
	$("div.preview-header.preview2").css("color", holder[0][3]);
	$("div.preview-content.preview2").css("border-color", holder[0][4]);
	$("div.preview-content.preview2").css("background-color", holder[0][7]);
	$("div.preview-content.preview2").css("color", holder[0][2]);
	$("button.preview-accept.preview2").css("border-color", holder[0][4]);
	$("button.preview-accept.preview2").css("color", holder[0][3]);
	$("button.preview-deny.preview2").css("border-color", holder[0][4]);
	$("button.preview-deny.preview2").css("background-color", holder[0][4]);
	$("button.preview-deny.preview2").css("color", holder[0][2]);
}

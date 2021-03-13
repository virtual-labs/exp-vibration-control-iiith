document.addEventListener('DOMContentLoaded', function(){

	var play = true

	var playButton = document.getElementById('play');
	var pauseButton = document.getElementById('pause');
	var restartButton = document.getElementById('restart');
	var submitButton = document.getElementById('submit');

	pauseButton.addEventListener('click', function() { window.clearTimeout(tmHandle) });
	playButton.addEventListener('click', function() {  window.clearTimeout(tmHandle); tmHandle = setTimeout(draw, 1000 / fps); });
	restartButton.addEventListener('click', function() {restart()})

	function restart() 
	{ 
		window.clearTimeout(tmHandle) 

		bldg = [
			[[upL[0], defY], [upR[0], defY], [startR[0], defY + height], [startL[0], defY + height]],
			[[upL[1], defY], [upR[1], defY], [startR[1], defY + height], [startL[1], defY + height], [pivot, defY - 135], [pivot, defY - 50], [pivot, defY - 40]]
		]

		ground = [
			[startL[0] - 50, defY + height + 45],
			[startL[0] - 50, defY + height],
			[startR[1] + 50, defY + height],
			[startR[1] + 50, defY + height + 45],
		]

		dirn = -1;
		tmHandle = window.setTimeout(draw, 1000 / fps); 
	}

	var slider_wid = document.getElementById("lineWidth");
	var output_wid = document.getElementById("demo_width");
	output_wid.innerHTML = slider_wid.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	slider_wid.oninput = function() {
		output_wid.innerHTML = this.value;
	}

	var slider_mot = document.getElementById("motion");
	var output_mot = document.getElementById("demo_motion");
	output_mot.innerHTML = slider_mot.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	slider_mot.oninput = function() {
		output_mot.innerHTML = this.value;
	}

	submitButton.addEventListener('click', function() {
		lineWidth = Number(document.getElementById("lineWidth").value)
		vibe = Number(document.getElementById("motion").value)
		stiff = 25 / 7 * lineWidth
		scale = 12.5 / 7 * lineWidth

		restart()
	});

	let height = 375
	let vibe = 50

	const canvas = document.getElementById("main");
	canvas.width = 1200;
	canvas.height = 600;
	canvas.style = "border:3px solid"
	const ctx = canvas.getContext("2d");

	fill = "#D3D3D3"
	border = "black"
	lineWidth = 7

	const fps = 15
	let dirn = -1
	let scale = 12.5
	let stiff = 25


	let defY = 150
	let startL = [300, 725]
	let startR = [475, 900]

	let upL = {...startL}
	let upR = {...startR}
	let pivot = (startR[1] - startL[1])/2 + startL[1]
	let bldg = [
		[[upL[0], defY], [upR[0], defY], [startR[0], defY + height], [startL[0], defY + height]],
		[[upL[1], defY], [upR[1], defY], [startR[1], defY + height], [startL[1], defY + height], [pivot, defY - 135], [pivot, defY - 50], [pivot, defY - 40]]
	]


	let ground = [
		[startL[0] - 250, defY + height + 45],
		[startL[0] - 250, defY + height],
		[startR[1] + 250, defY + height],
		[startR[1] + 250, defY + height + 45]
	]

	function drawGround(ctx, ground)
	{
		ctx.save()
		ctx.fillStyle = "pink";
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(ground[0][0], ground[0][1]);

		for(let i = 0; i < ground.length; ++i)
		{
			let next = (i + 1) % ground.length
			ctx.lineTo(ground[next][0], ground[next][1])
		}

		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore()
	}

	function updateGround(ground, chg)
	{
		for(let i = 0; i < ground.length; ++i)
			ground[i][0] += chg
	}

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = fill;
		ctx.lineWidth = lineWidth;
		// ctx.lineCap = "round";
		// ctx.lineJoin = "round";

			// if(dirn == -1)
			// 	updateGround(ground, vibe / scale)
			// else
			// 	updateGround(ground, -1 * vibe / scale)

		drawGround(ctx, ground)

		for(let k = 0; k < 2; ++k) // number of building
		{
			let v = bldg[k]

			if(dirn == -1)
			{
				if(k==0)
				{
					v[0][0] -= vibe / scale
					v[1][0] -= vibe / scale
				}
				// v[2][0] += vibe / scale
				// v[3][0] += vibe / scale
				if(k == 1)
				{
					v[0][0] -= vibe / stiff
					v[1][0] -= vibe / stiff
					v[4][0] -= vibe / stiff
					v[5][0] -= vibe / stiff - (0.35 * vibe / stiff)
					v[6][0] -= vibe / stiff - (0.35 * vibe / stiff)
				}

			}

			else
			{
				if(k==0)
				{
					v[0][0] += vibe / scale
					v[1][0] += vibe / scale
				}
				// v[2][0] -= vibe / scale
				// v[3][0] -= vibe / scale
				if(k == 1)
				{
					v[0][0] += vibe / stiff
					v[1][0] += vibe / stiff
					v[4][0] += vibe / stiff
					v[5][0] += vibe / stiff - (0.35 * vibe / stiff)
					v[6][0] += vibe / stiff - (0.35 * vibe / stiff)
				}

			}

			if(k == 1 && (v[0][0] <= upL[k] - vibe || v[1][0] >= upR[k] + vibe))
				dirn *= -1

			ctx.beginPath();
			ctx.moveTo(v[1][0], v[1][1]);
			ctx.lineTo(v[2][0], v[2][1]);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(v[3][0], v[3][1]);
			ctx.lineTo(v[0][0], v[0][1])
			ctx.closePath();
			ctx.stroke();

			ctx.save()
			ctx.lineWidth = 20;
			ctx.lineCap = "square";
			ctx.beginPath();
			ctx.moveTo(v[0][0], v[0][1]);
			ctx.lineTo(v[1][0], v[1][1])
			ctx.closePath();
			ctx.stroke();
			ctx.restore();

			if(k == 1)
			{
				ctx.save()
				ctx.beginPath();
				ctx.lineWidth = 10;
				// ctx.lineCap = "round";
				ctx.lineJoin = "round";
				ctx.moveTo(v[1][0], v[1][1]);
				ctx.lineTo(v[4][0], v[4][1]);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(v[4][0], v[4][1]);
				ctx.lineTo(v[0][0], v[0][1]);
				ctx.closePath();
				ctx.stroke();
				ctx.restore();

				ctx.save()
				ctx.lineWidth = 3;
				ctx.lineJoin = "round";
				ctx.beginPath();
				ctx.moveTo(v[4][0], v[4][1]);
				ctx.lineTo(v[5][0], v[5][1]);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(v[6][0], v[6][1], 10, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.stroke();
				ctx.restore();


			}

			bldg[k] = v
		}

		tmHandle = window.setTimeout(draw, 1000 / fps);
	}

	var tmHandle = window.setTimeout(draw, 1000 / fps);
})
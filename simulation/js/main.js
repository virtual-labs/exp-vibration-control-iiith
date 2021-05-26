'use strict';

document.addEventListener('DOMContentLoaded', function () {

	const playButton = document.getElementById('play');
	const pauseButton = document.getElementById('pause');
	const restartButton = document.getElementById('restart');

	pauseButton.addEventListener('click', function() { window.clearTimeout(tmHandle); });
	playButton.addEventListener('click', function() {  window.clearTimeout(tmHandle); tmHandle = setTimeout(draw, 1000 / fps); });
	restartButton.addEventListener('click', function() {restart();});

	function restart() 
	{ 
		window.clearTimeout(tmHandle); 

		bldg = [
			[[startL[0], defY], [startR[0], defY], [startR[0], defY + height], [startL[0], defY + height]],
			[[startL[1], defY], [startR[1], defY], [startR[1], defY + height], [startL[1], defY + height], [pivot, defY - 135], [pivot, defY - 50], [pivot, defY - 40]]
		];

		ground = [
			[startL[0] - 50, defY + height + 45],
			[startL[0] - 50, defY + height],
			[startR[1] + 50, defY + height],
			[startR[1] + 50, defY + height + 45],
		];

		dirn[0] = 0;
		dirn[1] = 0;
		scale[0] = 4 + 0.25 * (Number(document.getElementById("lineWidth").value) - 7);
		scale[1] = 4 + 0.25 * (Number(document.getElementById("lineWidth").value) - 7);
		tmHandle = window.setTimeout(draw, 1000 / fps); 
	}

	const slider_wid = document.getElementById("lineWidth");
	const output_wid = document.getElementById("demo_width");
	output_wid.innerHTML = slider_wid.value; // Display the default slider value

	slider_wid.oninput = function() {
		output_wid.innerHTML = this.value;
		lineWidth = Number(document.getElementById("lineWidth").value);
		damp = 0.3 * Number(document.getElementById("lineWidth").value);
		scale[0] = 4 + 0.25 * (Number(document.getElementById("lineWidth").value) - 7);
		scale[1] = 4 + 0.25 * (Number(document.getElementById("lineWidth").value) - 7);
		fps = 5 + Number(document.getElementById("lineWidth").value); 
		restart();
	};

	const slider_mot = document.getElementById("motion");
	const output_mot = document.getElementById("demo_motion");
	output_mot.innerHTML = slider_mot.value; // Display the default slider value

	slider_mot.oninput = function() {
		output_mot.innerHTML = this.value;
		vibe = Number(document.getElementById("motion").value);
		restart();
	};

	let height = 375;
	let vibe = 40;

	const canvas = document.getElementById("main");
	canvas.width = 1200;
	canvas.height = 600;
	canvas.style = "border:3px solid";
	const ctx = canvas.getContext("2d");

	const fill = "#D3D3D3";
	const border = "black";
	let lineWidth = 7;	
	let triWidth = 0;	
	let fps = 12;
	let dirn = [0, 0];
	let scale = [4, 4];
	let damp = 2.1;

	const defY = 150;
	const startL = [300, 725];
	const startR = [475, 900];

	const pivot = (startR[1] - startL[1]) / 2 + startL[1];
	let bldg = [
		[[startL[0], defY], [startR[0], defY], [startR[0], defY + height], [startL[0], defY + height]],
		[[startL[1], defY], [startR[1], defY], [startR[1], defY + height], [startL[1], defY + height], [pivot, defY - 135], [pivot, defY - 50], [pivot, defY - 40]]
	];


	let ground = [
		[startL[0] - 50, defY + height + 45],
		[startL[0] - 50, defY + height],
		[startR[1] + 50, defY + height],
		[startR[1] + 50, defY + height + 45],
	];

	function drawGround(ctx, ground) //for drawing the ground
	{
		ctx.save();
		ctx.fillStyle = "pink";
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(ground[0][0], ground[0][1]);

		for(let i = 0; i < ground.length; ++i)
		{
			const next = (i + 1) % ground.length;
			ctx.lineTo(ground[next][0], ground[next][1]);
		}

		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	function draw()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = fill;
		ctx.lineWidth = lineWidth;

		drawGround(ctx, ground);

		for(let k = 0; k < 2; ++k) // number of building
		{
			let v = bldg[k];
			const end = vibe / 3;
			if(scale[k] < end)
			{
				if(dirn[k] < 5 || dirn[k] > 14)
				{
					if(k === 0)
					{
						v[0][0] -= vibe / scale[k];
						v[1][0] -= vibe / scale[k];
					}

					if(k === 1)
					{
						v[0][0] -= 0.5 * vibe / scale[k];
						v[1][0] -= 0.5 * vibe / scale[k];
						v[4][0] -= 0.5 * vibe / scale[k];
						v[5][0] -= 0.5 * (vibe / scale[k] - (0.45 * vibe / scale[k]));
						v[6][0] -= 0.5 * (vibe / scale[k] - (0.45 * vibe / scale[k]));
					}

				}
				else if(dirn[k] >= 5 && dirn[k] <= 14)
				{
					if(k === 0)
					{
						v[0][0] += vibe / scale[k];
						v[1][0] += vibe / scale[k];
					}
					if(k === 1)
					{
						v[0][0] += 0.5 * vibe / scale[k];
						v[1][0] += 0.5 * vibe / scale[k];
						v[4][0] += 0.5 * vibe / scale[k];
						v[5][0] += 0.5 * (vibe / scale[k] - (0.45 * vibe / scale[k]));
						v[6][0] += 0.5 * (vibe / scale[k] - (0.45 * vibe / scale[k]));
					}

				}
				if(dirn[k] === 19)
				{
					scale[k] = scale[k] + 0.6 * damp;
					if(k === 1)
					{
						scale[1] = scale[1] + 1.2 * damp;
					}
				}
				dirn[k] = (dirn[k] + 1) % 20;
			}

			ctx.beginPath();
			ctx.moveTo(v[1][0], v[1][1]);
			ctx.lineTo(v[2][0], v[2][1]);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(v[3][0], v[3][1]);
			ctx.lineTo(v[0][0], v[0][1]);
			ctx.closePath();
			ctx.stroke();

			ctx.save();
			ctx.lineWidth = 20;
			ctx.lineCap = "square";
			ctx.beginPath();
			ctx.moveTo(v[0][0], v[0][1] + 10);
			ctx.lineTo(v[1][0], v[1][1] + 10);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();

			if(k === 1) // the TMD for the second building
			{
				triWidth = 2 + (4 / 7 * (7 - lineWidth));
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth = 10;
				ctx.lineJoin = "round";
				ctx.moveTo(v[1][0] - triWidth, v[1][1]);
				ctx.lineTo(v[4][0], v[4][1]);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(v[0][0] + triWidth, v[0][1]);
				ctx.lineTo(v[4][0], v[4][1]);
				ctx.closePath();
				ctx.stroke();
				ctx.restore();

				ctx.save(); // pendulum
				ctx.lineWidth = 3;
				ctx.lineJoin = "round";
				ctx.beginPath();
				ctx.moveTo(v[4][0], v[4][1]);
				ctx.lineTo(v[5][0], v[5][1]);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath(); // bob
				ctx.arc(v[6][0], v[6][1], 10, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.stroke();
				ctx.restore();


			}

			bldg[k] = v;
		}

		tmHandle = window.setTimeout(draw, 1000 / fps);
	}

	let tmHandle = window.setTimeout(draw, 1000 / fps);
});

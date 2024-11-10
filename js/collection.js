const xValues = [
	"Jan 2024",
	"Feb 2024",
	"Mar 2024",
	"Apr 2024",
	"May 2024",
	"Jun 2024",
	"Jul 2024",
	"Aug 2024",
	"Sep 2024",
	"Oct 2024",
	"Nov 2024",
	"Dec 2024",
];

const yValues = [120, 130, 125, 140, 135, 132, 145, 142, 150, 155, 149, 160]; // Example dollar amounts

new Chart("priceGraph", {
	type: "line",
	data: {
		labels: xValues,
		datasets: [
			{
				fill: false,
				lineTension: 0,
				backgroundColor: "rgba(255, 255, 255, 0.1)",  // white with slight opacity
				borderColor: "rgba(255, 255, 255, 1)",  // white line color
				data: yValues,
			},
		],
	},
	options: {
		legend: { 
			display: false, 
			labels: {
				color: 'white', // makes legend text white
			}
		},
		scales: {
			y: {
				ticks: {
					color: "white", // makes y-axis labels white
					callback: function (value) {
						return "$" + value;
					},
					suggestedMin: 100,
					suggestedMax: 180,
				},
			},
			x: {
				ticks: {
					color: "white", // makes x-axis labels white
				},
			},
		},
		plugins: {
			tooltip: {
				enabled: true,
				backgroundColor: "rgba(0, 0, 0, 0.7)", // makes tooltip background darker
				bodyColor: "white", // makes tooltip text white
				titleColor: "white", // makes tooltip title text white
			},
			legend: {
				display: false,
				labels: {
					color: 'white', // makes the legend text white
				}
			},
		},
		elements: {
			line: {
				tension: 0.1,
			},
			point: {
				backgroundColor: 'white', // makes points white
			},
		},
	},
});

let items = document.querySelectorAll(".slider .item");
let active = 3;

function loadShow() {
	items[active].style.transform = `none`;
	items[active].style.zIndex = 1;
	items[active].style.filter = "none";
	items[active].style.opacity = 1;

	let stt = 0;
	for (let i = active + 1; i < items.length; i++) {
		stt++;
		items[i].style.transform = `translateX(${120 * stt}px) scale(${
			1 - 0.2 * stt
		}) perspective(16px) rotateY(-1deg)`;
		items[i].style.zIndex = -stt;
		items[i].style.filter = "blur(5px)";
		items[i].style.opacity = stt > 2 ? 0 : 0.6;
	}

	stt = 0;
	for (let i = active - 1; i >= 0; i--) {
		stt++;
		items[i].style.transform = `translateX(${-120 * stt}px) scale(${
			1 - 0.2 * stt
		}) perspective(16px) rotateY(1deg)`;
		items[i].style.zIndex = -stt;
		items[i].style.filter = "blur(5px)";
		items[i].style.opacity = stt > 2 ? 0 : 0.6;
	}
}

loadShow();

let next = document.getElementById("next");
let prev = document.getElementById("prev");

next.onclick = function () {
	active = (active + 1) % items.length;
	loadShow();
};

prev.onclick = function () {
	active = (active - 1 + items.length) % items.length;
	loadShow();
};

document.querySelectorAll(".item.sparkley").forEach((item) => {
	$(item).sparkleh();
});

$.fn.sparkleh = function (options) {
	return this.each(function (k, v) {
		var $this = $(v).css("position", "relative");

		var settings = $.extend(
			{
				width: $this.outerWidth(),
				height: $this.outerHeight(),
				color: "#FFFFFF",
				count: 30,
				overlap: 0,
				speed: 1,
			},
			options
		);

		var sparkle = new Sparkle($this, settings);
		sparkle.update();
	});
};

function Sparkle($parent, options) {
	this.options = options;
	this.init($parent);
}

Sparkle.prototype = {
	init: function ($parent) {
		var _this = this;

		this.$canvas = $("<canvas>")
			.addClass("sparkle-canvas")
			.css({
				position: "absolute",
				top: "-" + _this.options.overlap + "px",
				left: "-" + _this.options.overlap + "px",
				"pointer-events": "none",
			})
			.appendTo($parent);

		this.canvas = this.$canvas[0];
		this.context = this.canvas.getContext("2d");

		this.sprite = new Image();
		this.sprites = [0, 6, 13, 20];
		this.sprite.src = this.datauri;

		this.canvas.width = this.options.width + this.options.overlap * 2;
		this.canvas.height = this.options.height + this.options.overlap * 2;

		this.particles = this.createSparkles(
			this.canvas.width,
			this.canvas.height
		);

		this.anim = null;
		this.fade = false;
	},

	createSparkles: function (w, h) {
		var holder = [];

		for (var i = 0; i < this.options.count; i++) {
			var color = this.options.color;

			if (this.options.color == "rainbow") {
				color =
					"#" +
					(
						"000000" +
						Math.floor(Math.random() * 16777215).toString(16)
					).slice(-6);
			} else if ($.type(this.options.color) === "array") {
				color =
					this.options.color[
						Math.floor(Math.random() * this.options.color.length)
					];
			}

			holder[i] = {
				position: {
					x: Math.floor(Math.random() * w),
					y: Math.floor(Math.random() * h),
				},
				style: this.sprites[Math.floor(Math.random() * 4)],
				delta: {
					x: Math.floor(Math.random() * 1000) - 500,
					y: Math.floor(Math.random() * 1000) - 500,
				},
				size: parseFloat((Math.random() * 2).toFixed(2)),
				color: color,
			};
		}

		return holder;
	},

	draw: function (time, fade) {
		var ctx = this.context;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (var i = 0; i < this.options.count; i++) {
			var derpicle = this.particles[i];
			var modulus = Math.floor(Math.random() * 7);

			if (Math.floor(time) % modulus === 0) {
				derpicle.style = this.sprites[Math.floor(Math.random() * 4)];
			}

			ctx.save();
			ctx.globalAlpha = derpicle.opacity;
			ctx.drawImage(
				this.sprite,
				derpicle.style,
				0,
				7,
				7,
				derpicle.position.x,
				derpicle.position.y,
				7,
				7
			);

			if (this.options.color) {
				ctx.globalCompositeOperation = "source-atop";
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = derpicle.color;
				ctx.fillRect(derpicle.position.x, derpicle.position.y, 7, 7);
			}

			ctx.restore();
		}
	},

	update: function () {
		var _this = this;

		this.anim = window.requestAnimationFrame(function (time) {
			for (var i = 0; i < _this.options.count; i++) {
				var u = _this.particles[i];

				var randX = Math.random() > Math.random() * 2;
				var randY = Math.random() > Math.random() * 3;

				if (randX) {
					u.position.x += u.delta.x * 0.5;
				} else {
					u.position.x -= u.delta.x * 0.5;
				}

				if (randY) {
					u.position.y += u.delta.y * 0.5;
				} else {
					u.position.y -= u.delta.y * 0.5;
				}
			}

			_this.draw(time);
		});
	},
};

document.addEventListener('DOMContentLoaded', function () {
  const imageFiles = [
    'Aquavex.png', 'Brambrine.png', 'Fluffernox.png', 'Flufflare.png',
    'Glacirune.png', 'Luxavine.png', 'Mimist.png', 'Pyrodra.png', 'Scorchfang.png',
    'Searvile.png', 'Solraya.png', 'Terrashade.png', 'Thornox.png', 'Velocirune.png',
    'Venoclaw.png'
  ];

  const prices = [
    45, 30, 55, 60, 50, 75, 40, 65, 85, 95, 70, 80, 100, 60, 90
  ];

  const container = document.querySelector('.card-container');

  imageFiles.forEach((image, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    
    const img = document.createElement('img');
    img.classList.add('card-img');
    img.src = `images/${image}`;
    
    const title = document.createElement('div');
    title.classList.add('card-title');
    title.textContent = image.split('.')[0]; 
    
    const value = document.createElement('div');
    value.classList.add('card-value');
    value.textContent = `Price: $${prices[index]}`; 
    
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(value);
    container.appendChild(card);
  });
});


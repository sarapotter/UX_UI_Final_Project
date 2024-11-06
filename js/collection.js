let items = document.querySelectorAll(".slider .item");
let active = 3;

function loadShow() {
	items[active].style.transform = `none`;
	items[active].style.zIndex = 1;
	items[active].style.filter = "none";
	items[active].style.opacity = 1;

	// Show items after the active one
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

	// Show items before the active one
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

// Add sparkle effect when the item has the class .sparkley
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
					u.position.x += (u.delta.x * _this.options.speed) / 1500;
				}

				if (!randY) {
					u.position.y -= (u.delta.y * _this.options.speed) / 800;
				}

				if (u.position.x > _this.canvas.width) {
					u.position.x = -7;
				} else if (u.position.x < -7) {
					u.position.x = _this.canvas.width;
				}
			}

			_this.draw(time);
			_this.update();
		});
	},
};


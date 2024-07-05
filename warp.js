const defaultOptions = {
	Modifiers: {
		Shift: false,
		Control: true,
		Alt: true,
		Meta: false
	},
	SeekForward: ["ArrowRight"],
	SeekBackward: ["ArrowLeft"],
	SpeedUp: ["ArrowUp"],
	SpeedDown: ["ArrowDown"],
	ResetSpeed: ["ArrowUp", "ArrowDown"],
	ToastPadding: "10px",
	ToastTextPadding: "5px",
	ToastTextColor: "#ffffff",
	ToastBackgroundColor: "rgba(0, 0, 0, 0.7)",
	ToastBorderRadius: "5px",
	ToastFontSize: "16px",
	ToastDuration: 2000,
	SeekForwardStep: 5,
	SeekBackwardStep: 5,
	SpeedUpStep: 0.1,
	SpeedDownStep: 0.1,
	DoubleClickDelay: 100,
	blacklist: [],
	youtubeAdBypass: true
};

const keyState = new Map();
browser.storage.local.get("WarpOptions").then((result) => {
	if (!result.hasOwnProperty("WarpOptions")) {
		browser.storage.local.set({ WarpOptions: defaultOptions });
		result = { WarpOptions: defaultOptions };
	}
	const config = result["WarpOptions"];
console.log(config);
	let shouldRun = true;
	for (const regex of config["blacklist"]) {
		if (new RegExp(regex).test(window.location.href)) {
			shouldRun = false;
			console.warn("Warp is disabled on this page");
			break;
		}
	}
	
	if (shouldRun) init();
	
	function isKeyComboDown(keyCombo) {
		for (const key of keyCombo) {
			if (!keyState.has(key)) {
				return false;
			}
		}
		return true;
	}
	
	function showToast(message) {
		if (document.querySelector(".warp-toast")) {
			document.querySelector(".warp-toast").remove();
		};
		const toast = document.createElement("div");
		toast.classList.add("warp-toast");
		toast.textContent = message;
		toast.style.position = "fixed";
		toast.style.left = config["ToastPadding"];
		toast.style.bottom = config["ToastPadding"];
		toast.style.zIndex = 9999;
		toast.style.color = config["ToastTextColor"];
		toast.style.backgroundColor = config["ToastBackgroundColor"];
		toast.style.padding = config["ToastTextPadding"];
		toast.style.borderRadius = config["ToastBorderRadius"];
		toast.style.fontSize = config["ToastFontSize"];
		toast.style.opacity = 0;
		toast.style.pointerEvents = "none";
		document.body.appendChild(toast);
		const fadeInInterval = setInterval(() => {
			toast.style.opacity = parseFloat(toast.style.opacity) + 0.1;
			if (toast.style.opacity >= 1) {
				clearInterval(fadeInInterval);
			}
		}, 5);
		setTimeout(() => {
			const fadeOutInterval = setInterval(() => {
				toast.style.opacity = parseFloat(toast.style.opacity) - 0.1;
				if (toast.style.opacity <= 0) {
					clearInterval(fadeOutInterval);
				}
			}, 5);
		}, config["ToastDuration"]);
	}
	function init() {
		document.addEventListener("keydown", (e) => {
			const wasPressed = keyState.has(e.key);
			keyState.set(e.key, true);
			const modifierArray = Object.keys(config["Modifiers"]).filter((modifier) => config["Modifiers"][modifier]);
			if (!isKeyComboDown(modifierArray)) return;
			const medias = [...document.querySelectorAll("video, audio")];
			const target = medias.find((media) => media.paused === false);
			if (!target) {
				showToast("No media playing found");
				return;
			}
	
			const seekForwardDown = isKeyComboDown(config["SeekForward"]);
			const seekBackwardDown = isKeyComboDown(config["SeekBackward"]);
			if (wasPressed && !e.repeat && (seekForwardDown || seekBackwardDown)) {
				const skipTime = (seekForwardDown) ? target.duration : 0;
				const skipText = (seekForwardDown) ? "end" : "start";
				if (seekForwardDown && config["youtubeAdBypass"]) {
					const skipButton = document.querySelector(".ytp-preview-ad");
					if (skipButton) {
						while (target.currentTime < target.duration) {
							target.currentTime += 1;
						}
						setTimeout(() => { document.querySelector(".ytp-ad-skip-button-modern.ytp-button")?.click(); }, 500);
						showToast("Skipping ad using bypass");
						return;
					}
				}
				showToast("Skipping to " + skipText);
				target.currentTime = skipTime
				return;
			}
			if (isKeyComboDown(config["ResetSpeed"])) {
				showToast("Reset playback rate");
				target.playbackRate = 1;
				return;
			}
			if (isKeyComboDown(config["SeekForward"])) {
				target.currentTime += config["SeekForwardStep"];
				showToast(`Time: ${target.currentTime.toFixed(0)}s`);
			} else if (isKeyComboDown(config["SeekBackward"])) {
				target.currentTime -= config["SeekBackwardStep"];
				showToast(`Time: ${target.currentTime.toFixed(0)}s`);
			} else if (isKeyComboDown(config["SpeedUp"])) {
				if (target.playbackRate >= 16) {
					showToast("Max playback rate reached");
					return;
				}
				target.playbackRate += config["SpeedUpStep"];
				showToast(`Playback rate: ${target.playbackRate.toFixed(1)}x`);
			} else if (isKeyComboDown(config["SpeedDown"])) {
				target.playbackRate -= config["SpeedDownStep"];
				showToast(`Playback rate: ${target.playbackRate.toFixed(1)}x`);
			}
		});
	
		document.addEventListener("keyup", (e) => {
			const SeekForward = config["SeekForward"];
			const SeekBackward = config["SeekBackward"];
			if (SeekForward.includes(e.key) || SeekBackward.includes(e.key)) {
				setTimeout(() => {
					keyState.delete(e.key);
				}, config["DoubleClickDelay"]);
				return;
			}
			keyState.delete(e.key);
		});
	}
});
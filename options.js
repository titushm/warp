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
	blacklist: []
};

document.addEventListener("DOMContentLoaded", function() {
	loadOptions();
	document.getElementById("save").addEventListener("click", saveOptions);
	const lastPressedKeyInput = document.getElementById('lastPressedKey');
	document.addEventListener('keydown', function(e) {
		lastPressedKeyInput.value = e.key;
	});
});

function loadOptions() {
	browser.storage.local.get("WarpOptions").then((result) => {
		if (!result.hasOwnProperty("WarpOptions")) {
			browser.storage.local.set({ WarpOptions: defaultOptions });
			result = { WarpOptions: defaultOptions };
		}
		const config = result["WarpOptions"];
		// Modifiers
		document.getElementById("shift").checked = config.Modifiers?.Shift || false;
		document.getElementById("control").checked = config.Modifiers?.Control || false;
		document.getElementById("alt").checked = config.Modifiers?.Alt || false;
		document.getElementById("meta").checked = config.Modifiers?.Meta || false;

		// Keybinds
		document.getElementById("seekForward").value = config.SeekForward?.join("+") || "";
		document.getElementById("seekBackward").value = config.SeekBackward?.join("+") || "";
		document.getElementById("speedUp").value = config.SpeedUp?.join("+") || "";
		document.getElementById("speedDown").value = config.SpeedDown?.join("+") || "";
		document.getElementById("resetSpeed").value = config.ResetSpeed?.join("+") || "";

		// Toast settings
		document.getElementById("toastPadding").value = config.ToastPadding || "";
		document.getElementById("toastTextPadding").value = config.ToastTextPadding || "";
		document.getElementById("toastTextColor").value = config.ToastTextColor || "#ffffff";
		document.getElementById("toastBackgroundColor").value = config.ToastBackgroundColor || "rgba(0, 0, 0, 0.7)";
		document.getElementById("toastBorderRadius").value = config.ToastBorderRadius || "";
		document.getElementById("toastFontSize").value = config.ToastFontSize || "";
		document.getElementById("toastDuration").value = config.ToastDuration || 2000;

		// Other settings
		document.getElementById("seekForwardStep").value = config.SeekForwardStep || 5;
		document.getElementById("seekBackwardStep").value = config.SeekBackwardStep || 5;
		document.getElementById("speedUpStep").value = config.SpeedUpStep || 0.1;
		document.getElementById("speedDownStep").value = config.SpeedDownStep || 0.1;
		document.getElementById("doubleClickDelay").value = config.DoubleClickDelay || 100;
		document.getElementById("blacklist").value = config.blacklist?.join("\n") || "";
	});
}

function saveOptions() {
	const blacklist = document.getElementById("blacklist").value;
	const formattedBlacklist = blacklist.split("\n").filter((item) => item.trim() !== "");
	const options = {
		Modifiers: {
			Shift: document.getElementById("shift").checked,
			Control: document.getElementById("control").checked,
			Alt: document.getElementById("alt").checked,
			Meta: document.getElementById("meta").checked
		},
		SeekForward: document.getElementById("seekForward").value?.split("+") || [],
		SeekBackward: document.getElementById("seekBackward").value?.split("+") || [],
		SpeedUp: document.getElementById("speedUp").value?.split("+") || [],
		SpeedDown: document.getElementById("speedDown").value?.split("+") || [],
		ResetSpeed: document.getElementById("resetSpeed").value?.split("+") || [],
		ToastPadding: document.getElementById("toastPadding").value || "10px",
		ToastTextPadding: document.getElementById("toastTextPadding")?.value || "5px",
		ToastTextColor: document.getElementById("toastTextColor").value || "#ffffff",
		ToastBackgroundColor: document.getElementById("toastBackgroundColor").value || "rgba(0, 0, 0, 0.7)",
		ToastBorderRadius: document.getElementById("toastBorderRadius").value|| "5px",
		ToastFontSize: document.getElementById("toastFontSize").value|| "16px",
		ToastDuration: parseInt(document.getElementById("toastDuration").value) || 2000,
		SeekForwardStep: parseFloat(document.getElementById("seekForwardStep").value) || 5,
		SeekBackwardStep: parseFloat(document.getElementById("seekBackwardStep").value) || 5,
		SpeedUpStep: parseFloat(document.getElementById("speedUpStep").value) || 0.1,
		SpeedDownStep: parseFloat(document.getElementById("speedDownStep").value) || 0.1,
		DoubleClickDelay: parseInt(document.getElementById("doubleClickDelay").value) || 100,
		blacklist: formattedBlacklist
	};
	browser.storage.local.set({ WarpOptions: options }).then(() => {
		alert("Options saved!");
	});
}
const vscode = require("vscode");

const hoverDisposable = vscode.languages.registerHoverProvider("*", {
	provideHover(document, position) {
		const hoveredRange = document.getWordRangeAtPosition(position);
		if (!hoveredRange) return;

		const hoveredText = document.getText(hoveredRange);
		if (hoveredText && /[^\x00-\x7F]/.test(hoveredText)) {
			return new vscode.Hover({
				language: "plaintext",
				value: `Click to convert "${hoveredText}" to HTML entity`,
			});
		}
	},
});

module.exports = hoverDisposable;

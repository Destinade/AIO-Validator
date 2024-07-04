const vscode = require("vscode");

function entityChecker(diagnosticCollection, isInProgress) {
	if (isInProgress) {
		vscode.window.showWarningMessage("Entity checking is already in progress.");
		return;
	}

	const htmlEntities = {
		"<": "&lt;",
		">": "&gt;",
		"&": "&amp;",
		'"': "&quot;",
		"'": "&apos;",
		"=": "&equals;",
		"≠": "&ne;",
		"≅": "&cong;",
		"≈": "&asymp;",
		"+": "&plus;",
		"¢": "&cent;",
		"×": "&times;",
		"÷": "&divide;",
		"≤": "&le;",
		"≥": "&ge;",
		"±": "&plusmn;",
		"°": "&deg;",
		Ω: "&ohm;",
		"…": "&hellip;",
		Δ: "&Delta;",
		"∠": "&ang;",
		π: "&pi;",
		"⊥": "&perp;",
		φ: "&phi;",
		"¯": "&macr;",
		θ: "&theta;",
		μ: "&mu;",
		µ: "&micro;",
		"′": "&prime;",
		"″": "&Prime;",
		"∼": "&sim;",
		"√": "&radic;",
		"❘": "&VerticalSeparator;",
		"|": "&verbar;",
		"−": "&minus;",
		"—": "&mdash;",
		"–": "&ndash;",
		"‘": "&lsquo;",
		"’": "&rsquo;",
		"“": "&ldquo;",
		"”": "&rdquo;",
		"■": "&FilledVerySmallSquare;",
		"◼": "&FilledSmallSquare;",
		"→": "&rarr;",
		"←": "&larr;",
		"™": "&trade;",
		"®": "&reg;",
		"©": "&copy;",
		é: "&eacute;",
		è: "&egrave;",
		ê: "&ecirc;",
		É: "&Eacute;",
		á: "&aacute;",
		â: "&acirc;",
		à: "&agrave;",
		À: "&Agrave;",
		ā: "&amacr;",
		û: "&ucirc;",
		ü: "&uuml;",
		ú: "&uacute;",
		ù: "&ugrave;",
		ñ: "&ntilde;",
		ó: "&oacute;",
		î: "&icirc;",
		ï: "&iuml;",
		Í: "&Iacute;",
		í: "&iacute;",
		ç: "&ccedil;",
		"•": "&bull;",
		"€": "&euro;",
		"£": "&pound;",
		"¥": "&yen;",
		"§": "&sect;",
		"«": "&laquo;",
		"»": "&raquo;",
		// Add more entities as needed
	};

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage("No active text editor.");
		return;
	}

	const document = editor.document;
	const selection = editor.selection;
	let textToConvert = selection.isEmpty
		? document.getText()
		: document.getText(selection);
	const nonBasicASCIIChars = textToConvert.match(/[^\x00-\x7F]/g);

	if (!nonBasicASCIIChars) {
		vscode.window.showInformationMessage(
			"No non-basic ASCII characters found."
		);
		return;
	}

	let index = 0;

	function processNextCharacter() {
		if (index >= nonBasicASCIIChars.length) {
			vscode.window.showInformationMessage(
				"All non-basic ASCII characters processed."
			);
			return;
		}

		textToConvert = selection.isEmpty
			? document.getText()
			: document.getText(selection);

		const char = nonBasicASCIIChars[index];
		const entity = htmlEntities[char] || `&#${char.charCodeAt(0)};`;
		const charPosition = document.positionAt(
			textToConvert.indexOf(char, document.offsetAt(editor.selection.start) + 1)
		);
		const charRange = new vscode.Range(
			charPosition,
			charPosition.translate(0, 1)
		);
		editor.selection = new vscode.Selection(
			charPosition,
			charPosition.translate(0, 1)
		);
		editor.revealRange(charRange, vscode.TextEditorRevealType.InCenter);
		index++;

		vscode.window
			.showInformationMessage(
				`Convert "${char}" to "${entity}"?`,
				"Yes",
				"No",
				"Exit"
			)
			.then((choice) => {
				if (choice === "Yes") {
					editor
						.edit((editBuilder) => {
							editBuilder.replace(charRange, entity);
						})
						.then(() => {
							processNextCharacter();
						});
				} else if (choice === "Exit") {
					return;
				} else {
					processNextCharacter();
				}
			});
	}
	processNextCharacter();
}

module.exports = entityChecker;

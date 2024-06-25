const vscode = require("vscode");

function entityChecker(htmlEntities) {
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
			.showInformationMessage(`Convert "${char}" to "${entity}"?`, "Yes", "No")
			.then((choice) => {
				if (choice === "Yes") {
					editor
						.edit((editBuilder) => {
							editBuilder.replace(charRange, entity);
						})
						.then(() => {
							processNextCharacter();
						});
				} else {
					processNextCharacter();
				}
			});
	}

	processNextCharacter();
}

module.exports = entityChecker;

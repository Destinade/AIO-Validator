const vscode = require("vscode");

function activate(context) {
	console.log("Unicode Highlighter is active.");
	let offset = 0;

	const decorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: "rgba(255, 235, 59, 0.8)", // Yellow background for highlighting
	});

	vscode.window.onDidChangeTextEditorSelection((event) => {
		highlightNonBasicASCII(event.textEditor);
	});

	vscode.window.visibleTextEditors.forEach((editor) => {
		highlightNonBasicASCII(editor);
	});

	function highlightNonBasicASCII(editor) {
		const document = editor.document;
		const regex = /[^\x00-\x7F]/g;
		const text = document.getText();
		const matches = [];
		const tagRegex = /<(p|div|span|h1|h2|h3|h4|h5|h6|a)[^>]*>(.*?)<\/\1>/gs;
		let match;

		while ((match = tagRegex.exec(text)) !== null) {
			const [, , tagContent] = match;
			let highlightOffset = match.index + match[0].indexOf(tagContent);
			const contentMatches = tagContent.matchAll(regex);

			for (const contentMatch of contentMatches) {
				const startIndex = contentMatch.index + highlightOffset;
				const endIndex = startIndex + 1;
				const range = new vscode.Range(
					document.positionAt(startIndex),
					document.positionAt(endIndex)
				);
				const decoration = {
					range,
					hoverMessage: "Click to convert to HTML entity",
				};
				matches.push(decoration);
			}
		}

		editor.setDecorations(decorationType, matches);
	}

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

	context.subscriptions.push(hoverDisposable);

	const htmlEntities = {
		"©": "&copy;",
		"®": "&reg;",
		"™": "&trade;",
		"€": "&euro;",
		"£": "&pound;",
		"¥": "&yen;",
		"§": "&sect;",
		"«": "&laquo;",
		"»": "&raquo;",
		"“": "&ldquo;",
		"”": "&rdquo;",
		"’": "&rsquo;",
		"°": "&deg;",
		// Add more entities as needed
	};

	const disposable = vscode.commands.registerCommand(
		"code-validator.checkNelson",
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage("No active text editor.");
				return;
			}

			const document = editor.document;
			const selection = editor.selection;
			const textToConvert = selection.isEmpty
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

				const char = nonBasicASCIIChars[index];
				const entity = htmlEntities[char] || `&#${char.charCodeAt(0)};`;
				const charPosition = document.positionAt(
					textToConvert.indexOf(
						char,
						document.offsetAt(editor.selection.start) + index
					)
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

				vscode.window
					.showInformationMessage(
						`Convert "${char}" to "${entity}"?`,
						"Yes",
						"No"
					)
					.then((choice) => {
						if (choice === "Yes") {
							editor
								.edit((editBuilder) => {
									editBuilder.replace(charRange, entity);
								})
								.then(() => {
									offset += entity.length - 1;
									console.log(offset);
									index++;
									processNextCharacter();
								});
						} else {
							index++;
							processNextCharacter();
						}
					});
			}

			processNextCharacter();
		}
	);

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};

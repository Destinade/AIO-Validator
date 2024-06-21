const vscode = require("vscode");

function activate(context) {
	console.log("Unicode Highlighter is active.");

	// Define a custom decoration type for highlighting non-basic ASCII characters
	const decorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: "rgba(255, 235, 59, 0.3)", // Yellow background for highlighting
	});

	// Subscribe to selection change events
	vscode.window.onDidChangeTextEditorSelection((event) => {
		highlightNonBasicASCII(event.textEditor);
	});

	// Initial highlighting when the extension is activated
	vscode.window.visibleTextEditors.forEach((editor) => {
		highlightNonBasicASCII(editor);
	});

	// Function to highlight non-basic ASCII characters within specific HTML tags
	function highlightNonBasicASCII(editor) {
		const document = editor.document;

		// Define the regex pattern to match non-basic ASCII characters
		const regex = /[^\x00-\x7F]/g;

		// Get the text of the editor
		const text = document.getText();

		// Match non-basic ASCII characters within specific tags like <p>
		const matches = [];
		const tagRegex = /<(p|div|span|h1|h2|h3|h4|h5|h6|a)[^>]*>(.*?)<\/\1>/gs;
		let match;
		while ((match = tagRegex.exec(text)) !== null) {
			const [, , tagContent] = match;
			let offset = match.index + match[0].indexOf(tagContent);
			const contentMatches = tagContent.matchAll(regex);
			for (const contentMatch of contentMatches) {
				const startIndex =
					contentMatch.index !== undefined ? contentMatch.index + offset : -1;
				const endIndex = startIndex !== -1 ? startIndex + 1 : -1;
				if (startIndex !== -1 && endIndex !== -1) {
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
		}

		// Apply the decorations to the editor
		editor.setDecorations(decorationType, matches);
	}

	// Register a command to handle the hover action for each highlighted character
	const hoverDisposable = vscode.languages.registerHoverProvider("*", {
		provideHover(document, position) {
			const hoveredRange = document.getWordRangeAtPosition(position);
			if (!hoveredRange) {
				return undefined;
			}

			const hoveredText = document.getText(hoveredRange);

			// Check if the hovered text is a non-basic ASCII character
			if (hoveredText && /[^\x00-\x7F]/.test(hoveredText)) {
				return new vscode.Hover({
					language: "plaintext",
					value: `Click to convert "${hoveredText}" to HTML entity`,
				});
			}

			return undefined;
		},
	});

	// Add the hoverDisposable to the context subscriptions
	context.subscriptions.push(hoverDisposable);

	// HTML entities mapping
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
		// Add more entities as needed
	};

	// Register a command to convert highlighted non-basic ASCII characters to HTML entities
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

			// Get the selected text or the entire document if nothing is selected
			const textToConvert = selection.isEmpty
				? document.getText()
				: document.getText(selection);

			// Find non-basic ASCII characters within the selected text
			const nonBasicASCIIChars = textToConvert.match(/[^\x00-\x7F]/g);

			if (!nonBasicASCIIChars) {
				vscode.window.showInformationMessage(
					"No non-basic ASCII characters found."
				);
				return;
			}

			// Process each non-basic ASCII character one by one
			let index = 0;
			function processNextCharacter() {
				if (index >= nonBasicASCIIChars.length) {
					// Finished processing all characters
					vscode.window.showInformationMessage(
						"All non-basic ASCII characters processed."
					);
					return;
				}

				const char = nonBasicASCIIChars[index];
				const entity = htmlEntities[char] || `&#${char.charCodeAt(0)};`;

				// Highlight the character in the editor
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
							// Replace the character with the HTML entity
							editor
								.edit((editBuilder) => {
									editBuilder.replace(charRange, entity);
								})
								.then(() => {
									index++;
									processNextCharacter();
								});
						} else {
							// Move to the next character
							index++;
							processNextCharacter();
						}
					});
			}

			// Start processing the characters
			processNextCharacter();
		}
	);

	// Add the disposable to the context subscriptions
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};

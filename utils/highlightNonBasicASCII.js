const vscode = require("vscode");

const decorationType = vscode.window.createTextEditorDecorationType({
	backgroundColor: "rgba(255, 235, 59, 0.8)", // Yellow background for highlighting
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

module.exports = highlightNonBasicASCII;

const vscode = require("vscode");
const scriptChecker = require("./scriptChecker");
const cheerio = require("cheerio");

function headingsChecker(diagnosticCollection) {
	const headingRegex = /<h([1-6])\b[^>]*>(.*?)<\/h\1>/g;
	const document = vscode.window.activeTextEditor.document;
	const text = document.getText();
	let match;
	let previousLevel = 0;
	let diagnostics = [];
	while ((match = headingRegex.exec(text)) !== null) {
		const currentLevel = parseInt(match[1], 10);
		const position = document.positionAt(match.index);
		const range = new vscode.Range(
			position,
			document.positionAt(match.index + match[0].length)
		);
		if (currentLevel - previousLevel > 1) {
			const diagnostic = new vscode.Diagnostic(
				range,
				`Heading level jumped from <h${previousLevel}> to <h${currentLevel}>`,
				vscode.DiagnosticSeverity.Warning
			);
			diagnostics.push(diagnostic);
		}
		previousLevel = currentLevel;
	}

	diagnosticCollection.set(document.uri, diagnostics);

	if (diagnostics.length > 0) {
		vscode.window.showWarningMessage(
			"Heading hierarchy issues found. Please check the problems window: Ctrl + Shift + M to open."
		);
	} else {
		diagnosticCollection.clear();
		vscode.window
			.showInformationMessage(
				"No heading hierarchy issues found. Do you want to check for unused scripts?",
				"Yes",
				"No"
			)
			.then((selection) => {
				if (selection === "Yes") {
					const $ = cheerio.load(text);
					scriptChecker(diagnosticCollection, $);
				}
			});
	}
}

module.exports = headingsChecker;

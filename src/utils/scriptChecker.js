const vscode = require("vscode");

function scriptChecker(diagnosticCollection) {
	const headingRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
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
			"Heading hierarchy issues found. Check the Problems panel for details."
		);
	} else {
		vscode.window.showInformationMessage("No heading hierarchy issues found.");
		diagnosticCollection.clear();
	}
}

module.exports = scriptChecker;

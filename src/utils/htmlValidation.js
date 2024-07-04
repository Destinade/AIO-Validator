const vscode = require("vscode");
const HTMLHint = require("htmlhint").HTMLHint;
const headingsChecker = require("./headingsChecker");

function htmlValidation(diagnosticCollection, isInProgress) {
	if (isInProgress) {
		vscode.window.showWarningMessage("HTML validation is already in progress.");
		return;
	}

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage("No active text editor.");
		return;
	}

	const document = editor.document;
	const text = document.getText();
	const messages = HTMLHint.verify(text);

	if (messages.length === 0) {
		diagnosticCollection.clear();
		vscode.window
			.showInformationMessage(
				"No HTML errors found. Do you want to check for heading hierarchy?",
				"Yes",
				"No"
			)
			.then((selection) => {
				if (selection === "Yes") {
					headingsChecker(diagnosticCollection);
				}
			});
		return;
	}

	const diagnostics = [];

	messages.forEach((message) => {
		const range = new vscode.Range(
			new vscode.Position(message.line - 1, message.col - 1),
			new vscode.Position(message.line - 1, message.col)
		);

		const diagnostic = new vscode.Diagnostic(
			range,
			message.message,
			vscode.DiagnosticSeverity.Warning
		);

		diagnostics.push(diagnostic);
	});

	diagnosticCollection.set(document.uri, diagnostics);

	vscode.window.showWarningMessage(
		`${messages.length} HTML errors found. Please check the problems window: Ctrl + Shift + M to open.`
	);
}

module.exports = htmlValidation;

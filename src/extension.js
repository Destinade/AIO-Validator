const vscode = require("vscode");

const highlightNonBasicASCII = require("./utils/highlightNonBasicASCII");
const entityChecker = require("./utils/entityChecker");
const hoverDisposable = require("./utils/hoverDisposable");
const htmlValidation = require("./utils/htmlValidation");

let diagnosticCollection;

function activate(context) {
	diagnosticCollection = vscode.languages.createDiagnosticCollection("html");

	vscode.window.onDidChangeTextEditorSelection((event) => {
		highlightNonBasicASCII(event.textEditor);
	});

	vscode.window.visibleTextEditors.forEach((editor) => {
		highlightNonBasicASCII(editor);
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
		"-": "&ndash;",
		// Add more entities as needed
	};

	const checkMarkup = vscode.commands.registerCommand("nellie.checkHTML", () =>
		htmlValidation(diagnosticCollection)
	);

	const checkEntities = vscode.commands.registerCommand(
		"nellie.checkEntities",
		() => entityChecker(htmlEntities)
	);

	context.subscriptions.push(checkMarkup);
	context.subscriptions.push(checkEntities);
	context.subscriptions.push(diagnosticCollection);
}

function deactivate() {
	if (diagnosticCollection) {
		diagnosticCollection.dispose();
	}
}

module.exports = {
	activate,
	deactivate,
};

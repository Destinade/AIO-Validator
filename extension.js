const vscode = require("vscode");

const highlightNonBasicASCII = require("./utils/highlightNonBasicASCII");
const entityChecker = require("./utils/entityChecker");
const hoverDisposable = require("./utils/hoverDisposable");

function activate(context) {
	console.log("Unicode Highlighter is active.");

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

	const disposable = vscode.commands.registerCommand(
		"code-validator.checkNelson",
		() => entityChecker(htmlEntities)
	);

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};

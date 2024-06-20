// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const he = require("he");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(
		'Congratulations, your extension "code-validator" is now active!'
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand(
		"code-validator.checkNelson",
		function () {
			// The code you place here will be executed every time your command is executed

			// Display a message box to the user
			vscode.window.showInformationMessage("Hello 2!");
			const { activeTextEditor } = vscode.window;
			if (!activeTextEditor) {
				console.log("Editor could not be found!");
				return;
			}

			let disposable = vscode.commands.registerCommand(
				"extension.htmlEntities",
				function () {
					var editor = vscode.window.activeTextEditor;

					if (!editor) {
						return; // No open text editor
					}

					var selection = editor.selection;
					var text = editor.document.getText(selection);

					editor.edit((builder) => {
						builder.replace(
							selection,
							he.encode(text, { useNamedReferences: true })
						);
					});
				}
			);

			// const whatsup = vscode.extensions.getExtension(
			// 	"christopherstyles.html-entities"
			// );
			// vscode.window.showInformationMessage("Hello:" + whatsup);

			// const lines = activeTextEditor.document.getText().split("\n");
			// for (let i = 0; i < lines.length; i++) {
			// 	const line = lines[i];
			// 	if (lines[i].includes("<p>")) {
			// 		//implement html entity conversion
			// 		if (lines[i]) vscode.window.showInformationMessage(line);
			// 	}
			// 	console.log(i, line);
			// }

			context.subscriptions.push(disposable);
		}
	);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};

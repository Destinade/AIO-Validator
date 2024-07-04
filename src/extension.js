const vscode = require("vscode");

const highlightNonBasicASCII = require("./utils/highlightNonBasicASCII");
const hoverDisposable = require("./utils/hoverDisposable");
const htmlValidation = require("./utils/htmlValidation");
const entityChecker = require("./utils/entityChecker");
const artChecker = require("./utils/artChecker");
const updateWorkspaceSettings = require("./utils/workspaceSettings.js");

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

	let isInProgress = false;

	try {
		updateWorkspaceSettings();
		isInProgress = true;
	} catch (error) {
		vscode.window.showErrorMessage(`Error applying settings: ${error.message}`);
	} finally {
		isInProgress = false;
	}

	//includes 1) validation, 2) heading hierarchy, and 3) scripts.
	const checkMarkup = vscode.commands.registerCommand(
		"nellie.checkHTML",
		() => {
			try {
				htmlValidation(diagnosticCollection, isInProgress);
				isInProgress = true;
			} catch (error) {
				vscode.window.showErrorMessage(
					`Error validating HTML: ${error.message}`
				);
			} finally {
				isInProgress = false;
			}
		}
	);

	const checkEntities = vscode.commands.registerCommand(
		"nellie.checkEntities",
		() => {
			try {
				entityChecker(diagnosticCollection, isInProgress);
				isInProgress = true;
			} catch (error) {
				vscode.window.showErrorMessage(
					`Error checking entities: ${error.message}`
				);
			} finally {
				isInProgress = false;
			}
		}
	);

	const checkArt = vscode.commands.registerCommand("nellie.checkArt", () => {
		try {
			artChecker(diagnosticCollection, isInProgress);
			isInProgress = true;
		} catch (error) {
			vscode.window.showErrorMessage(
				`Error checking art properties: ${error.message}`
			);
		} finally {
			isInProgress = false;
		}
	});

	context.subscriptions.push(checkMarkup);
	context.subscriptions.push(checkEntities);
	context.subscriptions.push(checkArt);
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

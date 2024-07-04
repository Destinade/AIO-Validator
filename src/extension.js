const vscode = require("vscode");

const highlightNonBasicASCII = require("./utils/highlightNonBasicASCII");
const hoverDisposable = require("./utils/hoverDisposable");
const htmlValidation = require("./utils/htmlValidation");
const entityChecker = require("./utils/entityChecker");
const artChecker = require("./utils/artChecker");
const updateWorkspaceSettings = require("./utils/workspaceSettings.js");

let diagnosticCollection;

function activate(context) {
	updateWorkspaceSettings();

	diagnosticCollection = vscode.languages.createDiagnosticCollection("html");

	vscode.window.onDidChangeTextEditorSelection((event) => {
		highlightNonBasicASCII(event.textEditor);
	});

	vscode.window.visibleTextEditors.forEach((editor) => {
		highlightNonBasicASCII(editor);
	});

	context.subscriptions.push(hoverDisposable);

	const htmlEntities = {
		"<": "&lt;",
		">": "&gt;",
		"&": "&amp;",
		'"': "&quot;",
		"'": "&apos;",
		"=": "&equals;",
		"≠": "&ne;",
		"≅": "&cong;",
		"≈": "&asymp;",
		"+": "&plus;",
		"¢": "&cent;",
		"×": "&times;",
		"÷": "&divide;",
		"≤": "&le;",
		"≥": "&ge;",
		"±": "&plusmn;",
		"°": "&deg;",
		Ω: "&ohm;",
		"…": "&hellip;",
		Δ: "&Delta;",
		"∠": "&ang;",
		π: "&pi;",
		"⊥": "&perp;",
		φ: "&phi;",
		"¯": "&macr;",
		θ: "&theta;",
		μ: "&mu;",
		µ: "&micro;",
		"′": "&prime;",
		"″": "&Prime;",
		"∼": "&sim;",
		"√": "&radic;",
		"❘": "&VerticalSeparator;",
		"|": "&verbar;",
		"−": "&minus;",
		"—": "&mdash;",
		"–": "&ndash;",
		"‘": "&lsquo;",
		"’": "&rsquo;",
		"“": "&ldquo;",
		"”": "&rdquo;",
		"■": "&FilledVerySmallSquare;",
		"◼": "&FilledSmallSquare;",
		"→": "&rarr;",
		"←": "&larr;",
		"™": "&trade;",
		"®": "&reg;",
		"©": "&copy;",
		é: "&eacute;",
		è: "&egrave;",
		ê: "&ecirc;",
		É: "&Eacute;",
		á: "&aacute;",
		â: "&acirc;",
		à: "&agrave;",
		À: "&Agrave;",
		ā: "&amacr;",
		û: "&ucirc;",
		ü: "&uuml;",
		ú: "&uacute;",
		ù: "&ugrave;",
		ñ: "&ntilde;",
		ó: "&oacute;",
		î: "&icirc;",
		ï: "&iuml;",
		Í: "&Iacute;",
		í: "&iacute;",
		ç: "&ccedil;",
		"•": "&bull;",
		"€": "&euro;",
		"£": "&pound;",
		"¥": "&yen;",
		"§": "&sect;",
		"«": "&laquo;",
		"»": "&raquo;",
		// Add more entities as needed
	};

	//includes validation, heading hierarchy, and scripts.
	const checkMarkup = vscode.commands.registerCommand("nellie.checkHTML", () =>
		htmlValidation(diagnosticCollection)
	);

	const checkEntities = vscode.commands.registerCommand(
		"nellie.checkEntities",
		() => entityChecker(htmlEntities)
	);

	const checkArt = vscode.commands.registerCommand("nellie.checkArt", () =>
		artChecker()
	);

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

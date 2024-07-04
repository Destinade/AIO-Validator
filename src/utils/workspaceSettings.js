const vscode = require("vscode");

function updateWorkspaceSettings() {
	const workspaceConfig = vscode.workspace.getConfiguration();
	const settings = {
		"editor.defaultFormatter": "vscode.html-language-features",
		"editor.autoIndent": "full",
		"editor.tabSize": 4,
		"editor.insertSpaces": false,
		"editor.wordSeparators": "`~!@#$%^&*()=+[{]}\\|;:'\",.<>/?",
		"editor.renderWhitespace": "all",
		"editor.renderControlCharacters": true,
		"editor.linkedEditing": true,
		"editor.unicodeHighlight.nonBasicASCII": true,
		"editor.unicodeHighlight.includeComments": "inUntrustedWorkspace",
		"editor.wordWrap": "on",
		"editor.wrappingIndent": "indent",
		"editor.formatOnType": true,
		"editor.detectIndentation": false,
		"files.encoding": "utf8",
		"files.eol": "\n",
		"files.autoSave": "onFocusChange",
		"html.format.unformatted": "wbr",
		"html.format.contentUnformatted": "pre, code, textarea",
		"html.format.extraLiners": "",
		"html.format.wrapAttributes": "preserve-aligned",
		"html.format.wrapLineLength": 0,
		"html.format.preserveNewLines": false,
		"html.autoClosingTags": true,
		"html.autoCreateQuotes": true,
		"html.format.maxPreserveNewLines": 0,
		"html.format.endWithNewline": true,
		"css.lint.ieHack": "error",
		"css.lint.importStatement": "warning",
		"css.lint.propertyIgnoredDueToDisplay": "error",
		"css.lint.float": "warning",
		"css.lint.important": "warning",
		"css.format.spaceAroundSelectorSeparator": true,
		"scss.lint.float": "warning",
		"scss.lint.important": "warning",
		"scss.format.spaceAroundSelectorSeparator": true,
	};

	Object.keys(settings).forEach((key) => {
		workspaceConfig.update(
			key,
			settings[key],
			vscode.ConfigurationTarget.Workspace
		);
	});
}

module.exports = updateWorkspaceSettings;

const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function artChecker() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		const rootPath = workspaceFolders[0].uri.fsPath;

		const fileExtensions = [".jpg", ".png", ".mp4"];
		const largeFiles = [];

		fs.readdir(rootPath, (err, files) => {
			if (err) {
				vscode.window.showErrorMessage("Failed to read directory");
				return;
			}

			files.forEach((file) => {
				const ext = path.extname(file).toLowerCase();
				if (fileExtensions.includes(ext)) {
					const filePath = path.join(rootPath, file);
					const stats = fs.statSync(filePath);
					const fileSizeInMB = stats.size / (1024 * 1024);
					if (fileSizeInMB > 20) {
						largeFiles.push(file);
					}
				}
			});

			if (largeFiles.length > 0) {
				largeFiles.forEach((file) => {
					vscode.window.showInformationMessage(
						`File ${file} is larger than 20 MB.`
					);
				});
			} else {
				vscode.window.showInformationMessage(
					"No files larger than 20 MB found."
				);
			}
		});
	} else {
		vscode.window.showErrorMessage("No workspace folder open");
	}
}

module.exports = artChecker;

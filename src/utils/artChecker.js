const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size").default;

function artChecker(diagnosticCollection, isInProgress) {
	if (isInProgress) {
		vscode.window.showWarningMessage("Art checking is already in progress.");
		return;
	}

	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		const rootPath = workspaceFolders[0].uri.fsPath;

		const directoriesToCheck = ["mp4", "img"];
		const fileExtensions = [".jpg", ".png", ".mp4"];
		const largeFiles = [];
		const largeImages = [];

		directoriesToCheck.forEach((dir) => {
			const dirPath = path.join(rootPath, dir);

			if (fs.existsSync(dirPath)) {
				fs.readdir(dirPath, (err, files) => {
					if (err) {
						vscode.window.showErrorMessage(`Failed to read directory: ${dir}`);
						return;
					}

					files.forEach((file) => {
						const ext = path.extname(file).toLowerCase();
						if (fileExtensions.includes(ext)) {
							const filePath = path.join(dirPath, file);
							const stats = fs.statSync(filePath);
							const fileSizeInMB = stats.size / (1024 * 1024);
							if (fileSizeInMB > 20) {
								largeFiles.push({
									file: path.join(dir, file),
									size: fileSizeInMB,
								});
							}

							if (dir === "img" && (ext === ".jpg" || ext === ".png")) {
								const dimensions = sizeOf(filePath);
								if (dimensions.width > 850) {
									largeImages.push({
										file: path.join(dir, file),
										width: dimensions.width,
									});
								}
							}
						}
					});

					if (dir === directoriesToCheck[directoriesToCheck.length - 1]) {
						if (largeFiles.length > 0) {
							largeFiles.forEach((file) => {
								vscode.window.showInformationMessage(
									`File ${file.file} is larger than 20 MB.`
								);
							});
						} else {
							vscode.window.showInformationMessage(
								"No files larger than 20 MB found."
							);
						}

						if (largeImages.length > 0) {
							largeImages.forEach((image) => {
								vscode.window.showInformationMessage(
									`Image ${image.file} is wider than 850px.`
								);
							});
						} else {
							vscode.window.showInformationMessage(
								"No images wider than 850px found."
							);
						}
					}
				});
			} else {
				vscode.window.showInformationMessage(
					`Directory ${dir} does not exist.`
				);
			}
		});
	} else {
		vscode.window.showErrorMessage("No workspace folder open");
	}
}

module.exports = artChecker;

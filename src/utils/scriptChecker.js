const vscode = require("vscode");

function scriptChecker(diagnosticCollection, $) {
	const head = $("head");
	const body = $("body");
	const document = vscode.window.activeTextEditor.document;
	let diagnostics = [];
	let messages = [];

	// Check for <link rel="stylesheet" href="../../css/edwin-lo.min.css"> in <head>
	if (head.find('link[href="../../css/edwin-lo.min.css"]').length === 0) {
		messages.push(
			'Missing <link rel="stylesheet" href="../../css/edwin-lo.min.css"> in <head>'
		);
	}

	// Check for <script src="../../js/jquery.min.js"></script> at the bottom of <body>
	if (body.find('script[src="../../js/jquery.min.js"]').length === 0) {
		messages.push(
			'Missing <script src="../../js/jquery.min.js"></script> at the bottom of <body>'
		);
	}

	// Check for <script src="../../js/edwin-lo.min.js"></script> at the bottom of <body>
	if (body.find('script[src="../../js/edwin-lo.min.js"]').length === 0) {
		messages.push(
			'Missing <script src="../../js/edwin-lo.min.js"></script> at the bottom of <body>'
		);
	}

	// Check for MathJax script if a <math> element is present
	if ($("math").length > 0) {
		if (
			body.find(
				'script[src="../../js/mathml/MathJax.js?config=MML_HTMLorMML-full"]'
			).length === 0
		) {
			messages.push(
				'Missing <script src="../../js/mathml/MathJax.js?config=MML_HTMLorMML-full"> when <math> element is present'
			);
		}
	}

	// Check for AblePlayer-related tags if data-ilo="AbleAudio" is present
	if ($('[data-ilo="AbleAudio"]').length > 0) {
		if (
			head.find(
				'link[href="../../vendor/edwin-ableplayer/build/ableplayer.min.css"]'
			).length === 0 ||
			head.find('link[href="../../css/edwin-ableplayer.min.css"]').length === 0
		) {
			messages.push(
				'Missing AblePlayer CSS links in <head> when data-ilo="AbleAudio" is present'
			);
		}
		if (
			body.find(
				'script[src="../../vendor/edwin-ableplayer/thirdparty/js.cookie.min.js"]'
			).length === 0 ||
			body.find(
				'script[src="../../vendor/edwin-ableplayer/build/ableplayer.min.js"]'
			).length === 0 ||
			body.find('script[src="../../js/edwin-ableplayer.min.js"]').length === 0
		) {
			messages.push(
				'Missing AblePlayer scripts in <body> when data-ilo="AbleAudio" is present'
			);
		}
	}

	// Check for EdwinGallery-related tags if data-ilo="EdwinGallery" is present
	if ($('[data-ilo="EdwinGallery"]').length > 0) {
		if (
			head.find('link[href="../../css/edwin-gallery.min.css"]').length === 0
		) {
			messages.push(
				'Missing EdwinGallery CSS link in <head> when data-ilo="EdwinGallery" is present'
			);
		}
		if (body.find('script[src="../../js/edwin-gallery.min.js"]').length === 0) {
			messages.push(
				'Missing EdwinGallery script in <body> when data-ilo="EdwinGallery" is present'
			);
		}
	}

	// Check for EdwinLightBox-related tags if data-ilo="EdwinLightBox" is present
	if ($('[data-ilo="EdwinLightBox"]').length > 0) {
		if (
			head.find('link[href="../../css/edwin-lightbox.min.css"]').length === 0
		) {
			messages.push(
				'Missing EdwinLightBox CSS link in <head> when data-ilo="EdwinLightBox" is present'
			);
		}
		if (
			body.find('script[src="../../js/edwin-lightbox.min.js"]').length === 0
		) {
			messages.push(
				'Missing EdwinLightBox script in <body> when data-ilo="EdwinLightBox" is present'
			);
		}
	}

	// Check for BeerSlider-related tags if data-ilo="BeerSlider" is present
	if ($('[data-ilo="BeerSlider"]').length > 0) {
		if (
			head.find('link[href="../../vendor/beerslider/BeerSlider.css"]')
				.length === 0
		) {
			messages.push(
				'Missing BeerSlider CSS link in <head> when data-ilo="BeerSlider" is present'
			);
		}
		if (
			body.find('script[src="../../vendor/beerslider/BeerSlider.js"]')
				.length === 0
		) {
			messages.push(
				'Missing BeerSlider script in <body> when data-ilo="BeerSlider" is present'
			);
		}
	}

	// Check for HoverZoom-related tags if data-ilo="HoverZoom" is present
	if ($('[data-ilo="HoverZoom"]').length > 0) {
		if (
			head.find('link[href="../../vendor/drift/drift-basic.min.css"]')
				.length === 0
		) {
			messages.push(
				'Missing HoverZoom CSS link in <head> when data-ilo="HoverZoom" is present'
			);
		}
		if (
			body.find('script[src="../../vendor/drift/Drift.min.js"]').length === 0
		) {
			messages.push(
				'Missing HoverZoom script in <body> when data-ilo="HoverZoom" is present'
			);
		}
	}

	// Check for BuzzFeed quiz script if data-ilo="BuzzFeed" is present
	if ($('[data-ilo="BuzzFeed"]').length > 0) {
		if (body.find('script[src="../../js/quiz-bf.js"]').length === 0) {
			messages.push(
				'Missing BuzzFeed quiz script in <body> when data-ilo="BuzzFeed" is present'
			);
		}
	}

	// Check for ChoiceGrid quiz script if data-ilo="ChoiceGrid" is present
	if ($('[data-ilo="ChoiceGrid"]').length > 0) {
		if (body.find('script[src="../../js/choice-grid.js"]').length === 0) {
			messages.push(
				'Missing ChoiceGrid quiz script in <body> when data-ilo="ChoiceGrid" is present'
			);
		}
	}

	// Check for LanguagePractice quiz-related tags if data-ilo="LanguagePractice" is present
	if ($('[data-ilo="LanguagePractice"]').length > 0) {
		if (
			head.find('link[href="../../css/quiz-lang-practice.min.css"]').length ===
			0
		) {
			messages.push(
				'Missing LanguagePractice CSS link in <head> when data-ilo="LanguagePractice" is present'
			);
		}
		if (
			body.find('script[src="../../js/quiz-lang-practice.min.js"]').length === 0
		) {
			messages.push(
				'Missing LanguagePractice script in <body> when data-ilo="LanguagePractice" is present'
			);
		}
	}

	// Check for MultipleChoice quiz script if data-ilo="MultipleChoice" is present
	if ($('[data-ilo="MultipleChoice"]').length > 0) {
		if (body.find('script[src="../../js/quiz-mc.js"]').length === 0) {
			messages.push(
				'Missing MultipleChoice quiz script in <body> when data-ilo="MultipleChoice" is present'
			);
		}
	}

	// Check for QuizList quiz script if data-ilo="QuizList" is present
	if ($('[data-ilo="QuizList"]').length > 0) {
		if (body.find('script[src="../../js/quiz-list.js"]').length === 0) {
			messages.push(
				'Missing QuizList quiz script in <body> when data-ilo="QuizList" is present'
			);
		}
	}

	// Check for FillinBlanks quiz script if data-ilo="FillinBlanks" is present
	if ($('[data-ilo="FillinBlanks"]').length > 0) {
		if (body.find('script[src="../../js/quiz-blanks.js"]').length === 0) {
			messages.push(
				'Missing FillinBlanks quiz script in <body> when data-ilo="FillinBlanks" is present'
			);
		}
	}

	// Check for TextEntry quiz-related tags if data-ilo="TextEntry" is present
	if ($('[data-ilo="TextEntry"]').length > 0) {
		if (
			head.find('link[href="../../css/quiz-text-entry.min.css"]').length === 0
		) {
			messages.push(
				'Missing TextEntry CSS link in <head> when data-ilo="TextEntry" is present'
			);
		}
		if (
			body.find('script[src="../../js/quiz-text-entry.min.js"]').length === 0
		) {
			messages.push(
				'Missing TextEntry script in <body> when data-ilo="TextEntry" is present'
			);
		}
	}

	messages.forEach((message) => {
		const diagnostic = new vscode.Diagnostic(
			new vscode.Range(0, 0, 0, 0),
			message,
			vscode.DiagnosticSeverity.Warning
		);
		diagnostics.push(diagnostic);
	});

	diagnosticCollection.set(document.uri, diagnostics);

	if (diagnostics.length > 0) {
		vscode.window.showWarningMessage(
			"Some issues were found. Please check the problems window: Ctrl + Shift + M to open."
		);
	} else {
		diagnosticCollection.clear();
		vscode.window.showInformationMessage("All good!");
	}
}

module.exports = scriptChecker;

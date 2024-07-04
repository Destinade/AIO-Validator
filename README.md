# AIO HTML Validator

## Usage

1. Open an HTML file.
2. Use the command palette (`Ctrl+Shift+P`) and type `nellie`.
3. You have 5 options:

- **nellie.checkAll**: Initiates all the following checks in order: Entities - Validation - Heading Hierarchy - Unused Scripts - Art Specs - Cross Check.
- **nellie.checkHTML**: Validates the HTML file.
- **nellie.checkEntities**: Finds non-basic ASCII characters.
- **nellie.checkArt**: Confirms art specs.
- **nellie.crossCheck**: Compares the manuscript file with your code.

4. Nellie will go through the file with you and notify any inconsistencies through information messages. If there are any problems, she will print them for you in the problems panel.

## Features

<div align="center">
    <strong>Workspace Settings</strong>
</div>
Automatically updates all workspace settings to Nelson specifications.

<div align="center">
    <strong>HTML Validation</strong>
</div>
Validates the markup, checks the heading hierarchy, and verifies if there are any unused scripts.

<div align="center">
    <strong>Entity Checker</strong>
</div>
Checks if there are any non-basic ASCII characters within the 'p' tags and prompts you to convert them to Unicode.

<div align="center">
    <strong>Art Checker</strong>
</div>
Checks if the referenced art meets required specifications such as size, height, and width.

<div align="center">
    <strong>Cross Checker (WIP)</strong>
</div>
Prompts you to select a manuscript file and confirms if all text is converted correctly. Checks for italic and bold formats and ensures the paragraphs are complete and without any punctuation errors.

## Known bugs

The first copyright symbol should be omitted from the entity checker.<br>
Initiating 2 concurrent instances should not be allowed.<br>
Check for non-unique ids.<br>

### Planned

6 hours = Checks if the document follows best practices (e.g., filenames).<br>

### In Progress

8 hours = Cross-checks consistency errors against the word manuscript file and markup (e.g., italic and bold words).<br>

### Completed

On top of all the HTML Validator checks +<br>
8 hours = Checks if non-converted HTML entities are in the markup.<br>
4 hours = Checks the heading hierarchy (avoids the media player issue).<br>
8 hours = Checks if all images are sized appropriately.<br>
6 hours = Checks for missing and unused scripts.<br>
8 hours = Defaults the formatting to nelson.workspace when the language is HTML.<br>

## Total Time Needed

Total: 48 hours<br>
7 business days (full-time)<br>
24 days (part-time)<br>

### Author

Ian Pekunsal

## License

Distributed under the GNU General Public License. See `LICENSE` for more information.

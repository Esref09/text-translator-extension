Text Translator Extension
A Chrome extension that translates selected text using the MyMemory Translated API, featuring a customizable popup and a context menu option for Google Translate redirection.
Features

Translate text between languages like English, Turkish, and French with automatic language detection.
Dynamically adjusts popup size based on text length for better readability.
Right-click context menu option to open selected text in Google Translate.
User-friendly interface with selectable source and target languages.

Installation

Clone the repository to your local machine:git clone https://github.com/Esref09/text-translator-extension.git


Navigate to the translate folder:cd translate


Open Chrome and go to chrome://extensions/.
Enable "Developer mode" in the top right corner.
Click "Load unpacked" and select the translate folder from your desktop.

Usage

Highlight any text on a webpage.
Click the extension icon in the Chrome toolbar to open the popup.
Select the original and target languages from the dropdown menus.
Click "Translate" to see the result, or right-click the button to redirect to Google Translate.
The popup resizes automatically based on the translated text length.

Project Structure

LICENSE: MIT License details.
README.md: This file.
src/: Contains all extension files:
manifest.json: Defines the extension’s metadata and permissions.
popup.html: The HTML structure for the popup UI.
popup.js: Handles translation logic and UI interactions.
background.js: Manages background tasks (if implemented).
icon.png: The extension’s icon.



Contributing
Contributions are welcome! Please fork this repository, make your changes, and submit a pull request. For major changes, please open an issue first to discuss.
License
This project is licensed under the MIT License - see the LICENSE file for details.

import { Plugin, MarkdownView } from 'obsidian';
import { TextReplacerSettingsTab } from './settings'; // Adjust the path to match your directory structure

interface Rule {
    startDelimiter: string;
    endDelimiter: string;
    replacementText: string;
}

interface TextReplacerSettings {
    rules: Rule[];
}

const DEFAULT_SETTINGS: TextReplacerSettings = {
    rules: [
        {
            startDelimiter: 'FIRST_DELIMITER',
            endDelimiter: 'SECOND_DELIMITER',
            replacementText: 'REPLACED',
        }
    ]
};

export default class TextReplacerPlugin extends Plugin {
    settings: TextReplacerSettings;

    async onload() {
        await this.loadSettings();

        // Add the command for replacing text between delimiters
        this.addCommand({
            id: 'replace-text-between',
            name: 'Replace Text Between Delimiters',
            callback: () => this.replaceTextBetween(),
        });

        // Add the settings tab
        this.addSettingTab(new TextReplacerSettingsTab(this.app, this));

        // Add the icon button to the ribbon
        this.addRibbonIcon('replace', 'Replace Text', () => {
            this.replaceTextBetween();
        });
    }

    async replaceTextBetween() {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeView) {
            const editor = activeView.editor;
            const content = editor.getValue();

            let newText = content;

            this.settings.rules.forEach(rule => {
                const { startDelimiter, endDelimiter, replacementText } = rule;
                newText = newText.replace(
                    new RegExp(`${startDelimiter}([\\s\\S]*?)${endDelimiter}`, 'g'),
                    (match, content) => {
                        return `${startDelimiter}${replacementText}${endDelimiter}`;
                    }
                );
            });

            await editor.setValue(newText);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
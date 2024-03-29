import { Plugin, MarkdownView, TFile } from 'obsidian';

interface TextReplacerSettings {
    startDelimiter: string;
    endDelimiter: string;
}

const DEFAULT_SETTINGS: TextReplacerSettings = {
    startDelimiter: '{{',
    endDelimiter: '}}'
};

export default class TextReplacerPlugin extends Plugin {
    settings: TextReplacerSettings;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: 'replace-text-between',
            name: 'Replace Text Between Delimiters',
            callback: () => this.replaceTextBetween(),
        });

        this.addSettingTab(new TextReplacerSettingsTab(this.app, this));
    }

    async replaceTextBetween() {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeView) {
            const editor = activeView.editor;
            const {startDelimiter, endDelimiter} = this.settings;

            const selectedText = editor.getSelection();

            if (selectedText) {
                const newText = selectedText.replace(
                    new RegExp(`${startDelimiter}([\\s\\S]*?)${endDelimiter}`, 'g'),
                    (match, content) => {
                        // Here you can implement the logic to replace the content
                        // For simplicity, let's just return the content as it is
                        return content;
                    }
                );

                await editor.replaceSelection(newText);
            }
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
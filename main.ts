import { Plugin, MarkdownView } from 'obsidian';
import { TextReplacerSettingsTab } from './settings'; // Ajusta la ruta según tu estructura de directorios

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

        // Agrega el comando para reemplazar texto entre delimitadores
        this.addCommand({
            id: 'replace-text-between',
            name: 'Replace text between delimiters',  // Cambiado a sentence case
            callback: () => this.replaceTextBetween(),
        });

        // Agrega la pestaña de configuración
        this.addSettingTab(new TextReplacerSettingsTab(this.app, this));

        // Agrega el botón de ícono a la barra lateral
        this.addRibbonIcon('replace', 'Replace text', () => {  // Cambiado a sentence case
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

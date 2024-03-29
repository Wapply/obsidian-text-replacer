import { PluginSettingTab, App, Setting } from 'obsidian';

export class TextReplacerSettingsTab extends PluginSettingTab {
    plugin: any;

    constructor(app: App, plugin: any) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'Text Replacer Settings'});

        new Setting(containerEl)
            .setName('Start Delimiter')
            .setDesc('Enter the start delimiter')
            .addText(text => text
                .setPlaceholder('e.g., {{')
                .setValue(this.plugin.settings.startDelimiter)
                .onChange(async (value) => {
                    this.plugin.settings.startDelimiter = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('End Delimiter')
            .setDesc('Enter the end delimiter')
            .addText(text => text
                .setPlaceholder('e.g., }}')
                .setValue(this.plugin.settings.endDelimiter)
                .onChange(async (value) => {
                    this.plugin.settings.endDelimiter = value;
                    await this.plugin.saveSettings();
                }));
    }
}
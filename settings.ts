import { PluginSettingTab, App, Setting, ButtonComponent } from 'obsidian';

export class TextReplacerSettingsTab extends PluginSettingTab {
    plugin: any;
    rulesContainer: HTMLElement;

    constructor(app: App, plugin: any) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let {containerEl} = this;

        containerEl.empty();

        this.rulesContainer = containerEl.createEl('div', { attr: { class: 'text-replacer-rules' } });

        this.renderRules();
    }

    renderRules() {
        this.rulesContainer.empty();

        for (let i = 0; i < this.plugin.settings.rules.length; i++) {
            const rule = this.plugin.settings.rules[i];

            const ruleDiv = this.rulesContainer.createEl('div', { attr: { class: 'text-replacer-rule' } });

            new Setting(ruleDiv)
                .setName('Start Delimiter')
                .addText(text => text
                    .setValue(rule.startDelimiter)
                    .onChange(async (value) => {
                        this.plugin.settings.rules[i].startDelimiter = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(ruleDiv)
                .setName('End Delimiter')
                .addText(text => text
                    .setValue(rule.endDelimiter)
                    .onChange(async (value) => {
                        this.plugin.settings.rules[i].endDelimiter = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(ruleDiv)
                .setName('Replacement Text')
                .addText(text => text
                    .setValue(rule.replacementText)
                    .onChange(async (value) => {
                        this.plugin.settings.rules[i].replacementText = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(ruleDiv)
                .setName('Remove Rule')
                .addButton(button => button
                    .setButtonText('Remove')
                    .onClick(async () => {
                        this.plugin.settings.rules.splice(i, 1);
                        await this.plugin.saveSettings();
                        this.renderRules(); // Refresh only the rules section
                    }));
        }

        // Add the "Add Rule" button at the end of the rules
        new Setting(this.rulesContainer)
            .setName('Add Rule')
            .addButton(button => button
                .setButtonText('Add')
                .onClick(() => this.addRule()));
    }

    addRule() {
        this.plugin.settings.rules.push({
            startDelimiter: '',
            endDelimiter: '',
            replacementText: ''
        });
        this.renderRules(); // Refresh only the rules section
    }
}
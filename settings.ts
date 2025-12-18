import HexoPublisherPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

class HexoPublisherSettingTab extends PluginSettingTab {
	hexoFileFolder: string = "";
	plugin: HexoPublisherPlugin;

	constructor(app: App, plugin: HexoPublisherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Hexo目录")
			.setDesc("Hexo博客文件所在文件夹")
			.addText((text) =>
				text
					.setPlaceholder("输入 Hexo 文件文件夹路径")
					.setValue(this.plugin.settings.hexoFileFolder)
					.onChange(async (value) => {
						this.plugin.settings.hexoFileFolder = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

export default HexoPublisherSettingTab;

/*
 * @Author: huajingyang 3373238891@qq.com
 * @Date: 2025-12-18 09:35:23
 * @LastEditors: huajingyang 3373238891@qq.com
 * @LastEditTime: 2025-12-18 17:09:13
 * @FilePath: \.obsidian\plugins\hexo-publisher\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	FileSystemAdapter,
} from "obsidian";
import HexoPublisherSettingTab from "settings";
import { publishToHexo } from "utils";
const path = require("path");

// Remember to rename these classes and interfaces!

interface HexoPublisherSettings {
	hexoFileFolder: string;
}

const DEFAULT_SETTINGS: HexoPublisherSettings = {
	hexoFileFolder: "",
};

export default class HexoPublisherPlugin extends Plugin {
	settings: HexoPublisherSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new HexoPublisherSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item.setTitle("Publish to Hexo 👈")
						.setIcon("file-input")
						.onClick(async () => {
							console.log(file);
							console.log(
								this.app.vault.adapter.getFullPath(file.path)
							);
							await publishToHexo(
								this.app.vault.adapter.getFullPath(file.path),
								path.join(
									this.settings.hexoFileFolder,
									"\\source\\_posts\\" + file.name
								),
								file.basename,
								file.parent.name
							);
						});
				});
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				menu.addItem((item) => {
					item.setTitle("Publish to Hexo 👈")
						.setIcon("file-input")
						.onClick(async () => {
							if (!view.file) {
								new Notice("未选择文件");
								return;
							}
						});
				});
			})
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

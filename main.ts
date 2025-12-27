import {
	Notice,
	Plugin,
	FileSystemAdapter,
	TFile,
} from "obsidian";
import HexoPublisherSettingTab from "settings";
import { clean, moveToHexo, publish, deploy, generate } from "utils";
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
							if (!file.parent) {
								new Notice("文件应当位于目录内（目录名作为分类名）");
								return;
							}

							await moveToHexo(
								(this.app.vault.adapter as FileSystemAdapter).getFullPath(file.path),
								path.join(
									this.settings.hexoFileFolder,
									"\\source\\_posts\\" + file.name
								),
								(file as TFile).basename,
								file.parent.name
							);

							await clean(this.settings.hexoFileFolder);
							new Notice("正在上传...");
							publish(this.settings.hexoFileFolder)
								.then(({ stdout, stderr }) => {
									console.log("stdout: ", stdout);
									console.log("stderr: ", stderr);
									new Notice("上传完成！");
								})
								.catch((error) => {
									new Notice(`发布失败：${error.message}`);
								});
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
							if (!view.file.parent) {
								new Notice("文件应当位于目录内（目录名作为分类名）");
								return;
							}
							await moveToHexo(
								(this.app.vault.adapter as FileSystemAdapter).getFullPath(
									view.file.path
								),
								path.join(
									this.settings.hexoFileFolder,
									"\\source\\_posts\\" + view.file.name
								),
								view.file.basename,
								view.file.parent.name
							);

							await clean(this.settings.hexoFileFolder);
							new Notice("正在上传...");
							publish(this.settings.hexoFileFolder)
								.then(({ stdout, stderr }) => {
									console.log("stdout: ", stdout);
									console.log("stderr: ", stderr);
									new Notice("上传完成！");
								})
								.catch((error) => {
									new Notice(`发布失败：${error.message}`);
								});
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

import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	FileSystemAdapter,
	addIcon,
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
					item.setTitle("👉 Publish to Hexo")
						.setIcon("file-input")
						.onClick(async () => {
							await moveToHexo(
								this.app.vault.adapter.getFullPath(file.path),
								path.join(
									this.settings.hexoFileFolder,
									"\\source\\_posts\\" + file.name
								),
								file.basename,
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
				})
					.addItem((item) => {
						item.setTitle("👉 hexo clean")
							.setIcon("file-x")
							.onClick(async () => {
								await clean(this.settings.hexoFileFolder);
								new Notice("已清除public目录");
							});
					})
					.addItem((item) => {
						item.setTitle("👉 hexo generate")
							.setIcon("file-check")
							.onClick(async () => {
								new Notice("正在生成...");
								generate(this.settings.hexoFileFolder).then(
									({ stdout, stderr }) => {
										console.log("stdout: ", stdout);
										console.log("stderr: ", stderr);
										new Notice("生成完成！");
									}
								);
							});
					})
					.addItem((item) => {
						item.setTitle("👉 hexo deploy")
							.setIcon("upload")
							.onClick(async () => {
								new Notice("正在部署...");
								await deploy(this.settings.hexoFileFolder);
								new Notice("部署完成！");
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
							await moveToHexo(
								this.app.vault.adapter.getFullPath(
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

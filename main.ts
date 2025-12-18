import { App, Editor, MarkdownView, Modal, Notice, Plugin, FileSystemAdapter } from "obsidian";
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

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(_evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		this.addCommand({
			id: "move-file-to-hexo",
			name: "Move file to hexo",
			callback: () => {
				new Notice("Move file to hexo command executed");
			},
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new HexoPublisherSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item.setTitle("Publish to Hexo 👈")
						.setIcon("file-input")
						.onClick(async () => {
							console.log(this.app.vault.adapter.getFullPath(file.path));
							await publishToHexo(
								this.app.vault.adapter.getFullPath(file.path),
								path.join(
									this.settings.hexoFileFolder,
									"\\source\\_posts\\" + file.name
								)
							);
							// new Notice(this.app.vault.adapter.getFullPath(file.path));
							// await moveFile(
							// 	path.join(__dirname, file.path),
							// 	path.join(
							// 		this.settings.hexoFileFolder,
							// 		"\\source\\_posts\\" + file.name
							// 	)
							// );
							// new Notice(
							// 	"文件已移动到" +
							// 		this.settings.hexoFileFolder +
							// 		"\\source\\_posts\\" +
							// 		file.name
							// );
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
							// await moveFile(
							// 	path.join(__dirname, view.file.path),
							// 	path.join(
							// 		this.settings.hexoFileFolder,
							// 		"\\source\\_posts\\" + view.file.name
							// 	)
							// );
							// new Notice(
							// 	"文件已移动到" +
							// 		this.settings.hexoFileFolder +
							// 		"\\source\\_posts\\" +
							// 		view.file.name
							// );
						});
				});
			})
		);

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
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

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const { contentEl } = this;
// 		contentEl.setText("Woah!");
// 	}

// 	onClose() {
// 		const { contentEl } = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: ;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const { containerEl } = this;

// 		containerEl.empty();

// 		new Setting(containerEl)
// 			.setName("Hexo file folder")
// 			.setDesc("Folder to store hexo files")
// 			.addText((text) =>
// 				text
// 					.setPlaceholder("Enter your secret")
// 					.setValue(this.plugin.settings.mySetting)
// 					.onChange(async (value) => {
// 						this.plugin.settings.mySetting = value;
// 						await this.plugin.saveSettings();
// 					})
// 			);
// 	}
// }

import { resolve } from "path";

const fs = require("fs/promises"); // Promise 版 fs（推荐）
const path = require("path");
const { format } = require("date-fns");
const { exec } = require("child_process");

async function publishToHexo(
	srcPath: string,
	destPath: string,
	title: string,
	categories: string
) {
	const property =
		"---\n" +
		"title: " +
		title +
		"\n" +
		"categories: " +
		categories +
		"\n" +
		"date: " +
		format(new Date(), "yyyy-MM-dd HH:mm:ss") +
		"\n" +
		"---";
	try {
		const content = await fs.readFile(srcPath, "utf8");

		await fs.writeFile(destPath, property + "\n" + content, "utf8");

		exec(
			"hexo g && hexo d",
			{ encoding: "utf8", windowsHide: true },
			(error, stdout, stderr) => {
				if (error) {
					console.error(`执行出错: ${error}`);
					return;
				}
				console.log(`stdout: ${stdout}`);
				console.error(`stderr: ${stderr}`);
			}
		);
	} catch (err) {
		console.error(`发布失败：${err.message}`);
	}
}

export { publishToHexo };

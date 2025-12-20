import { resolve } from "path";

const fs = require("fs/promises");
const path = require("path");
const { format } = require("date-fns");
const { exec, execFile } = require("child_process");

async function moveToHexo(
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
	} catch (err) {
		console.error(`文件移动失败：${err.message}`);
	}
}

async function publish(path: string) {
	return new Promise((resolve, reject) => {
		console.log("path: ", path);
		try {
			exec(
				"hexo generate --deploy",
				{
					encoding: "utf8",
					windowsHide: false,
					cwd: path, // 指定子进程的工作目录为目标路径
				},
				(error: any, stdout: string, stderr: string) => {
					if (error) {
						console.error(`执行出错: ${error.message}`);
						reject(error);
					}
					resolve({ stdout, stderr });
				}
			);
		} catch (err: any) {
			console.error(`发布失败：${err.message}`);
		}
	});
}

async function clean(path: string) {
	try {
		await exec(
			"hexo clean",
			{
				encoding: "utf8",
				windowsHide: false,
				cwd: path, // 指定子进程的工作目录为目标路径
			},
			(error: any, stdout: string, stderr: string) => {
				if (error) {
					console.error(`执行出错: ${error.message}`);
				}
				console.log("stdout: ", stdout);
			}
		);
	} catch (err: any) {
		console.error(`清除public目录失败：${err.message}`);
	}
}

async function generate(path: string) {
	try {
		await exec(
			"hexo generate",
			{
				encoding: "utf8",
				windowsHide: false,
				cwd: path, // 指定子进程的工作目录为目标路径
			},
			(error: any, stdout: string, stderr: string) => {
				if (error) {
					console.error(`执行出错: ${error.message}`);
				}
				console.log("stdout: ", stdout);
			}
		);
	} catch (err: any) {
		console.error(`public目录生成失败：${err.message}`);
	}
}

async function deploy(path: string) {
	try {
		await exec(
			"hexo deploy",
			{
				encoding: "utf8",
				windowsHide: false,
				cwd: path, // 指定子进程的工作目录为目标路径
			},
			(error: any, stdout: string, stderr: string) => {
				if (error) {
					console.error(`执行出错: ${error.message}`);
				}
				console.log("stdout: ", stdout);
			}
		);
	} catch (err: any) {
		console.error(`部署失败：${err.message}`);
	}
}

export { moveToHexo, publish, clean, generate, deploy };
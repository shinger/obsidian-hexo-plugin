const fs = require("fs/promises"); // Promise 版 fs（推荐）
const path = require("path");

const property = "---\n" +
"date: 2025-12-31\n" +
"---"

/**
 * 移动文件（基于 rename）
 * @param {string} srcPath 原文件绝对路径
 * @param {string} destPath 目标文件绝对路径
 */
async function moveFile(srcPath: string, destPath: string) {
	try {
		// 1. 检查目标目录是否存在，不存在则创建（避免移动失败）
		const destDir = path.dirname(destPath); // 提取目标文件所在目录
		await fs.mkdir(destDir, { recursive: true }); // recursive: true 自动创建多级目录

		// 2. 执行移动（rename 跨目录即移动）
		await fs.rename(srcPath, destPath);
		console.log(`文件移动成功：${srcPath} -> ${destPath}`);
	} catch (err) {
		if (err.code === "ENOENT") {
			console.error(`移动失败：原文件不存在 ${srcPath}`);
		} else if (err.code === "EACCES") {
			console.error(`移动失败：无权限访问 ${err.path}`);
		} else {
			console.error(`移动失败：${err.message}`);
		}
	}
}

async function publishToHexo(srcPath: string, destPath: string) {
	try {
		const content = await fs.readFile(srcPath, 'utf8');
		
		await fs.writeFile(destPath, property + '\n' + content, 'utf8');
	} catch (err) {
		console.error(`发布失败：${err.message}`);
	}
}

export { moveFile, publishToHexo };

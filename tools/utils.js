const fs = require('fs');
const path = require('path');

/**
 * 获取文件信息
 * @param  {string} file
 * @return {FileInfo}
 */
function getInfo(file) {
    const info = path.parse(file);
}

/**
 * 获取文件信息列表
 * @see    https://github.com/maichong/labrador-cli/blob/master/lib/utils.js#L114
 * @param  {string} dir
 * @return {Array<FileInfo>}
 */
function getFileInfos(dir) {
    const res = [];
    const list = fs.readdirSync(dir);
    for (let name of list) {
        // Omit ".eslintrc", ".DS_Store" etc.
        if (name[0] === '.') {
            continue
        }

        const file = path.join(dir, name);
        if (isDirectory(file)) {
            res = res.concat(getFileInfos(file));
        } else {
            res.push()
        }
    }
}

/**
 * 判断指定路径是否是文件夹
 * @see     https://github.com/maichong/labrador-cli/blob/master/lib/utils.js#L29
 * @param  {path}
 * @return {Boolean}
 */
function isDirectory(path) {
    try {
        return fs.statSync(path).isDirectory();
    } catch (e) {
        return false;
    }
}

module.exports = {
    isDirectory: isDirectory
};

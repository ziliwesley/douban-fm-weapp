const glob = require('glob');

// const JS_FILE_PATTERN = /^src(.*)(\.js|\.less)$/;
// const CSS_FILE_PATTERN = /^src(.*)\.less$/;

/**
 * 搜索所有满足条件的小程序页面 JS 文件
 * @param  {string} rootPath
 * @param  {string} ext
 * @return {Promise}
 */
function searchPages(rootPath, ext) {
    const pattern = new RegExp(`^src(.*)\.${ext}$`);

    return new Promise((resolve, reject) => {
        glob(`src/pages/**/*.${ext}`, {
            cwd: rootPath
        }, function (err, res) {
            const entries = {
                app: `./src/app.${ext}`
            };

            if (err) {
                return reject(`无法找到页面 JavaScript 文件: ${err.message}`);
            }

            res.forEach(filepath => {
                // src/pages/entry.js => /pages/entry.js
                // src/pages/entry.less => /pages/entry.css
                let key = filepath.replace(pattern, '$1');
                entries[key] = `./${filepath}`;
            });

            resolve(entries);
        })
    });
}

module.exports = {
    searchPages: searchPages
};

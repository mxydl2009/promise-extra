/**
 * 在构建产物的上面添加bannerInfo
 */

const pkg = require("./package.json");

const bannerInfo = `/*!
* ${pkg.name} ${pkg.version}
* Licensed under MIT
*/
`;

exports.bannerInfo = bannerInfo;

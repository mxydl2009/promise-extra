const pkg = require("./package.json");

const bannerInfo = `/*!
* ${pkg.name} ${pkg.version}
* Licensed under MIT
*/
`;

exports.bannerInfo = bannerInfo;

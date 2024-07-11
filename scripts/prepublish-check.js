// 检查逻辑
const inquirer = require("inquirer");

async function check() {
  const questions = [
    {
      type: "confirm",
      name: "check",
      message: "build CHANGELOG.md README.md test all checked?",
      default: false,
    },
  ];
  const answers = await inquirer.prompt(questions);
  if (answers.check) {
    process.exit(0); // 返回 0，继续执行 npm publish
  } else {
    process.exit(1); // 返回非零退出码，中止 npm publish
  }
}

(async function () {
  await check();
})();

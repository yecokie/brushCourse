//const watch = require('./watch');
const test = require('./get');
const readline = require('readline');


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


rl.question('请输入Cookie:', async cookie => {
	rl.question('请输入课程链接:', async chapterUrl => {
		await test(cookie, chapterUrl);
		rl.close();
	});
});
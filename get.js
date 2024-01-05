const axios = require('axios');
const FormData = require('form-data');
const cheerio = require('cheerio');
const ProgressBar = require('progress');
const util = require('./util');


// 定义数组来存储对象
const dataArr = [];

const url = 'https://jxjycwweb.dongao.cn/cwweb/lecture/getAllVideoData';
//const chapterUrl = 'https://jxjycwweb.dongao.cn/cwweb/lecture/lectureList?cwID=100003718&platformCode=jxjydongao&accountId=23730269';
//const cookie = 'JSESSIONID=AB81C2CBB655F51DD85EA680A7028843';


async function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function genFormData(chapter) {
	try {
		const formData = new FormData();
		formData.append('lectureId', chapter.videoLectureId);
		formData.append('courseId', chapter.videoCwId);
		formData.append('isDrag', 0);
		formData.append('listenType', 2);
		formData.append('timeStamp', +new Date());
		formData.append('pcPlayType', 'h5');
		formData.append('accountId', 23730269);
		return formData;
	} catch (error) {
		console.error('Error in genFormData:', error);
		throw error;
	}
}

async function loopFunction({
	item,
	name,
	play,
	total
}) {
	var tdata = {
		"lectureID": item.lectureID,
		"cwID": item.cwID,
		"memberID": item.memberID,
		"recordID": item.recordID,
		"timeLenDealInterval": 40,
		"accountId": item.accountId
	};
	var RecordURL = item.timeLenDeal;
	var Play = util.parseTime2Second(play);
	var Total = util.parseTime2Second(total);
	var remainingTime = Total - Play;
	var progress = remainingTime / Total;
	const regexDate = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
	console.log(`开始学习课程:${name}`);
	const bar = new ProgressBar('学习进度: [:bar]', {
		total: remainingTime,
		width: Math.floor(progress * 40)
	});
	for (var i = Play; i <= Total; i += 40) {
		console.log('正在学习，已学时长:', util.formatTime(i), '总时长:', total);
		tdata.playtime = util.formatTime(i);
		tdata.sign = util.md5((Number(tdata.memberID) << 1 >>> 0) + (Number(tdata.cwID) >> 2 >>> 0) + (Number(tdata
			.lectureID) << 5 >>> 0) + 'QHvbVKr4yXKQ57fZ' + tdata.playtime);
		tdata.timeStamp = +new Date();

		var tdataString = JSON.stringify(tdata);
		var encodedTdata = encodeURIComponent(tdataString);
		const data = 'tdata=' + encodedTdata;
		//console.log(tdataString);

		try {
			const response = await axios.post(
				RecordURL,
				data, {
				headers: {
					'Cookie': cookie,
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': 329,
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
				},
				timeout: 5000 // 设置请求超时为5秒
			}

			);
			if (response.data.code === '0' && regexDate.test(response.data.msg)) {
				bar.tick(40);
				console.log('时长增加40s');
			} else {
				await delay(5000);
				play = util.formatTime(i);
				await loopFunction({item,
					name,
					play,
					total});
			}
		} catch (error) {
			console.error('错误:', error.message);
			console.error('3秒后重试...');
			await delay(3000);
			play = util.formatTime(i);
			await loopFunction({item,
				name,
				play,
				total});
		}
		await delay(20000);
	}
	console.log('下一章节即将开始..........');
}

async function fetchChapter(chapter) {
	const formData = await genFormData(chapter);
	try {
		const response = await axios.post(
			url,
			formData, {
			headers: {
				// ...headers,
				...formData.getHeaders(),
				Cookie: cookie,
				'Content-Length': formData.getLengthSync()
			}
		}
		);
		const responseData = response.data;
		const item = {
			nextLectureID: responseData.nextLectureID,
			recordID: responseData.recordID,
			lectureID: responseData.lectureID,
			cwID: responseData.cwID,
			beginPlayTime: responseData.beginPlayTime,
			timeLenDeal: responseData.timeLenDeal,
			accountId: responseData.accountId,
			memberID: responseData.memberID,
			timeLenDealInterval: responseData.timeLenDealInterval,
		};
		console.log(item);
		console.log('-------------------------------开始学习-------------------------------');
		await loopFunction({
			item,
			name: chapter.courseTitle,
			play: chapter.learnDo,
			total: chapter.totalAll
		})

	} catch (error) {
		console.log('观看失败！')
		console.error(error);
		throw error; // Rethrow the error for handling outside of fetchCourse
	}
}

async function fetchChapterInfo() {
	try {
		const response = await axios.get(chapterUrl, {
			headers: {
				Cookie: cookie
			}
		});

		const html = response.data;
		const $ = cheerio.load(html);

		// Traverse each <tr> element
		$('.table tbody tr').each((index, element) => {
			const tdElements = $(element).find('td');
			const operationElement = tdElements.eq(2).find('.study-a');

			// Extract videoPlay parameters
			const videoPlayParamMatch = operationElement.attr('onclick').match(
				/videoPlay\(\s*['"]?(\d+)['"]?,\s*['"]?(\d+)['"]?\s*\)/);
			const videoCwId = videoPlayParamMatch ? parseInt(videoPlayParamMatch[1]) : null;
			const videoLectureId = videoPlayParamMatch ? parseInt(videoPlayParamMatch[2]) : null;

			// Store data in object
			const dataObj = {
				courseTitle: tdElements.eq(0).text().trim(),
				learnDo: tdElements.eq(1).find('.learn-do').text().trim(),
				totalAll: tdElements.eq(1).find('.learn-all').text().trim().replace(/\//g, ''),
				operation: operationElement.text().replace(/\s+/g, ' ').trim(),
				videoCwId,
				videoLectureId
			};

			// Only add incomplete courses
			if (dataObj.operation.includes('继续学习') || dataObj.operation.includes('开始学习')) {
				dataArr.push(dataObj);
			}

		});
		
		return dataArr;
	} catch (error) {
		console.error(error);
		console.log('获取章节失败！')
	}
}

async function processList(cookie, chapterUrl) {
	try {
		global.cookie = cookie;
		global.chapterUrl = chapterUrl;
		console.log('--------------------正在获取未学习章节信息--------------------');
		const list = await fetchChapterInfo();
		//console.log(list);
		for await (const chapter of list) {
			console.log(chapter);
			console.log('正在建立连接，预计用时1分钟......')
			await fetchChapter(chapter)
		}

	} catch (error) {
		console.log('登录失败');
		console.error(error);
		process.exit(-1)
	}
}
module.exports = processList;
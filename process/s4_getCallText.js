//Require basically means load this node package so that I can access it later
const fs = require('fs');
const d3 = require('d3');
const request = require('request');
const cheerio = require('cheerio');

//This is the file path for where I will save the files
const OUT_PATH = './output/singleCallsCSV/'

//Where we pul in the data from
const IN_PATH = './output/singleCallsHTML/'

function getCallText(d) {
	let callTextData = [];
	let callID = d.replace('.html', '');

	return new Promise((resolve, reject) => {
		const file = fs.readFileSync(`${IN_PATH}${d}`, 'utf-8')
		const $ = cheerio.load(file)

		const fileOut = `${OUT_PATH}/${callID}.csv`
		const exists = fs.existsSync(fileOut)

		let title = null
		let callText = null

		if (exists) resolve();
		else {
			$('header')
				.each((i, el) => {
					title = $(el).find('h1').text().replace(/\s+/g,' ').trim()
				})

			$('.article-content')
				.each((i, el) => {
					callText = $(el).text();
				})

			if (title) callTextData.push({title, callText})

			const allCallText = [].concat(...callTextData).map(d => ({
				...d,
			}))

			const jsonFile = JSON.stringify(allCallText);
			fs.writeFileSync(`${OUT_PATH}${callID}.json`, jsonFile)
			resolve();
		}
	})
}

async function init() {
	let files = fs.readdirSync(IN_PATH).filter(d => d.includes('.html'));

	//files = files.slice(0,3)

	let i = 0;

	for (const d of files) {
		console.log(i)
		try {
			await getCallText(d);
		} catch (error) {
			console.log(error);
		}
		i += 1;
	}
}

init();

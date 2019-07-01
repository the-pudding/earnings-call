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
		const $ = cherrio.load(file)

		const fileOut = `${OUT_PATH}/${callID}.csv`
		const exists = fs.existsSync(fileOut)

		if (exists) resolve();
		else {
			resolve();
		}
	})
}

async function init() {
	const files = fs.readdirSync(IN_PATH).filter(d => d.includes('.html'));

	let i = 0;

	for (const d of files) {
		console.log(i)
		try {
			await getCallText(d);
		} catch (error) {
			consoel.log(error);
		}
		i += 1;
	}
}

init();

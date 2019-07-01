//Require basically means load this node package so that I can access it later
const fs = require('fs');
const d3 = require('d3');
const request = require('request');
const cheerio = require('cheerio');

//This is the file path for where I will save the files
const OUT_PATH = './output/singleCallsHTML/'

//Where we pul in the data from
const IN_PATH = './output/links.csv'

//An empty area that will hold our data once it's pulled in and cleaned
let earningsCalls = [];

//LOADS THE DATA (takes a filename)
function loadData(filename) {
	//Raw uncleaned unformated data
	let raw = fs.readFileSync(filename, 'utf-8')
	//Puts the data into the proper format
	let cleanedCSV = d3.csvParse(raw)
	//Assigned the clean data to that empty array that we declared earlier
	earningsCalls = cleanedCSV
}

//DOWNLOADS TO SINGLE HTML PAGE ({linkCombined: 'https'})
function getSingleCallHTML(data) {
	//Drills down to get only the link
	let link = data.linkCombined

	//Sets us up to have a clean filename by splitting the link name at /
	let linkYear = link.split('/')[5]
	let linkMonth = link.split('/')[6]
	let linkDay = link.split('/')[7]
	let linkName = link.split('/')[8]
	let linkFirst = linkName.split('-')[0]
	//Combines the parts of the split that we want into a filename
	let linkFilename = `${linkYear}${linkMonth}${linkDay}_${linkFirst}`


	return new Promise((resolve, reject) => {
		//Where to save the file
		const filepath = `${OUT_PATH}/${linkFilename}.html`
		//Checking to see if the file already exists
		const exists = fs.existsSync(filepath)

		//If the file exists don't do anythign else (resolve)
		if (exists) resolve();
		//If that file doesn't exists we want to download and save it
		else {
			//Takes the link or url and captures the body (html)
			request(link, (err, response, body) => {
				if (err) reject(err)
				else {
					//Save the file with the correct filename and the body of the html
					fs.writeFileSync(filepath, body)
					//Once we've complete this finish the process and resolve
					resolve();
				}
			})
		}
	})
}

async function init() {
	loadData(IN_PATH)

	//const splitData = earningsCalls.slice(0,3)
	//getSingleCallHTML(splitData[0])

	//Starts the loop at an index of zero
	let i = 0;

	//For each row or item of data in earningsCalls - loop trhough it and do something
	for (const data of earningsCalls) {
		//Logs out the index so we know where we are
		console.log(i);
		try {
			//Downloads the HTML
			await getSingleCallHTML(data);
		} catch (error) {
			console.log(error);
		}
		//Adds one to the index so that the function loops again
		i += 1;
	}
}

init();

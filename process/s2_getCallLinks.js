//Require basically means load this node package so that I can access it later
const fs = require('fs');
const d3 = require('d3');
const request = require('request');
const cheerio = require('cheerio');

//Empty array to house the data that we will collect
const callLinks = [];

//The files I need to pull in
const IN_PATH = './output/callHTML/'

//This is the file path for where I will save the files
const OUT_PATH = './output/'

//Base url that we build upon
const BASE_URL = 'https://www.fool.com'

//Array of all the page numbers to add to the BASE_URL
const CALL_NUMS = d3.range(1, 408)

//function to find the things we need in the html
function getCallLinks(number){
	//Loads the HTML file
	const file = fs.readFileSync(`${IN_PATH}page-${number}.html`, 'utf-8');
	//Allows us to access the HTML file
	const $ = cheerio.load(file)

	//Find the element in the HTML we need
	$('.list-content')
		.each((i, el) => {
			const article = $(el).find('article')
			article.each((i, el) => {
				const title = $(el).find('h4')
				const linkRef = title.find('a')
				const link = linkRef.attr('href')
				//Combines the urls
				const linkCombined = `${BASE_URL}${link}`
				//If the link exists then push that link to the callLinks array
				if (linkCombined) callLinks.push({ linkCombined })
			})
		})
	return callLinks;
}

function init() {
	CALL_NUMS.map(getCallLinks);

	//Combine the callLinks array into one big data chuck
	const allLinks = [].concat(...callLinks).map(link => ({
		...link
	}));

	//Format that data chunk into a csv
	const csvLinks = d3.csvFormat(allLinks);
	//Save that csv
	fs.writeFileSync(`${OUT_PATH}links.csv`, csvLinks)
}

init();

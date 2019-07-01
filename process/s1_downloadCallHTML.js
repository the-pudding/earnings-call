//Require basically means load this node package so that I can access it later
const fs = require('fs');
const d3 = require('d3');
const request = require('request');
const cheerio = require('cheerio');

//This is the file path for where I will save the files
const OUT_PATH = './output/callHTML/'
//Base URL of the webpage to target
const BASE_URL = 'https://www.fool.com/earnings-call-transcripts/?page='
//Array of all the page numbers to add to the BASE_URL
//const CALL_NUMS = [1, 2, 3]
//Array of all numebr between 1 and 407
const CALL_NUMS = d3.range(1, 408)

//Function that actually pulls the page - it takes a number
async function getCallHTML(number) {
	//BASE_URL with the number from above added to the end
	const NUM_URL = `${BASE_URL}${number}`
	//This is the same as above, just different syntax
	//const NUM_URL = BASE_URL + number
	//Basic promise syntax
	return new Promise((resolve, reject) => {
		//Contact the URL (body is the html we're looking for)
		request(NUM_URL, (err, response, body) => {
			//Write and save the body or HTML out to out OUT_PATH
			fs.writeFileSync(`${OUT_PATH}/page-${number}.html`, body)
		})
	})
}

//Initial function (THIS IS THE ONLY FUNCTION BEING CALLED - PLACE THINGS INSIDE OF ME!)
function init() {
	//Maps over each value in the CALL_NUMS array and calls the getCallHTML once for each value
	CALL_NUMS.map(getCallHTML);
}

//RUN THE INIT FUNCTION!
init();

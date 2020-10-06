const { default: Axios } = require("axios");
const cheerio = require("cheerio");

async function getToday(date) {
	const mL = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	let dt = `${mL[new Date().getMonth()]}_${new Date().getDate()}`;
	const { data } = await Axios.get(`https://en.wikipedia.org/wiki/${dt}`);
	const $ = cheerio.load(data);
	let patt = /([\w\W ]+)\s+–\s+([\w\W ]+)/;
	// Events
	const eventEl = $("li", $("span#Events").parent().next()),
		eventList = [];
	eventEl.each((i, event) => {
		event = $(event).text().match(patt);
		eventList.push({ year: event[1], event: event[2].replace(/\[\d+\]/, "") });
	});
	// Birth
	const birthEl = $("li", $("span#Births").parent().next()),
		birthList = [];
	birthEl.each((i, birth) => {
		birth = $(birth).text().match(patt);
		birthList.push({ year: birth[1], birth: birth[2].replace(/\[\d+\]/, "") });
	});
	// Deaths
	const deathEl = $("li", $("span#Deaths").parent().next()),
		deathList = [];
	deathEl.each((i, death) => {
		death = $(death).text().match(patt);
		deathList.push({ year: death[1], death: death[2].replace(/\[\d+\]/, "") });
	});
	return { events: eventList, births: birthList, deaths: deathList };
}

module.exports = { getToday };

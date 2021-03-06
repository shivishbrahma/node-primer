const { default: Axios } = require("axios");
const cheerio = require("cheerio");

async function getQuotes() {
	const { data } = await Axios.get(
		"https://www.brainyquote.com/quotes_of_the_day.html"
	);
	const $ = cheerio.load(data);
	const qel = $("img.p-qotd");
	const quote = {};
	quote.brainyquote = {};
	let patt = /([\w\W ]+) - ([\w\W ]+)/;
	const qotd = qel.attr("alt").match(patt);
	quote.brainyquote.quote_of_the_day = { quote: qotd[1], author: qotd[2] };
	const qels = $("a.b-qt").slice(0, 5);
	const aels = $("a.bq-aut").slice(0, 5);
	quote.brainyquote.quotes_of_the_day = {};
	quote.brainyquote.quotes_of_the_day.main = {
		quote: $(qels[0]).text(),
		author: $(aels[0]).text(),
	};
	quote.brainyquote.quotes_of_the_day.love = {
		quote: $(qels[1]).text(),
		author: $(aels[1]).text(),
	};
	quote.brainyquote.quotes_of_the_day.art = {
		quote: $(qels[2]).text(),
		author: $(aels[2]).text(),
	};
	quote.brainyquote.quotes_of_the_day.nature = {
		quote: $(qels[3]).text(),
		author: $(aels[3]).text(),
	};
	quote.brainyquote.quotes_of_the_day.funny = {
		quote: $(qels[4]).text(),
		author: $(aels[4]).text(),
	};
	return quote;
}

async function getQuotesByTag(tag) {
	const { data } = await Axios.get(
		`https://www.brainyquote.com/search_results?q=${tag}`
	);
	const $ = cheerio.load(data);
	const qels = $("a.b-qt");
	const aels = $("a.bq-aut");
	const quote = {};
	quote.brainyquote = [];
	for (let i = 0; i < qels.length; i++) {
		quote.brainyquote.push({
			quote: $(qels[i]).text(),
			author: $(aels[i]).text(),
		});
	}
	return quote;
}

module.exports = { getQuotes, getQuotesByTag };

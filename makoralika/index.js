const express = require("express");
const { getQuotes, getQuotesByTag } = require("./plugins/quotes");
const lyrics_search = require("./plugins/lyrics");
const { getToday } = require("./plugins/calendar");

require("dotenv").config();

const Lyrics = new lyrics_search(process.env.GENIUS_API_KEY);

const app = express();

app.use(express.static("public"));

app.get("/api/quote", async (req, res) => {
	try {
		const quote = await getQuotes();
		res.json(quote);
	} catch {
		res.status(500);
	}
});

app.get("/api/quote/:q", async (req, res) => {
	try {
		const quote = await getQuotesByTag(req.params.q);
		res.json(quote);
	} catch {
		res.status(500);
	}
});

app.get("/api/lyric/:q", async (req, res) => {
	try {
		const lyric = await Lyrics.search(req.params.q);
		res.json(lyric);
	} catch {
		res.status(500);
	}
});

app.get("/api/calendar/", async (req, res) => {
	try {
		const t = await getToday();
		res.json(t);
	} catch {
		res.status(500);
	}
});

const port = process.env.PORT || 4242;
app.listen(4242, () => {
	console.log(`Listening at http://localhost:${port}`);
});

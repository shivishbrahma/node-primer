const express = require("express");
const { getQuotes } = require("./plugins/quotes");

const app = express();

app.use(express.static("public"));

app.get("/api/quote", async (req, res) => {
	const quote = await getQuotes();
	res.json(quote);
});

const port = process.env.PORT || 4242;
app.listen(4242, () => {
	console.log(`Listening at http://localhost:${port}`);
});

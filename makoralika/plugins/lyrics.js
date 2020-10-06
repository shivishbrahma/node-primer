const cheerio = require("cheerio");
const fetch = require("node-fetch");

class lyrics_search {
	/** @param {string} token Genius API Access Token */
	constructor(token) {
		if (!token) throw new Error("Please provide a Genius Access token!");

		/** The Genius API Access Token provided when initiating the class */
		this.token = token;
	}

	/**
	 * Get the lyrics of a song
	 * @async
	 * @param {string} text Song title or some lyrics from it
	 * @returns {Promise<Response>} The lyrics and all data provided by the Genius API
	 */
	async search(text) {
		if (!text) throw "Please provide a song title or some lyrics to search!";

		const query = await this._search(text);
		if (!query[0]) throw "Nothing found.";

		const result = query[0].result;
		const sres = await this._search_lyrics(
			result.title + " " + result.primary_artist.name
		);
		// const lyrics = await this._scrape(result.url);
		const lyrics = await this._scrape_lyrics(sres);

		return new Response(lyrics, result);
	}

	/**
	 * @private
	 */
	async _search(query) {
		let res = await fetch(`https://api.genius.com/search?q=${query}`, {
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		});

		if (res.status !== 200) return;

		res = await res.json();

		return res.response.hits;
	}

	/**
	 * Scrapes the lyrics
	 * @private
	 */
	async _scrape(url) {
		let res = await fetch(url, {
			credentials: "include",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "en;q=0.5",
				"Upgrade-Insecure-Requests": "1",
				"If-None-Match": 'W/"e691f9267e891400e3ff4f809976ed9e"',
				"Cache-Control": "max-age=0",
			},
			method: "GET",
			mode: "cors",
		});
		if (res.status !== 200) throw "Something went wrong";

		res = await res.text();

		const $ = cheerio.load(res);
		return $(".lyrics").text().trim();
	}

	async _search_lyrics(query) {
		let res = await fetch(`https://www.musixmatch.com/search/${query}`, {
			credentials: "include",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "en,en-US;q=0.5",
				"Upgrade-Insecure-Requests": "1",
				"Cache-Control": "max-age=0",
			},
			method: "GET",
			mode: "cors",
		});
		if (res.status !== 200) throw "Something went wrong";

		res = await res.text();

		const $ = cheerio.load(res);
		return `https://www.musixmatch.com${$($(".media-card-title a")[0]).attr(
			"href"
		)}`;
	}

	async _scrape_lyrics(url) {
		let res = await fetch(url, {
			credentials: "include",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "en,en-US;q=0.5",
				"Upgrade-Insecure-Requests": "1",
				"Cache-Control": "max-age=0",
			},
			method: "GET",
			mode: "cors",
		});
		if (res.status !== 200) throw "Something went wrong";

		res = await res.text();

		const $ = cheerio.load(res);
		return `${$($(".lyrics__content__ok")[0]).text()}\n${$(
			$(".lyrics__content__ok")[1]
		).text()}`;
	}
}

class Response {
	/**
	 * @param {string} lyrics
	 * @param {{}} result
	 */
	constructor(lyrics, result) {
		/** @type {string} */
		this.lyrics = lyrics;

		/**
		 * Number of annotations on this song
		 * @type {number}
		 */
		this.annotationCount = result.annotation_count;

		/** @type {string} */
		this.fullTitle = result.full_title;

		/** @type {string} */
		this.headerThumbnail = result.header_image_thumbnail_url;

		/**
		 * The link to the header image of the song on Genius
		 * @type {string}
		 */
		this.header = result.header_image_url;

		/**
		 * The song's Genius ID
		 * @type {number}
		 */
		this.id = result.id;

		/**
		 * The ID of the lyrics owner
		 * @type {number}
		 */
		this.lyricsOwnerID = result.lyrics_owner_id;

		/**
		 * Number of "pyongs" (indication of user interaction) this song has received
		 * @type {number}
		 */
		this.pyongs = result.pyongs_count;

		/** @type {string} */
		this.songArtImageThumbnail = result.song_art_image_thumbnail_url;

		/** @type {string} */
		this.songArtImage = result.song_art_image_url;

		/** Additional statistics */
		this.stats = {
			/** @type {number} */
			unreviewedAnnotations: result.stats.unreviewed_annotations,

			/** @type {boolean} */
			hot: result.stats.hot,

			/** @type {number} */
			pageviews: result.stats.pageviews,
		};

		/**
		 * The title of the song
		 * @type {string}
		 */
		this.title = result.title;

		/** @type {string} */
		this.titleWithFeatured = result.title_with_featured;

		/**
		 * The URL to the song on Genius
		 * @type {string}
		 */
		this.url = result.url;

		/** An object containing details about the primary artist of the song */
		this.primaryArtist = {
			/**
			 * The link to the Genius header image of the arist
			 * @type {string}
			 */
			header: result.primary_artist.header_image_url,

			/**
			 * The Genius ID of the artist
			 * @type {number}
			 */
			id: result.primary_artist.id,

			/**
			 * The link to the Genius profile image of the artist
			 * @type {string}
			 */
			image: result.primary_artist.image_url,

			/** @type {boolean} */
			memeVerified: result.primary_artist.is_meme_verified,

			/**
			 * Whether or not the artist is verified on Genius
			 * @type {boolean}
			 */
			verified: result.primary_artist.is_verified,

			/**
			 * The name of the artist
			 * @type {string}
			 */
			name: result.primary_artist.name,

			/**
			 * The link to the Genius profile of the artist
			 * @type {string}
			 */
			url: result.primary_artist.url,

			/**
			 * The artist's Genius IQ
			 * @type {number}
			 */
			iq: result.primary_artist.iq,
		};
	}
}

module.exports = lyrics_search;

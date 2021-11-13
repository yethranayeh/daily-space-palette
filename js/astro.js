/** @format */

const api_url = "https://api.nasa.gov/planetary/apod?thumbs=true&api_key=";
const api_key = "DEMO_KEY";

let imgSrc;

async function get_picture() {
	const response = await fetch(api_url + api_key);

	const data = await response.json();

	let { copyright, date, title, explanation, hdurl, url, media_type } = data;

	// Provide url to global imgSrc so other scripts can access it
	imgSrc = url;

	document.getElementById("picture").src = url;
	document.getElementById("title").innerText = title == null ? "Image Title" : title;
	document.getElementById("copyright").innerText = copyright == null ? "" : copyright;
	document.getElementById("date").innerText = date == null ? "" : date;
	document.getElementById("description").innerText =
		explanation == null ? "Could not retrieve image description..." : explanation;

	// If media type is image:

	// If media type is video
	// let { thumbnail_url } = data
}

get_picture();

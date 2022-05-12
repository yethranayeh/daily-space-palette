/** @format */

// Listen for promise rejection
window.addEventListener("unhandledrejection", function (promiseRejectionEvent) {
	console.log("Promise Error:", promiseRejectionEvent["promise"]);
	try {
		document.getElementById(
			"fetching-info"
		).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-exclamation-diamond" viewBox="0 0 16 16" width="48" height="48">
		<path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"></path>
		<path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"></path>
		</svg><div><span class="lead fs-5">The data could not be retrieved.</span></div>
		<div>
		<span class="lead text-center fs-5"><a class="link link-light spicy-link" href="javascript:window.location.href=window.location.href">Reload</a> the page to try again or if the issue persists, please <a class="link link-light spicy-link" href="https://github.com/yethranayeh">contact me.</a></span></div>`;
	} catch (err) {
		console.log("Tried to delete 'fetching-info':", err);
	}
});

const api_url = "https://aa-api-proxy.herokuapp.com/nasa";
// const api_url = "http://www.fakeresponse.com/";

let imgSrc;

async function get_picture() {
	const response = await fetch(api_url);

	const data = await response.json();

	let { copyright, date, title, explanation, hdurl, url, media_type } = data;

	// Provide url to global imgSrc so other scripts can access it
	imgSrc = url;
	// imgSrc = "https://picsum.photos/200/300";

	document.getElementById("picture").src = url == null ? "#" : url;
	document.getElementById("title").innerText = title == null ? "Image Title" : title;
	document.getElementById("copyright").innerText = copyright == null ? "" : copyright;
	document.getElementById("date").innerText = date == null ? "" : date;
	document.getElementById("description").innerText =
		explanation == null ? "Could not retrieve image description..." : explanation;

	// If media type is image:
	// ---
	// ---
	// If media type is video:
	// let { thumbnail_url } = data
	// ---
	// ---

	// If the data is successfully retrieved:
	// Remove the 'fetching data' text,
	document.getElementById("fetching-info").remove();
	// make the page content visible
	document.getElementById("image-section").classList.remove("d-none");
	document.getElementById("palette-section").classList.remove("d-none");
	// After data is retrieved, start generating palette:
	generate_palette();
}

get_picture();

/** @format */

function check_image_load() {
	document.getElementById("palettes").innerHTML = `
	<div class="text-center">
		<div class="spinner-border" role="status">
			<span class="sr-only invisible">Loading...</span>
		</div>
		<span class="ms-2 lead text-center">Generating palette...</span>
	</div>
	`;
	if (imgSrc) {
		console.log("Vibrant");
		try {
			Vibrant.from("https://aa-corsproxy.herokuapp.com/" + imgSrc).getPalette(function (err, palette) {
				// Get keys from palette
				if (err) {
					// console.log("Err:", err);
					var timeleft = 15;
					document.getElementById("palettes").innerHTML = `
							<p id="timer" class="lead text-center">The palette could not be generated. Trying again in ${timeleft} seconds...</p>
							<p class="lead text-center">It is usually caused by APOD API's Cross-Origin policy. As a work-around, a proxy server with a <strong>rate-limit</strong> is used. If the issue persists, please <a href="https://github.com/yethranayeh" class="link-light">contact me.</a></p>
							`;
					var downloadTimer = setInterval(function () {
						if (timeleft <= 0) {
							clearInterval(downloadTimer);
							setTimeout(check_image_load(), 1000);
						} else {
							document.getElementById(
								"timer"
							).innerHTML = `The palette could not be generated. Trying again in ${timeleft} seconds...`;
							timeleft -= 1;
						}
					}, 1000);
				} else {
					let keys = Object.keys(palette);
					// console.log(keys);

					counter = 1;

					// Container of all palettes
					palettesDOM = document.getElementById("palettes");

					// Base card section
					card = `
					<div class="col-12 col-sm-6 my-4 mx-auto">
						<article x-data="{ label: 'HEX', color: '' }" class="card text-dark bg-light">
							<div class="card-header">
								<div class="form-check form-switch">
									<input @click="label = (label == 'RGB') ? 'HEX':'RGB'" class="form-check-input" type="checkbox" id="HEXorRGB_${counter}" autocomplete="off" />
									<label x-text="label + color" class="form-check-label" for="HEXorRGB_${counter}">HEX or RGB</label>
								</div>
							</div>
							<div id="palette_${counter}" class="card-body palette-text mx-auto">
							</div>
						</article>
					</div>
					`;

					palettesDOM.innerHTML = card;

					// For each key (a shade of color)
					for (const key of keys) {
						// If the key is not null
						if (palette[key]) {
							// RGB Array with values of the color
							rgb_array = Object.values(palette[key]);

							// Convert RGB to HEX
							// Code borrowed from Michal Perlakowski on Stack Overflow
							const rgbToHex = (r, g, b) => "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

							hex = rgbToHex(rgb_array[0][0], rgb_array[0][1], rgb_array[0][2]);

							// HTML blocks for each shade of color
							color_block = `
							<div
								@mouseover="color = ' | ' + '${key}'"
								@mouseout="color = ''"
								class="border rounded pt-3"
								style="background-color: ${hex}; height: 80px; width: 80px; display: inline-block"
							>
								<div class="row">
									<div class="col text-center text-wrap">
										<div 
											x-data="{copyIcon: ' bi bi-files'}"
											@click="navigator.clipboard.writeText((label == 'HEX') ? '${hex}':'${rgb_array[0]}'); copyIcon = ' bi bi-check2'"
											@mouseout="copyIcon = ' bi bi-files'"
											class="copy-color">
												<i :class="copyIcon"></i>
												Copy
											</div>
				
										<p x-text="(label == 'HEX') ? '${hex}':'${rgb_array[0]}'" class="mx-auto mt-1 fw-light">#</p>
									</div>
								</div>
							</div>
							`;

							// Get palette container
							const paletteDOM = document.getElementById(`palette_${counter}`);

							// Insert color blocks to palette
							paletteDOM.innerHTML = paletteDOM.innerHTML + color_block;
						}
					}
				}
			});
		} catch (error) {
			alert(
				"There was an error while generating the palette. Please forward this error to me at github.com/yethranayeh :",
				error
			);
			console.log("Caught error:", error);
		}
	} else {
		console.log("Timeout");
		window.setTimeout(check_image_load, 5000);
	}
}

check_image_load();

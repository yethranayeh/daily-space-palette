/** @format */

// Vibrant.from("https://picsum.photos/id/62/600/100")
Vibrant.from("sur.jpg").getPalette(function (err, palette) {
	// Get keys from palette
	console.log("Err:", err);
	let keys = Object.keys(palette);
	console.log(keys);

	counter = 1;

	// Container of all palettes
	palettesDOM = document.getElementById("palettes");

	// Base card section
	card = `
    <div class="col-12 col-sm-6 my-4 mx-auto">
        <article class="card text-dark bg-light">
            <div class="card-header">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="HEXorRGB" autocomplete="off" checked />
                    <label class="form-check-label" for="HEXorRGB"> HEX </label>
                </div>
            </div>
            <div id="palette_${counter}" class="card-body palette-text mx-auto">
            </div>
        </article>
    </div>
    `;

	palettesDOM.innerHTML = palettesDOM.innerHTML + card;

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

			// Get palette container
			const paletteDOM = document.getElementById(`palette_${counter}`);

			// Insert color to DOM
			paletteDOM.innerHTML =
				paletteDOM.innerHTML +
				`
            <div
                class="border rounded pt-3"
                style="background-color: ${hex}; height: 80px; width: 80px; display: inline-block"
            >
                <div class="row">
                    <div class="col text-center">
                        <div class="fw-light copy-color"><i class="bi bi-files mx-1"></i>Copy</div>

                        <p class="mx-auto mt-1">${hex}</p>
                    </div>
                </div>
            </div>
            `;
			/*
			paletteDOM.innerHTML =
				paletteDOM.innerHTML +
				`<div
                    class="mx-auto border-top border-bottom border-white fw-light" 
                    style="background-color: ${hex};height: 80px; width: 80px; display: inline-block;" 
                    title="${key}"
                >
                    <div class="row my-1 px-2">
                        <div class="col">
                            <div class="form-check form-switch">
                                <input 
                                    class="form-check-input" 
                                    type="checkbox" 
                                    id="HEXorRGB"
                                    checked
                                    autocomplete="off"
                                >

                                <label 
                                class="form-check-label" 
                                for="HEXorRGB"
                                >
                                    HEX
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <i class="bi bi-files"></i>
                            <i class="bi bi-check-square"></i>
                            <span id="HEXorRGBText">${hex}</span>
                        </div>
                    </div>						
                </div>`;
                */
		}
	}
});

// If switch is checked, replace HEX with RGB values

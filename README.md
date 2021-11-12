# Daily Space Palette
This is a simple web project that fetches the Astronomy Picture of the Day using [NASA's API](https://api.nasa.gov/?ref=public-apis#browseAPI), then generates a color palette from that picture.

This project is a proof of concept to offer the option for designers or developers to have an automatically generated color palette that derives from the Astronomy Picture of the Day. It can be used to dynamically change space related colors on a web page or in any other feasible applications.

## Technologies used:
* `APOD API` - to fetch the [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html) and its details.
* `node-vibrant` - to [generate](https://github.com/Vibrant-Colors/node-vibrant) the color palette

## Known Issues:
* Currently, the data fetched using `APOD API` is used to display the content on the page without any problems. *However*, when feeding the same image URL to `node-vibrant`, a CORS policy error is received.
  * As a *temporary* work-around, [cors-anywhere](https://cors-anywhere.herokuapp.com/) demo proxy is being used, which is not reliable, as it can stop working at times. I plan to deploy my own  proxy to fix the issue completely.
* At this time, the project *does not* display videos nor fetch their thumbnails. This will be fixed soon.

## Features to be added:
* Currently, the image displayed on the page is a *lower* resolution of the original. There will be an option to view the HD version of the image.
* There is only a single palette generated from the image, which acts as the primary palette. *However*, I plan to add multiple palettes that will be a derivative of the original color palette of the image to offer alternatives to users.
* I may or may not make the page more attractive in the future :)

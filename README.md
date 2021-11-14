# Daily Space Palette
![](https://i.ibb.co/rZpX39B/Screenshot-2021-11-14-at-16-20-25-Daily-Space-Palette.png)
This is a simple web project that fetches the Astronomy Picture of the Day using [NASA's API](https://api.nasa.gov/?ref=public-apis#browseAPI), then generates a color palette from that picture.

The project is a proof of concept to offer the option for designers or developers to have an automatically generated color palette that derives from the Astronomy Picture of the Day. It can be used to dynamically change space related colors on a web page or in any other feasible applications.

## Technologies used:
* `APOD API` - to fetch the [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html) and its details.
* `node-vibrant` - to [generate](https://github.com/Vibrant-Colors/node-vibrant) the color palette.
* `simplex-noise` - for the [animated background](https://github.com/jwagner/simplex-noise.js) of the page.

## Known Issues:
* At this time, the project *does not* display videos nor fetch their thumbnails. This will be fixed soon.
* ~~The project currently uses the `DEMO_KEY` for API calls, which is not realiable as it often stops working after *too many requests*.~~
* When description collapses, paragraph flickers before disappearing.
* ~~If a color's RGB value consists of 3 digits for **Red**, **Green** and **Blue**, the text overflows the color block~~


## Features to be added:
* Currently, the image displayed on the page is a *lower* resolution of the original. There will be an option to view the HD version of the image.
* There is only a single palette generated from the image, which acts as the primary palette. *However*, I plan to add multiple palettes that will be a derivative of the original color palette of the image to offer alternatives to users.


## Credits
The background animation used in the project is integrated from [Sean Free](https://tympanus.net/codrops/author/sean/)'s open source demo at [Codrops](https://tympanus.net/codrops/).

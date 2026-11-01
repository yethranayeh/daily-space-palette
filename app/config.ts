export const APOD_API_URL = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";
export const BACKGROUND_COLOR_SHADES = ["DarkVibrant", "Vibrant", "DarkMuted"];

// ? NASA's CDN honors ?w= on /dynamicimage/ paths, and some days ship a 6000px
//   original that weighs over 2MB for a slot that renders under 900px
export const APOD_IMAGE_MAX_WIDTH = 1600;

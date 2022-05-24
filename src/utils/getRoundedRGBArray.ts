/** @format */

export function getRoundedRGBArray(rgbArr: any) {
	const roundedRGBArray = [];
	for (let i = 0; i < 3; i++) {
		roundedRGBArray.push(Math.round(rgbArr[i]));
	}
	return roundedRGBArray;
}

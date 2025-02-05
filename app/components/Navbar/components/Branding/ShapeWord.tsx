import { ShapeLetter } from "./ShapeLetter/ShapeLetter";

export const ShapeWord = ({ word }: { word: string }) => (
	<span className='inline-flex'>
		{word.split("").map((letter, i) => (
			<ShapeLetter key={letter + i} letter={letter} />
		))}
	</span>
);

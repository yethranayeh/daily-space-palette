import "./shapes.css";

export function ShapeLetter({ letter }: { letter: string }) {
	if (letter === " ") return <div style={{ minWidth: "4ch" }} />;
	return <div className={`relative letter letter-${letter.toLowerCase()} w-8 h-8 md:w-11 md:h-11 lg:w-14 lg:h-14`} />;
}

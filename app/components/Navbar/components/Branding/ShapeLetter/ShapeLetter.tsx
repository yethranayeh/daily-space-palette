import "./shapes.css";

export function ShapeLetter({ letter }: { letter: string }) {
	if (letter === " ") return <div style={{ minWidth: "4ch" }} />;
	return <div className={`letter letter-${letter.toLowerCase()}`} />;
}

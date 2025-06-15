"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { toast } from "@/app/hooks/use-toast";
import type { PlainPalette } from "./utils/convertPaletteToPlainObjectArray";
import { ExportFormat, exportPalette } from "./utils/exportPalette";

// TODO: refactor
export function Palette({ colors }: { colors: Array<PlainPalette> }) {
	const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

	const copyToClipboard = (text: string, index: number) => {
		navigator.clipboard.writeText(text);
		setCopiedIndex(index);

		toast({
			title: "Color copied!",
			description: `${text} has been copied to clipboard.`,
			duration: 2000
		});

		setTimeout(() => {
			setCopiedIndex(null);
		}, 2000);
	};

	const getExportHandlerFor = (format: ExportFormat) => () =>
		exportPalette(format, colors, (filename) =>
			toast({
				title: "Palette exported!",
				description: `Your space palette has been exported as "${filename}".`,
				duration: 3000
			})
		);

	return (
		<div className='space-y-4'>
			{/* Color Swatches Grid */}
			<div className='grid grid-cols-3 gap-3'>
				{colors.map((color, index) => (
					<TooltipProvider key={color.name}>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									className='relative h-20 rounded-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20'
									style={{ backgroundColor: color.hex }}
									onClick={() => copyToClipboard(color.hex, index)}>
									{copiedIndex === index && (
										<div className='absolute inset-0 flex items-center justify-center bg-black/30 rounded-md'>
											<Check className='h-6 w-6 text-white' />
										</div>
									)}
								</button>
							</TooltipTrigger>
							<TooltipContent>
								<div className='text-xs'>
									<p className='font-semibold'>{color.name}</p>
									<p>{color.hex}</p>
									<p className='text-zinc-400'>Click to copy</p>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				))}
			</div>

			{/* Format Tabs */}
			<Tabs defaultValue='hex' className='w-full'>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='hex'>HEX</TabsTrigger>
					<TabsTrigger value='rgb'>RGB</TabsTrigger>
					<TabsTrigger value='hsl'>HSL</TabsTrigger>
				</TabsList>

				<TabsContent value='hex' className='space-y-2 mt-2'>
					{colors.map((color, index) => (
						<div key={color.name} className='flex items-center justify-between bg-black/20 p-2 rounded-md'>
							<div className='flex items-center'>
								<div className='w-4 h-4 rounded-full mr-2' style={{ backgroundColor: color.hex }}></div>
								<span className='text-sm'>{color.hex}</span>
							</div>
							<Button
								variant='ghost'
								size='sm'
								className='h-7 w-7 p-0'
								onClick={() => copyToClipboard(color.hex, index + 100)}>
								<Copy className='h-3 w-3' />
							</Button>
						</div>
					))}
				</TabsContent>

				<TabsContent value='rgb' className='space-y-2 mt-2'>
					{colors.map((color, index) => {
						const rgb = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;

						return (
							<div key={color.name} className='flex items-center justify-between bg-black/20 p-2 rounded-md'>
								<div className='flex items-center'>
									<div className='w-4 h-4 rounded-full mr-2' style={{ backgroundColor: color.hex }}></div>
									<span className='text-sm'>{rgb}</span>
								</div>
								<Button
									variant='ghost'
									size='sm'
									className='h-7 w-7 p-0'
									onClick={() => copyToClipboard(rgb, index + 200)}>
									<Copy className='h-3 w-3' />
								</Button>
							</div>
						);
					})}
				</TabsContent>

				<TabsContent value='hsl' className='space-y-2 mt-2'>
					{colors.map((color, index) => {
						const hsl = `hsl(${Math.round(color.hsl.h * 360)}, ${Math.round(color.hsl.s * 100)}%, ${Math.round(
							color.hsl.l * 100
						)}%)`;

						return (
							<div key={color.name} className='flex items-center justify-between bg-black/20 p-2 rounded-md'>
								<div className='flex items-center'>
									<div className='w-4 h-4 rounded-full mr-2' style={{ backgroundColor: color.hex }}></div>
									<span className='text-sm'>{hsl}</span>
								</div>
								<Button
									variant='ghost'
									size='sm'
									className='h-7 w-7 p-0'
									onClick={() => copyToClipboard(hsl, index + 300)}>
									<Copy className='h-3 w-3' />
								</Button>
							</div>
						);
					})}
				</TabsContent>
			</Tabs>

			{/* Export Buttons */}
			<div className='flex justify-end gap-2 pt-4 border-t border-space-border/30'>
				<Button variant='ghost' size='sm' className='text-xs' onClick={getExportHandlerFor("css")}>
					<Download className='h-3 w-3 mr-1' />
					CSS Variables
				</Button>
				<Button variant='ghost' size='sm' className='text-xs' onClick={getExportHandlerFor("tailwind")}>
					<Download className='h-3 w-3 mr-1' />
					Tailwind
				</Button>
				<Button variant='ghost' size='sm' className='text-xs' onClick={getExportHandlerFor("json")}>
					<Download className='h-3 w-3 mr-1' />
					JSON
				</Button>
			</div>
		</div>
	);
}

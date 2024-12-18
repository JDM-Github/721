import React, { useState } from "react";
import { ChromePicker } from "react-color";

export default function ToolComponent({
	color,
	handleColorChange,
	handleImageUpload,
	handleAvailableImageUpload,
	handleLabelUpload,
	setSelectedPattern,
	selectedPattern,
	setActiveImage,
	updateImagePattern,
	backgroundColor,
	setBackgroundColor,
}) {
	const [activeTool, setActiveTool] = useState<string | null>(null); // Track the active tool

	return (
		<div>
			<div className="fixed top-1/2 right-0 transform -translate-y-1/2 flex flex-col space-y-4 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-lg p-2">
				<div
					className="cursor-pointer flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full"
					onClick={() => {
						if (activeTool === "colorPicker") setActiveTool(null);
						else setActiveTool("colorPicker");
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-orange-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M15 10l4.553-4.553a2 2 0 10-2.828-2.828L10 7.172m4.828 4.828L9.414 16H7v-2.414l5.414-5.414m5.828-2.828a2 2 0 112.828 2.828L16 10"
						/>
					</svg>
				</div>
				<div
					className="cursor-pointer flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full"
					onClick={() => {
						if (activeTool === "imageUpload") setActiveTool(null);
						else setActiveTool("imageUpload");
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-blue-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</div>

				<div
					className="cursor-pointer flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full"
					onClick={() => {
						setActiveTool(null);
						handleLabelUpload();
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-purple-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6h16M12 6v12"
						/>
					</svg>
				</div>

				{/* Pattern Tool */}
				<div
					className="cursor-pointer flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full"
					onClick={() => {
						if (activeTool === "pattern") setActiveTool(null);
						else setActiveTool("pattern");
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-yellow-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M3 3h18v18H3V3zm3 3h12v12H6V6z"
						/>
					</svg>
				</div>

				<div
					className="cursor-pointer flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full"
					onClick={() => {
						if (activeTool === "background") setActiveTool(null);
						else setActiveTool("background");
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-blue-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M19 10L4 10l5-5L9 2a1 1 0 011.414 0l1.172 1.172a1 1 0 010 1.414L10 6l5 5h4zm0 2h-2a3 3 0 010-6h2a3 3 0 010 6zm-3.5 4a1.5 1.5 0 01-3 0V16h-1v4h5v-4h-1v1z"
						/>
					</svg>
				</div>

				<div
					className="cursor-pointer flex items-center justify-center w-12 h-12 bg-red-100 rounded-full"
					onClick={() => {
						setActiveTool(null);
						setActiveImage(null);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6 text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<circle cx="12" cy="12" r="10" strokeWidth="2" />
						<line
							x1="8"
							y1="8"
							x2="16"
							y2="16"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<line
							x1="8"
							y1="16"
							x2="16"
							y2="8"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			</div>

			{activeTool === "background" && (
				<div className="fixed top-1/2 right-20 transform -translate-y-1/2 bg-white shadow-xl rounded-lg p-4 w-auto">
					<h3 className="text-xl font-semibold text-gray-700 mb-2">
						Background Color Picker
					</h3>
					<ChromePicker
						color={backgroundColor}
						onChange={(updatedColor) =>
							setBackgroundColor(updatedColor.hex)
						}
						disableAlpha
						className="mt-2"
					/>
				</div>
			)}

			{activeTool === "colorPicker" && (
				<div className="fixed top-1/2 right-20 transform -translate-y-1/2 bg-white shadow-xl rounded-lg p-4 w-auto">
					<h3 className="text-xl font-semibold text-gray-700 mb-2">
						Color Picker
					</h3>
					<ChromePicker
						color={color}
						onChange={(updatedColor) =>
							handleColorChange(updatedColor.hex)
						}
						disableAlpha
						className="mt-2"
					/>
				</div>
			)}

			{activeTool === "imageUpload" && (
				<div className="fixed top-1/2 right-20 transform -translate-y-1/2 bg-white shadow-xl rounded-lg p-4 w-64">
					<h3 className="text-xl font-semibold text-gray-700 mb-2">
						Upload Image
					</h3>
					{/* File Upload */}
					<input
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
						className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
					/>

					{/* Pre-uploaded Images */}
					<div className="mt-4">
						<h4 className="text-lg font-medium text-gray-600 mb-2">
							Available Images
						</h4>
						<div
							className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto"
							style={{
								scrollbarWidth: "thin",
								scrollbarColor: "#ddd transparent",
							}}
						>
							{[
								"https://res.cloudinary.com/djheiqm47/image/upload/v1733352515/earth_rdnnyv.png",
								"https://res.cloudinary.com/djheiqm47/image/upload/v1733352514/ape_oqibfa.png",
								"https://res.cloudinary.com/djheiqm47/image/upload/v1733352514/cars_fycd6r.png",
								"https://res.cloudinary.com/djheiqm47/image/upload/v1733352513/bulls_qsknzx.png",
								"https://res.cloudinary.com/djheiqm47/image/upload/v1733352513/alien_b8x8dr.png",
								"https://res.cloudinary.com/djheiqm47/image/upload/v1733352512/apple_ljjpmd.png",
							].map((image, index) => (
								<img
									key={index}
									src={image}
									alt={`Pre-uploaded ${index}`}
									className="w-14 h-14 object-cover rounded-lg cursor-pointer border-2 hover:border-orange-500"
									onClick={() =>
										handleAvailableImageUpload(image)
									}
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{activeTool === "pattern" && (
				<div
					className="fixed top-1/2 right-20 transform -translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-80 border"
					style={{ zIndex: 100 }}
				>
					<h3 className="text-lg font-semibold text-gray-700 mb-3">
						Select a Pattern
					</h3>
					<div
						className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto"
						style={{
							scrollbarWidth: "thin",
							scrollbarColor: "#ddd transparent",
						}}
					>
						{[
							"https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/1280px-HD_transparent_picture.png",
							"https://res.cloudinary.com/djheiqm47/image/upload/v1733352242/1_l6cehd.png",
							"https://res.cloudinary.com/djheiqm47/image/upload/v1733352242/3_q2gpsd.png",
							"https://res.cloudinary.com/djheiqm47/image/upload/v1733352241/4_jvjwc9.png",
						].map((image, index) => (
							<img
								key={index}
								src={image}
								alt={`Pre-uploaded ${index}`}
								className="w-14 h-14 object-cover rounded-lg cursor-pointer border-2 hover:border-orange-500"
								onClick={() =>
									updateImagePattern("", { img: image })
								}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

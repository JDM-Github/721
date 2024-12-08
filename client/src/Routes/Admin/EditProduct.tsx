import React, { useEffect, useState, useRef } from "react";
import RequestHandler from "../../Functions/RequestHandler";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { CirclePicker, ChromePicker } from "react-color";
import ProductImageWithLogo from "../../Component/ProductImageWithLogo.tsx";
import ToolComponent from "../../Component/ToolComponent.tsx";
import ImageComponent from "../../Component/ImageComponent.tsx";
import LabelComponent from "../../Component/LabelComponent.tsx";

interface Product {
	id: string;
	productImage: string;
	productName: string;
	price: [number];
	status: string;
	stocks: number;
	size: [string];
	description: string;
	availableColors: [string];
	patterns: [string];
}

interface ImageComp {
	uniqueId: string;
	img: string | File;
	x: number;
	y: number;
	pixelx: number;
	pixely: number;
	width: number;
	height: number;
	widthPercent: number;
	heightPercent: number;
	isActive: boolean;
}

interface LabelComp {
	uniqueId: string;
	x: number;
	y: number;
	pixelx: number;
	pixely: number;
	width: number;
	height: number;
	widthPercent: number;
	heightPercent: number;
	isActive: boolean;
	text: string;
}

const EditPageRoute: React.FC = () => {
	interface User {
		id: string;
	}
	const location = useLocation();
	const { order } = location.state || {};
	interface User {
		id: string;
	}
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		const userDetails = JSON.parse(localStorage.getItem("user") ?? "{}");
		setUser(userDetails);
	}, []);
	const navigate = useNavigate();
	const [color, setColor] = useState<string>(order.customization.color);
	const [pattern, setPattern] = useState<string>(order.customization.pattern);
	const [customName, setCustomName] = useState<string>(
		order.customization.customName
	);
	const [customNumber, setCustomNumber] = useState<string>(
		order.customization.customNumber
	);
	const [quantity, setQuantity] = useState<number>(order.quantity);
	const [notes, setNotes] = useState<string>(order.customization.notes);
	const [selectedSize, setSelectedSize] = useState<string | null>(
		order.customization.selectedSize
	);
	const [product, setProduct] = useState<Product>(order.Product);
	const [activeImage, setActiveImage] = useState(null);

	const [imageComponents, setImageComponents] = useState<ImageComp[]>(
		order.customization.image
	);
	const [labelComponents, setLabelComponents] = useState<LabelComp[]>(
		order.customization.label
	);
	const updateImageComponent = (uniqueId, updatedProperties) => {
		setImageComponents((prevComponents) =>
			prevComponents.map((comp) =>
				comp.uniqueId === uniqueId
					? { ...comp, ...updatedProperties }
					: comp
			)
		);
	};
	const updateLabelComponent = (uniqueId, updatedProperties) => {
		setLabelComponents((prevComponents) =>
			prevComponents.map((comp) =>
				comp.uniqueId === uniqueId
					? { ...comp, ...updatedProperties }
					: comp
			)
		);
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Delete" && activeImage) {
				setImageComponents((prevComponents) =>
					prevComponents.map((comp) =>
						comp.uniqueId === activeImage
							? { ...comp, isActive: false }
							: comp
					)
				);
				setLabelComponents((prevComponents) =>
					prevComponents.map((comp) =>
						comp.uniqueId === activeImage
							? { ...comp, text: "" }
							: comp
					)
				);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [activeImage, setImageComponents]);

	// const [labelComponents, setLabelComponents] = useState([
	// 	{
	// 		uniqueId: "label-1",
	// 		img: "https://res.cloudinary.com/djheiqm47/image/upload/v1732351893/jersey-sando_k1rsab.png",
	// 		x: 20,
	// 		y: 20,
	// 		pixelx: 20,
	// 		pixely: 20,
	// 		width: 10,
	// 		height: 10,
	// 		widthPercent: 0.1,
	// 		heightPercent: 0.1,
	// 		text: "TEST",
	// 	},
	// ]);

	// useEffect(() => {
	// 	const handleKeyDown = (event: KeyboardEvent) => {
	// 		if (event.key === "Delete" && activeImage) {
	// 			setImageComponents((prevComponents) =>
	// 				prevComponents.map((comp) =>
	// 					comp.uniqueId === activeImage
	// 						? { ...comp, isActive: false }
	// 						: comp
	// 				)
	// 			);
	// 		}
	// 	};

	// 	window.addEventListener("keydown", handleKeyDown);
	// 	return () => {
	// 		window.removeEventListener("keydown", handleKeyDown);
	// 	};
	// }, [activeImage, setImageComponents]);

	// const saveData = async () => {
	// 	// const id = product?.id;
	// 	// const toastId = toast.loading("Saving your customization...");
	// 	// let logoURL = "";
	// 	// if (logo && logo instanceof File) {
	// 	// 	const formData = new FormData();
	// 	// 	formData.append("file", logo);
	// 	// 	try {
	// 	// 		const data = await RequestHandler.handleRequest(
	// 	// 			"post",
	// 	// 			"file/upload-image",
	// 	// 			formData,
	// 	// 			{
	// 	// 				headers: {
	// 	// 					"Content-Type": "multipart/form-data",
	// 	// 				},
	// 	// 			}
	// 	// 		);
	// 	// 		if (data.success) {
	// 	// 			logoURL = data.uploadedDocument;
	// 	// 		} else {
	// 	// 			toast.update(toastId, {
	// 	// 				render: data.message,
	// 	// 				type: "error",
	// 	// 				isLoading: false,
	// 	// 				autoClose: 3000,
	// 	// 			});
	// 	// 			return;
	// 	// 		}
	// 	// 	} catch (error) {
	// 	// 		console.error("Error submitting the document:", error);
	// 	// 		toast.update(toastId, {
	// 	// 			render: "Error submitting the document",
	// 	// 			type: "error",
	// 	// 			isLoading: false,
	// 	// 			autoClose: 3000,
	// 	// 		});
	// 	// 		return;
	// 	// 	}
	// 	// } else {
	// 	// 	logoURL = logo ? logo : "";
	// 	// }
	// 	// const dataToSave = {
	// 	// 	id,
	// 	// 	color,
	// 	// 	pattern,
	// 	// 	customName,
	// 	// 	customNumber,
	// 	// 	notes,
	// 	// 	selectedSize,
	// 	// 	product,
	// 	// };
	// 	// try {
	// 	// 	const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
	// 	// 		type: "application/json",
	// 	// 	});
	// 	// 	saveAs(blob, `customization-${id || "unknown"}.json`);
	// 	// 	toast.update(toastId, {
	// 	// 		render: "Customization saved successfully!",
	// 	// 		type: "success",
	// 	// 		isLoading: false,
	// 	// 		autoClose: 3000,
	// 	// 	});
	// 	// } catch (error) {
	// 	// 	console.error("Error saving the file:", error);
	// 	// 	toast.update(toastId, {
	// 	// 		render: "Failed to save customization.",
	// 	// 		type: "error",
	// 	// 		isLoading: false,
	// 	// 		autoClose: 3000,
	// 	// 	});
	// 	// }
	// };

	// const loadData = async (file: File) => {
	// 	// try {
	// 	// 	const fileText = await file.text();
	// 	// 	const loadedData = JSON.parse(fileText);
	// 	// 	if (!loadedData.product) {
	// 	// 		toast.error("Invalid Design and Product");
	// 	// 		return;
	// 	// 	}
	// 	// 	if (loadedData.product.id !== product?.id) {
	// 	// 		toast.error(
	// 	// 			"Invalid Design for this Product. Please use the same product"
	// 	// 		);
	// 	// 		return;
	// 	// 	}
	// 	// 	setLoadedData(null);
	// 	// 	setColor(loadedData.color || "");
	// 	// 	setPattern(loadedData.pattern || "");
	// 	// 	setCustomName(loadedData.customName || "");
	// 	// 	setCustomNumber(loadedData.customNumber || "");
	// 	// 	setNotes(loadedData.notes || "");
	// 	// 	setSelectedSize(loadedData.selectedSize || null);
	// 	// 	toast.success("Successfully loaded design");
	// 	// } catch (error) {
	// 	// 	console.error("Error loading file:", error);
	// 	// 	toast.error("Failed to load data from file.");
	// 	// }
	// };

	const editToCart = async () => {
		if (!user || Object.keys(user).length === 0) {
			toast.error("Please log in to save your order.");
			return;
		}

		const toastId = toast.loading("Editing customized product...");

		const processedImage = await Promise.all(
			imageComponents.map(async (component) => {
				if (component.img && component.img instanceof File) {
					let imageUrl = "";
					const formData = new FormData();
					formData.append("file", component.img);
					try {
						const data = await RequestHandler.handleRequest(
							"post",
							"file/upload-image",
							formData,
							{
								headers: {
									"Content-Type": "multipart/form-data",
								},
							}
						);
						if (data.success) {
							imageUrl = data.uploadedDocument;
						} else {
							toast.update(toastId, {
								render: data.message,
								type: "error",
								isLoading: false,
								autoClose: 3000,
							});
							return null;
						}
					} catch (error) {
						console.error("Error submitting the document:", error);
						toast.update(toastId, {
							render: "Error submitting the document",
							type: "error",
							isLoading: false,
							autoClose: 3000,
						});
					}
					return {
						...component,
						imgFileUrl: imageUrl,
						img: imageUrl,
					};
				}
				return component;
			})
		);
		const validImageComponents = processedImage.filter(
			(component) => component !== null
		);
		const validLabelComponents = labelComponents.filter(
			(component) => component.text !== ""
		);

		const customization = {
			id: order.productId,
			color,
			pattern,
			customName,
			customNumber,
			notes,
			selectedSize,
			product,
			image: validImageComponents,
			label: validLabelComponents,
		};
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"product/edit-to-cart",
				{
					id: order.id,
					customization,
					quantity,
				}
			);
			if (data.success) {
				navigate("/cart");
				toast.update(toastId, {
					render: "Customized Order edited successfully!",
					type: "success",
					isLoading: false,
					autoClose: 3000,
				});
			} else {
				toast.update(toastId, {
					render: data.message,
					type: "error",
					isLoading: false,
					autoClose: 3000,
				});
				return;
			}
		} catch (error) {
			console.error("Error editing customized order:", error);
			toast.update(toastId, {
				render: "Error editing customized order.",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
			return;
		}
	};

	const [loading, setLoading] = useState(false);
	const handleSizeChange = (size: string) => setSelectedSize(size);
	const handleColorChange = (value: string) => setColor(value);
	const handlePatternChange = (value: string) => setPattern(value);

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			setImageComponents((prevComponents) => {
				const newImageId = `image-${prevComponents.length + 1}`;
				return [
					...prevComponents,
					{
						uniqueId: newImageId,
						img: file,
						imgFileUrl: URL.createObjectURL(file),
						width: 50,
						height: 50,
						widthPercent: 0.1,
						heightPercent: 0.1,
						x: 0,
						y: 0,
						pixelx: 500,
						pixely: 500,
						isActive: true,
					},
				];
			});
		}
	};
	const handleLabelUpload = () => {
		setLabelComponents((prevComponents) => {
			const newLabelId = `label-${Date.now()}-${Math.random()}`;
			return [
				...prevComponents,
				{
					uniqueId: newLabelId,
					width: 50,
					height: 50,
					widthPercent: 0.1,
					heightPercent: 0.1,
					x: 0,
					y: 0,
					pixelx: 0,
					pixely: 0,
					isActive: true,
					text: "TEXT",
				},
			];
		});
	};

	const handleAddToCart = () => editToCart();
	// const handleDownloadDesign = () => saveData();
	// const handleLoadDesign = () =>
	// 	document.getElementById("fileInput")?.click();

	const containerRef = useRef<HTMLImageElement | null>(null);
	return (
		<div className="bg-gray-50 flex justify-center items-center py-8 px-4">
			{loading ? (
				<div className="col-span-full flex justify-center items-center min-h-[80vh]">
					<div className="text-orange-500 font-semibold text-lg">
						Loading...
					</div>
				</div>
			) : product === null ? (
				<div className="col-span-full text-center text-gray-500 text-xl min-h-[80vh]">
					Invalid Product
				</div>
			) : (
				<div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Left Side: Product Image */}
					<div className="flex flex-col justify-between h-[60vh] overflow-y-hidden px-4 scrollbar-thin border border-gray-300 z-100">
						<div className="relative flex">
							<div
								className="w-full h-full max-h-[60vh]"
								ref={containerRef}
							>
								<ProductImageWithLogo
									color={color}
									product={product}
									selectedPattern={pattern}
								/>
							</div>
							{labelComponents.map((labelComp, index) => (
								<LabelComponent
									key={labelComp.uniqueId}
									containerRef={containerRef}
									labelComp={labelComp}
									uniqueId={labelComp.uniqueId}
									activeImage={activeImage}
									setActiveImage={setActiveImage}
									updateLabelComponent={updateLabelComponent}
								/>
							))}
							{imageComponents.map((imageComp, index) => (
								<ImageComponent
									key={imageComp.uniqueId}
									containerRef={containerRef}
									imageComp={imageComp}
									uniqueId={imageComp.uniqueId}
									activeImage={activeImage}
									setActiveImage={setActiveImage}
									updateImageComponent={updateImageComponent}
								/>
							))}
						</div>
					</div>

					{/* Right Side: Editing Section */}
					<div className="flex flex-col justify-between h-[70vh] overflow-y-auto px-4 scrollbar-thin border border-gray-300">
						<div className="space-y-6">
							<ToolComponent
								color={color}
								handleColorChange={handleColorChange}
								handleImageUpload={handleImageUpload}
								handleLabelUpload={handleLabelUpload}
								selectedPattern={pattern}
								setSelectedPattern={handlePatternChange}
								setActiveImage={setActiveImage}
							/>

							<div className="mb-8">
								<h3 className="text-xl font-semibold text-gray-700 mb-3">
									Available Sizes
								</h3>
								<div className="flex space-x-2">
									{product?.size.map((size) => (
										<button
											key={size}
											onClick={() =>
												handleSizeChange(size)
											}
											className={`px-4 py-2 rounded-lg border ${
												selectedSize === size
													? "bg-orange-500 text-white border-orange-500"
													: "bg-white text-gray-800 border-gray-300 hover:border-orange-500"
											} transition duration-200`}
										>
											{size}
										</button>
									))}
								</div>
							</div>

							<div className="flex flex-col space-y-4">
								<input
									type="text"
									placeholder="Enter Custom Name"
									value={customName}
									onChange={(e) =>
										setCustomName(e.target.value)
									}
									className="p-3 border border-gray-300 rounded-lg"
								/>
								<input
									type="text"
									placeholder="Enter Custom Number"
									value={customNumber}
									onChange={(e) =>
										setCustomNumber(e.target.value)
									}
									className="p-3 border border-gray-300 rounded-lg"
								/>
							</div>

							<div className="flex flex-col space-y-2">
								<input
									type="number"
									value={quantity}
									min="1"
									max={product?.stocks}
									onChange={(e) =>
										setQuantity(
											!product
												? 0
												: Math.min(
														parseInt(
															e.target.value
														),
														product?.stocks
												  )
										)
									}
									className="p-3 border border-gray-300 rounded-lg w-32"
									placeholder="Quantity"
								/>
								<p className="text-sm text-gray-500">
									Max available: {product?.stocks}
								</p>
							</div>

							<textarea
								placeholder="Additional notes (optional)"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="p-3 border border-gray-300 rounded-lg resize-none w-full"
								rows={3}
							/>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6 mb-3">
							<button
								// onClick={handleDownloadDesign}
								className="w-full sm:w-1/3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
							>
								Download Design
							</button>
							<button
								// onClick={handleLoadDesign}
								className="w-full sm:w-1/3 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
							>
								Load Design
							</button>
							<button
								onClick={handleAddToCart}
								className="w-full sm:w-1/3 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
							>
								Save Edit
							</button>
							<button
								onClick={() => {
									navigate("/cart");
								}}
								className="w-full sm:w-1/3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
							>
								Cancel Edit
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default EditPageRoute;

import React, { useEffect, useState, useRef } from "react";
import RequestHandler from "../../Functions/RequestHandler";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { CirclePicker, ChromePicker } from "react-color";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import ProductImageWithLogo from "../../Component/ProductImageWithLogo.tsx";
import ToolComponent from "../../Component/ToolComponent.tsx";
import ImageComponent from "../../Component/ImageComponent.tsx";
import LabelComponent from "../../Component/LabelComponent.tsx";

interface Product {
	id: string;
	productImage: string;
	productImages: [string];
	productAllNames: [string];
	productName: string;
	price: [number];
	status: string;
	stocks: number;
	stockPerSize: [number];
	size: [string];
	description: string;
	availableColors: [string];
	patterns: [string];
}

interface ImageComp {
	uniqueId: string;
	imgFileUrl: string;
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
	isPattern: boolean;
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
	isBold: boolean;
	skewX: any;
	skewY: any;
	rotation: any;
}

const CustomizationPage: React.FC = () => {
	interface User {
		id: string;
	}

	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		const userDetails = JSON.parse(localStorage.getItem("user") ?? "{}");
		setUser(userDetails);
	}, []);
	const navigate = useNavigate();
	const location = useLocation();
	const [color, setColor] = useState<string>("#ffffff");
	const [pattern, setPattern] = useState<string>("none");
	const [customName, setCustomName] = useState<string>("");
	const [customNumber, setCustomNumber] = useState<string>("");
	const [quantity, setQuantity] = useState<number>(1);
	const [notes, setNotes] = useState<string>("");
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [product, setProduct] = useState<Product | null>(null);
	const [activeImage, setActiveImage] = useState(null);
	const [imagePattern, setImagePattern] = useState<ImageComp | null>({
		uniqueId: "pattern-image",
		img: "",
		imgFileUrl: "",
		width: 500,
		height: 500,
		widthPercent: 1,
		heightPercent: 1,
		x: 0,
		y: 0,
		pixelx: 0,
		pixely: 0,
		isActive: true,
		isPattern: false,
	});
	const [isreloaded, setisreloaded] = useState(true);
	const [imageComponents, setImageComponents] = useState<ImageComp[]>([]);
	const [labelComponents, setLabelComponents] = useState<LabelComp[]>([]);
	const [backgroundColor, setBackgroundColor] = useState("#eee");
	const [index, setIndex] = useState(0);
	const [quantities, setQuantities] = useState({});
	const handleQuantityChange = (size, value) => {
		if (product == null) {
			return;
		}
		const maxStock = product.stockPerSize[product.size.indexOf(size)];

		if (value >= 0 && value <= maxStock) {
			setQuantities((prev) => ({
				...prev,
				[size]: value,
			}));
		} else {
			toast.error(`Maximum stock for ${size} is ${maxStock}.`);
		}
	};

	const updateImagePattern = (uniqueId, updatedProperties) => {
		setImagePattern((prev) =>
			prev ? { ...prev, ...updatedProperties } : null
		);
	};

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
	const saveToLocalStorage = (key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	};
	const loadFromLocalStorage = (key) => {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	};
	const setTargetIndex = async (newIndex) => {
		setActiveImage(null);
		setisreloaded(true);

		const customize = {
			image: imageComponents,
			label: labelComponents,
			background: backgroundColor,
			color: color,
			pattern: pattern,
		};

		saveToLocalStorage(`customization-${index}`, customize);
		const newCustomization = loadFromLocalStorage(
			`customization-${newIndex}`
		);
		setIndex(newIndex);
		if (newCustomization) {
			setImageComponents(newCustomization.image);
			setLabelComponents(newCustomization.label);
			setBackgroundColor(newCustomization.background);
			setColor(newCustomization.color);
			setPattern(newCustomization.pattern);
		} else {
			setImageComponents([]);
			setLabelComponents([]);
			setBackgroundColor("#eee");
			setColor("#fff");
			setPattern("none");
		}
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Delete" && activeImage) {
				setImageComponents((prevComponents) =>
					prevComponents.filter(
						(comp) => comp.uniqueId !== activeImage
					)
				);
				setLabelComponents((prevComponents) =>
					prevComponents.filter(
						(comp) => comp.uniqueId !== activeImage
					)
				);
				setActiveImage(null);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [activeImage, setImageComponents, setLabelComponents, setActiveImage]);

	const saveData = async () => {
		const id = product?.id;
		const customization = {
			id,
			customName,
			customNumber,
			notes,
			selectedSize,
			imagePattern,
			customize_list: await getCustomizationList(),
		};
		const jsonData = JSON.stringify(customization);
		const blob = new Blob([jsonData], { type: "application/json" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "customization.json";
		link.click();
	};

	const getCustomizationList = async () => {
		if (product == null) {
			return null;
		}

		const customize_list: any = [];
		for (var i = 0; i < product?.productImages.length; i++) {
			const newCustomization = loadFromLocalStorage(`customization-${i}`);
			if (newCustomization === null) break;

			const image = newCustomization.image;
			const label = newCustomization.label;
			const background = newCustomization.background;
			const color = newCustomization.color;
			const pattern = newCustomization.pattern;

			const processedImage = await Promise.all(
				image.map(async (component) => {
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
								return null;
							}
						} catch (error) {
							console.error(
								"Error submitting the document:",
								error
							);
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
			const validLabelComponents = label.filter(
				(component) => component.text !== ""
			);

			const customize = {
				color,
				pattern,
				product,
				backgroundColor: background,
				image: validImageComponents,
				label: validLabelComponents,
			};
			customize_list.push(customize);
		}
		return customize_list;
	};
	const loadCustomization = async (customization) => {
		setSelectedSize(customization.selectedSize || null);
		setCustomNumber(customization.customNumber);
		setCustomName(customization.customName);

		for (const key in localStorage) {
			if (key.startsWith("customization-")) {
				localStorage.removeItem(key);
			}
		}

		let haveSomething = false;
		for (const [index, ord] of customization.customize_list.entries()) {
			const customize = {
				image: ord.image,
				label: ord.label,
				background: ord.backgroundColor,
				color: ord.color,
				pattern: ord.pattern,
			};
			haveSomething = true;
			saveToLocalStorage(`customization-${index}`, customize);
		}
		if (haveSomething) {
			const newCustomization = loadFromLocalStorage(`customization-${0}`);
			// alert(JSON.stringify(newCustomization));

			setImageComponents(newCustomization.image);
			setLabelComponents(newCustomization.label);
			setBackgroundColor(newCustomization.background);
			setColor(newCustomization.color);
			setPattern(newCustomization.pattern);
		}
	};
	const loadData = async (file) => {
		try {
			const reader = new FileReader();
			reader.onload = (event: any) => {
				try {
					const jsonData = JSON.parse(event.target.result);
					loadCustomization(jsonData.customization);
				} catch (err) {
					console.error("Error parsing JSON", err);
					toast.error("Failed to parse the file as JSON.");
				}
			};
			reader.onerror = (err) => {
				console.error("Error reading file", err);
				toast.error("Failed to read the file.");
			};
			reader.readAsText(file);
		} catch (err) {
			console.error("Error loading the file", err);
			toast.error("Failed to load the file.");
		}
	};
	const addToCart = async () => {
		if (!user || Object.keys(user).length === 0) {
			toast.error("Please log in to save your order.", {
				position: "top-left",
			});
			return;
		}

		const isValid = Object.values(quantities).some(
			(quantity: any) => quantity > 0
		);
		if (!isValid) {
			toast.error("Please select atleast one quantity for any size.");
			return;
		}

		const id = product?.id;
		const toastId = toast.loading("Adding customize product to cart...", {
			position: "top-left",
		});
		if (product == null) {
			return;
		}

		const customization = {
			id,
			customName,
			customNumber,
			notes,
			selectedSize,
			imagePattern,
			customize_list: await getCustomizationList(),
		};

		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"product/add-to-cart",
				{
					userId: user.id,
					productId: id,
					customization,
					quantity,
					quantities,
				}
			);

			if (data.success) {
				navigate("/cart");
				toast.update(toastId, {
					render: "Customized Order added successfully!",
					type: "success",
					isLoading: false,
					autoClose: 3000,
					position: "top-left",
				});
			} else {
				toast.update(toastId, {
					render: data.message,
					type: "error",
					isLoading: false,
					autoClose: 3000,
					position: "top-left",
				});
				return;
			}
		} catch (error) {
			console.error(
				"Error submitting the adding customized order:",
				error
			);
			toast.update(toastId, {
				render: "Error submitting the adding customized order.",
				type: "error",
				isLoading: false,
				autoClose: 3000,
				position: "top-left",
			});
			return;
		}
	};

	const [loading, setLoading] = useState(false);
	const queryParams = new URLSearchParams(location.search);
	const productId = queryParams.get("id");
	const loadAllProducts = async () => {
		setLoading(true);
		try {
			const data: any = await RequestHandler.handleRequest(
				"get",
				`product/get-product?id=${productId}`,
				{}
			);
			setLoading(false);
			if (data.success === false) {
			} else {
				setProduct(data.product);
				setSelectedSize(data.product.size[0] || null);

				const initialQuantities = {};
				data.product.size.forEach((size, index) => {
					initialQuantities[size] = data.quantityPerSize[index];
				});
				setQuantities(initialQuantities);

				const storedData = localStorage.getItem("targetId");
				if (storedData !== `${data.product.id}`) {
					localStorage.removeItem(`${data.product.id}`);
				} else {
					const newCustomization = loadFromLocalStorage(
						`customization-${0}`
					);
					setImageComponents(newCustomization.image);
					setLabelComponents(newCustomization.label);
					setBackgroundColor(newCustomization.background);
					setColor(newCustomization.color);
					setPattern(newCustomization.pattern);
				}
				localStorage.setItem("targetId", `${data.product.id}`);
			}
		} catch (error) {}
	};
	useEffect(() => {
		loadAllProducts();
	}, []);

	const handleSizeChange = (size: string) => setSelectedSize(size);
	const handleColorChange = (value: string) => setColor(value);
	const handlePatternChange = (value: string) => setPattern(value);

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			if (file) {
				const maxFileSize = 15 * 1024 * 1024;
				if (file.size > maxFileSize) {
					toast.error(
						"File size exceeds 15MB. Please upload a smaller file."
					);
					event.target.value = "";
					return;
				}
			}

			const id = product?.id;
			const toastId = toast.loading("Uploading image...", {
				position: "top-left",
			});

			let imageUrl = "";
			const formData = new FormData();
			formData.append("file", file);
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
						position: "top-left",
					});
				}
			} catch (error) {
				console.error("Error uploading image:", error);
				toast.update(toastId, {
					render: "Error submitting the document",
					type: "error",
					isLoading: false,
					autoClose: 3000,
					position: "top-left",
				});
			}
			toast.update(toastId, {
				render: "Image uploaded successfully!",
				type: "success",
				isLoading: false,
				autoClose: 3000,
				position: "top-left",
			});

			setImageComponents((prevComponents) => {
				const newImageId = `image-${Date.now()}-${Math.random()}`;
				return [
					...prevComponents,
					{
						uniqueId: newImageId,
						img: imageUrl,
						imgFileUrl: imageUrl,
						width: 50,
						height: 50,
						widthPercent: 0.1,
						heightPercent: 0.1,
						x: 0,
						y: 0,
						pixelx: 0,
						pixely: 0,
						isActive: true,
						isPattern: false,
					},
				];
			});
		}
	};
	const handleAvailableImageUpload = (image, isPattern = false) => {
		setImageComponents((prevComponents) => {
			const newImageId = `image-${Date.now()}-${Math.random()}`;
			return [
				...prevComponents,
				{
					uniqueId: newImageId,
					img: image,
					imgFileUrl: "",
					width: 50,
					height: 50,
					widthPercent: 0.1,
					heightPercent: 0.1,
					x: 0,
					y: 0,
					pixelx: 0,
					pixely: 0,
					isActive: true,
					isPattern: isPattern,
				},
			];
		});
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
					isBold: false,
					skewX: 0,
					skewY: 0,
					rotation: 0,
				},
			];
		});
	};

	const handleAddToCart = () => addToCart();
	const handleDownloadDesign = () => saveData();
	const [loadedData, setLoadedData] = useState<any>(null);
	const handleLoadDesign = () =>
		document.getElementById("fileInput")?.click();

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileInput = e.target;
		const file = fileInput.files?.[0];
		if (file) {
			try {
				await loadData(file);
			} catch (error) {
				alert("Error loading the file");
			}
		}

		fileInput.value = "";
	};
	const containerRef = useRef<HTMLImageElement | null>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	const handleDownloadPng = async () => {
		try {
			const data = await RequestHandler.handleRequest(
				"post",
				"product/screenshot",
				{
					url: "http://localhost:3000/customize?id=1036002842317357057",
				}
			);
			if (data.success) {
				alert(JSON.stringify(data.screenshot));
				console.log(data.screenshot);
				const img = document.createElement("img");
				img.src = `data:image/png;base64,${data.screenshot}`;
				document.body.appendChild(img);
			} else {
				toast.error("Cannot load screenshot");
			}
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("Error submitting the document");
		}
	};

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
					<div
						ref={cardRef}
						className="flex flex-col justify-between h-[70vh] overflow-y-hidden px-4 scrollbar-thin border border-gray-300 z-100"
					>
						<div className="relative flex justify-center align-items-center">
							<div
								className="w-full h-full min-h-[400px] max-h-[400px] min-w-[400px] max-w-[400px]"
								style={{ backgroundColor: backgroundColor }}
								ref={containerRef}
							>
								<ProductImageWithLogo
									index={index}
									color={color}
									product={product}
									imagePattern={imagePattern}
								/>
							</div>
							<div className="absolute w-full h-full min-h-[400px] max-h-[400px] min-w-[400px] max-w-[400px]">
								{labelComponents.map((labelComp, index) => (
									<LabelComponent
										key={labelComp.uniqueId}
										containerRef={containerRef}
										labelComp={labelComp}
										uniqueId={labelComp.uniqueId}
										activeImage={activeImage}
										setActiveImage={setActiveImage}
										updateLabelComponent={
											updateLabelComponent
										}
										isreloaded={isreloaded}
										setisreloaded={setisreloaded}
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
										updateImageComponent={
											updateImageComponent
										}
										isreloaded={isreloaded}
										setisreloaded={setisreloaded}
									/>
								))}
							</div>
						</div>
					</div>

					<div className="flex flex-col justify-between h-[70vh] overflow-y-auto px-4 scrollbar-thin border border-gray-300">
						<div className="space-y-6">
							<div
								className="fixed top-1/2 left-0 transform -translate-y-1/2 flex flex-col space-y-4 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-lg p-2"
								style={{ backgroundColor: "#aaa" }}
							>
								{product.productImages &&
									product.productImages.map(
										(image, index) => (
											<img
												key={index}
												src={image}
												alt={`Thumbnail ${index}`}
												className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
													activeImage === index
														? "border-blue-500"
														: "border-white"
												}`}
												onClick={() =>
													setTargetIndex(index)
												}
											/>
										)
									)}
							</div>
							<ToolComponent
								color={color}
								handleColorChange={handleColorChange}
								handleImageUpload={handleImageUpload}
								handleAvailableImageUpload={
									handleAvailableImageUpload
								}
								handleLabelUpload={handleLabelUpload}
								selectedPattern={pattern}
								setSelectedPattern={handlePatternChange}
								setActiveImage={setActiveImage}
								updateImagePattern={updateImagePattern}
								backgroundColor={backgroundColor}
								setBackgroundColor={setBackgroundColor}
							/>

							<div className="mb-8">
								<h1 className="text-3xl font-semibold text-gray-700 mb-3">
									{product.productName} (
									{product.productAllNames[index]})
								</h1>
								{/* <h3 className="text-xl font-semibold text-gray-700 mb-3">
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
								</div> */}
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

							<div className="space-y-4">
								{product?.size.map((size, index) => (
									<div
										key={size}
										className="flex items-center space-x-4"
									>
										<p className="text-gray-700">{size}</p>
										<input
											type="number"
											value={quantities[size] || ""}
											min="0"
											max={product.stockPerSize[index]}
											onChange={(e) =>
												handleQuantityChange(
													size,
													parseInt(e.target.value) ||
														0
												)
											}
											className="w-20 p-2 border border-gray-300 rounded-lg"
										/>
										<p className="text-sm text-gray-500">
											Max: {product.stockPerSize[index]}
										</p>
									</div>
								))}
							</div>

							{/* <div className="flex flex-col space-y-2">
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
							</div> */}

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
								onClick={handleDownloadDesign}
								className="w-full sm:w-1/3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
							>
								Download JSON
							</button>
							<button
								onClick={handleLoadDesign}
								className="w-full sm:w-1/3 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
							>
								Load JSON
							</button>
							<input
								id="fileInput"
								type="file"
								accept=".json"
								className="hidden"
								onChange={handleFileChange}
							/>
							{loadedData && (
								<div className="mt-4 p-4 bg-gray-100 border rounded-lg">
									<pre>
										{JSON.stringify(loadedData, null, 2)}
									</pre>
								</div>
							)}
							<button
								onClick={handleAddToCart}
								className="w-full sm:w-1/3 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
							>
								Add to Cart
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomizationPage;

import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import ReactDOM from "react-dom";

const FloatingToolbar = ({ location, activeImage, uniqueId, children }) => {
	if (activeImage !== uniqueId) {
		return null;
	}

	return ReactDOM.createPortal(
		<div
			className="flex gap-2 p-1 bg-white border rounded shadow-lg z-100"
			style={{
				position: "absolute",
				top: location.top,
				left: location.left,
				width: "20vw",
				height: "50px",
				zIndex: 1000,
			}}
			onMouseDown={(e) => e.stopPropagation()}
		>
			{children}
		</div>,
		document.body
	);
};

export default function LabelComponent({
	containerRef,
	labelComp,
	uniqueId,
	activeImage,
	setActiveImage,
	updateLabelComponent,
	disabled = false,
	isreloaded,
	setisreloaded,
}) {
	const [doesMove, setDoesMove] = useState(false);
	const [isMoving, setIsMoving] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
	const [startResize, setStartResize] = useState({ x: 0, y: 0 });


	useEffect(() => {
		if (disabled) return;
		if (isDragging) {
			const handleMouseMove = (event) => {
				if (!isResizing) {
					if (!doesMove) {
						const containerRect =
							containerRef.current.getBoundingClientRect();
						updateLabelComponent(labelComp.uniqueId, {
							pixelx:
								labelComp.pixelx -
								containerRect.left -
								labelComp.width / 2,
							pixely:
								labelComp.pixely -
								containerRect.top -
								labelComp.height / 2,
						});
					}
					setDoesMove(true);
					updateLabelComponent(labelComp.uniqueId, {
						pixelx:
							event.clientX + labelComp.width / 2 - startDrag.x,
						pixely:
							event.clientY + labelComp.height / 2 - startDrag.y,
					});
					if (!isMoving) setIsMoving(true);
				} else handleResize(event);
			};
			window.addEventListener("mouseup", handleMouseUp);
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("touchend", handleMouseUp);
			window.addEventListener("touchmove", handleMouseMove);
			return () => {
				window.removeEventListener("mousemove", handleMouseMove);
				window.removeEventListener("mouseup", handleMouseUp);
				window.removeEventListener("touchend", handleMouseUp);
				window.removeEventListener("touchmove", handleMouseMove);
			};
		}
	}, [isDragging]);

	const handleMouseDown = (event) => {
		if (disabled) return;
		if (containerRef.current) {
			setDoesMove(false);
			const target = event.currentTarget;
			const rect = target.getBoundingClientRect();
			const absoluteX = rect.left + window.scrollX;
			const absoluteY = rect.top + window.scrollY;
			setStartDrag({
				x: event.clientX - absoluteX,
				y: event.clientY - absoluteY,
			});
			setStartResize({
				x: event.clientX,
				y: event.clientY,
			});
			setIsDragging(true);
			setActiveImage(uniqueId);
		}
	};

	const handleMouseUp = () => {
		if (disabled) return;
		setIsDragging(false);
		setIsResizing(false);
		setIsMoving(false);

		if (containerRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();
			let x =
				(labelComp.pixelx - containerRect.left - labelComp.width / 2) /
				containerRect.width;
			let y =
				(labelComp.pixely - containerRect.top - labelComp.height / 2) /
				containerRect.height;

			let width = labelComp.width / containerRect.width;
			let height = labelComp.height / containerRect.height;

			if (doesMove) {
				updateLabelComponent(labelComp.uniqueId, {
					x: x,
					y: y,
					pixelx:
						labelComp.pixelx -
						containerRect.left -
						labelComp.width / 2,
					pixely:
						labelComp.pixely -
						containerRect.top -
						labelComp.height / 2,
				});
			}
			updateLabelComponent(labelComp.uniqueId, {
				widthPercent: width,
				heightPercent: height,
			});
			setDoesMove(false);
		}
	};

	const getLabelCompPosition = () => {
		if (isreloaded) {
			setisreloaded(false);
			return {
				left: `${labelComp.pixelx}px`,
				top: `${labelComp.pixely}px`,
			};
		}
		if (containerRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();
			const width = labelComp.widthPercent * containerRect.width;
			const height = labelComp.heightPercent * containerRect.height;

			if (isMoving && isDragging && !isResizing) {
				return {
					left: `calc(${labelComp.pixelx}px - ${containerRect.left}px - ${width}px / 2)`,
					top: `calc(${labelComp.pixely}px - ${containerRect.top}px - ${height}px / 2)`,
					width: `${width}px`,
					height: `${height}px`,
				};
			}
			if (isResizing) {
				return {
					left: `calc(${labelComp.x * containerRect.width}px - ${
						labelComp.width
					} / 2)`,
					top: `calc(${labelComp.y * containerRect.height}px - ${
						labelComp.height
					} / 2)`,
					width: `${labelComp.width}px`,
					height: `${labelComp.height}px`,
				};
			}

			return {
				left: `calc(${
					labelComp.x * containerRect.width
				}px - ${width} / 2)`,
				top: `calc(${
					labelComp.y * containerRect.height
				}px - ${height} / 2)`,
				width: `${width}px`,
				height: `${height}px`,
			};
		}

		return {
			left: `${labelComp.pixelx}px`,
			top: `${labelComp.pixely}px`,
			width: `${labelComp.width}px`,
			height: `${labelComp.height}px`,
		};
	};

	const [isResizing, setIsResizing] = useState(false);
	const [resizeDirection, setResizeDirection] = useState("");
	const handleResizeMouseDown = (direction) => {
		setIsResizing(true);
		setResizeDirection(direction);
	};

	const handleResize = (event) => {
		if (!containerRef.current) return;

		switch (resizeDirection) {
			case "bottom":
				updateLabelComponent(labelComp.uniqueId, {
					height: Math.max(
						10,
						labelComp.height + event.clientY - startResize.y
					),
				});
				break;
			case "right":
				updateLabelComponent(labelComp.uniqueId, {
					width: Math.max(
						10,
						labelComp.width + event.clientX - startResize.x
					),
				});
				break;
			case "bottomRight":
				updateLabelComponent(labelComp.uniqueId, {
					width: Math.max(
						10,
						labelComp.width + event.clientX - startResize.x
					),
					height: Math.max(
						10,
						labelComp.height + event.clientY - startResize.y
					),
				});
				break;
			default:
				break;
		}
	};

	const [isEditing, setIsEditing] = useState(false);
	const [labelText, setLabelText] = useState(labelComp.text);
	const [fontStyle, setFontStyle] = useState(labelComp.fontStyle || "Arial");
	const [isBold, setIsBold] = useState(labelComp.isBold || false);
	const [textColor, setColor] = useState(labelComp.textColor || false);

	const [showColorPicker, setShowColorPicker] = useState(false);
	const [skewX, setSkewX] = useState(0);
	const [skewY, setSkewY] = useState(0);
	const [rotation, setRotation] = useState(0);

	const handleFontStyleChange = (event) => {
		setFontStyle(event.target.value);
		updateLabelComponent(labelComp.uniqueId, {
			fontStyle: event.target.value,
		});
	};

	const handleSkewX = (event) => {
		setSkewX(event.target.value);
		updateLabelComponent(labelComp.uniqueId, {
			skewX: event.target.value,
		});
	};
	const handleSkewY = (event) => {
		setSkewY(event.target.value);
		updateLabelComponent(labelComp.uniqueId, {
			skewY: event.target.value,
		});
	};
	const handleRotation = (event) => {
		setRotation(event.target.value);
		updateLabelComponent(labelComp.uniqueId, {
			rotation: event.target.value,
		});
	};

	const handleTextColorChange = (color) => {
		setColor(color);
		updateLabelComponent(labelComp.uniqueId, {
			textColor: color,
		});
	};

	const toggleBold = () => {
		updateLabelComponent(labelComp.uniqueId, { isBold: !isBold });
		setIsBold(!isBold);
	};

	const handleDoubleClick = () => {
		setIsEditing(true);
	};
	const handleBlur = () => {
		setIsEditing(false);
	};
	const handleInputChange = (event) => {
		setLabelText(event.target.value);
		updateLabelComponent(labelComp.uniqueId, { text: event.target.value });
	};

	return (
		<>
			{labelComp.text && (
				<div
					data-id={uniqueId}
					className={`absolute cursor-move ${
						isDragging || activeImage === uniqueId
							? "border-2 border-red-500"
							: ""
					}`}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onDoubleClick={handleDoubleClick}
					style={{
						...getLabelCompPosition(),
					}}
				>
					{isEditing ? (
						<input
							type="text"
							value={labelText}
							onChange={handleInputChange}
							onBlur={handleBlur}
							autoFocus
							className="block w-full h-full text-center rounded-lg"
							style={{
								fontSize: `${labelComp.height * 0.5}px`,
								lineHeight: `${labelComp.height}px`,
								fontFamily: fontStyle,
								fontWeight: isBold ? "bold" : "normal",
								transform: `skew(${skewX}deg, ${skewY}deg) rotate(${rotation}deg)`,
							}}
						/>
					) : (
						<span
							className="block pointer-events-none"
							style={{
								width: "100%",
								height: "100%",
								textAlign: "center",
								lineHeight: `${labelComp.height}px`,
								fontSize: `${labelComp.height * 0.5}px`,
								fontFamily: fontStyle,
								fontWeight: isBold ? "bold" : "normal",
								color: textColor,
								transform: `skew(${skewX}deg, ${skewY}deg) rotate(${rotation}deg)`,
							}}
						>
							{labelText}
						</span>
					)}

					<div
						className="absolute w-2 h-full top-0 -right-1 cursor-ew-resize"
						onMouseDown={() => handleResizeMouseDown("right")}
					></div>
					<div
						className="absolute h-2 w-full -bottom-1 left-0 cursor-ns-resize"
						onMouseDown={() => handleResizeMouseDown("bottom")}
					></div>
					<div
						className="absolute w-2 h-2 -bottom-1 -right-1 cursor-nwse-resize"
						onMouseDown={() => handleResizeMouseDown("bottomRight")}
					></div>

					{activeImage === uniqueId && (
						<FloatingToolbar
							location={getLabelCompPosition()}
							activeImage={activeImage}
							uniqueId={uniqueId}
							children={
								<>
									<select
										value={fontStyle}
										onChange={handleFontStyleChange}
										disabled={disabled}
										className="border rounded p-1"
									>
										<option value="Arial">Arial</option>
										<option value="Verdana">Verdana</option>
										<option value="Times New Roman">
											Times New Roman
										</option>
										<option value="Courier New">
											Courier New
										</option>
										<option value="Georgia">Georgia</option>
										<option value="Tahoma">Tahoma</option>
										<option value="Trebuchet MS">
											Trebuchet MS
										</option>
										<option value="Impact">Impact</option>
										<option value="Comic Sans MS">
											Comic Sans MS
										</option>
										<option value="Lucida Console">
											Lucida Console
										</option>
										<option value="Palatino Linotype">
											Palatino Linotype
										</option>
										<option value="Gill Sans">
											Gill Sans
										</option>
										<option value="Futura">Futura</option>
										<option value="Optima">Optima</option>
									</select>

									<button
										onClick={toggleBold}
										disabled={disabled}
										className={`px-3 py-1 border rounded ${
											isBold ? "bg-gray-300" : ""
										}`}
									>
										{isBold ? "Unbold" : "Bold"}
									</button>

									<div className="relative">
										<div
											onClick={() => {
												if (disabled) return;
												setShowColorPicker(
													!showColorPicker
												);
											}}
											className="w-8 h-8 border rounded cursor-pointer"
											style={{
												backgroundColor: textColor,
											}}
										></div>

										{showColorPicker && (
											<div className="absolute z-10 mt-2">
												<ChromePicker
													color={textColor}
													onChange={(color) =>
														handleTextColorChange(
															color.hex
														)
													}
													disableAlpha={true}
												/>
											</div>
										)}
									</div>

									{/* <div
										className="mt-2 d-flex"
										style={{ display: "flex" }}
									>
										<label className="block me-3">
											Skew X:
										</label>
										<input
											type="number"
											value={skewX}
											onChange={handleSkewX}
											disabled={disabled}
											className="w-full border rounded p-2 me-3"
											min="-30"
											max="30"
										/>

										<label className="block me-3">
											Skew Y:
										</label>
										<input
											type="number"
											value={skewY}
											onChange={handleSkewY}
											disabled={disabled}
											className="w-full border rounded p-2 me-3"
											min="-30"
											max="30"
										/>

										<label className="block me-3">
											Rotate:
										</label>
										<input
											type="number"
											value={rotation}
											onChange={handleRotation}
											disabled={disabled}
											className="w-full border rounded p-2"
											min="-360"
											max="360"
										/> */}
									{/* </div> */}
								</>
							}
						/>
					)}
				</div>
			)}
		</>
	);
}

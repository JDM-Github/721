import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router-dom
import RequestHandler from "../../Functions/RequestHandler";

// Sample product data for customizable products
// const products = [
// 	{
// 		id: 1,
// 		name: "BB Top",
// 		price: "$29.99",
// 		image: "https://via.placeholder.com/200x200/FF5733/FFFFFF?text=BB+Top",
// 	},
// 	{
// 		id: 2,
// 		name: "BB Bottom",
// 		price: "$34.99",
// 		image: "https://via.placeholder.com/200x200/33A1FF/FFFFFF?text=BB+Bottom",
// 	},
// 	{
// 		id: 3,
// 		name: "Jacket",
// 		price: "$49.99",
// 		image: "https://via.placeholder.com/200x200/FF33A1/FFFFFF?text=Jacket",
// 	},
// 	{
// 		id: 4,
// 		name: "Collared Shirt",
// 		price: "$39.99",
// 		image: "https://via.placeholder.com/200x200/33FF57/FFFFFF?text=Collared+Shirt",
// 	},
// 	{
// 		id: 5,
// 		name: "Hoodie",
// 		price: "$59.99",
// 		image: "https://via.placeholder.com/200x200/FFD700/FFFFFF?text=Hoodie",
// 	},
// 	{
// 		id: 6,
// 		name: "Shorts",
// 		price: "$24.99",
// 		image: "https://via.placeholder.com/200x200/8A2BE2/FFFFFF?text=Shorts",
// 	},
// 	{
// 		id: 7,
// 		name: "Sports Pants",
// 		price: "$39.99",
// 		image: "https://via.placeholder.com/200x200/20B2AA/FFFFFF?text=Sports+Pants",
// 	},
// 	{
// 		id: 8,
// 		name: "Windbreaker",
// 		price: "$69.99",
// 		image: "https://via.placeholder.com/200x200/DC143C/FFFFFF?text=Windbreaker",
// 	},
// ];

interface Product {
	id: string;
	productImage: string;
	productName: string;
	price: [number];
	status: string;
	stocks: number;
	size: [string];
	description: string;
}

function CustomizeSection() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const loadAllProducts = async () => {
		setLoading(true);
		try {
			const data = await RequestHandler.handleRequest(
				"get",
				"product/get-all-product-customizable",
				{}
			);
			setLoading(false);
			if (data.success === false) {
				// toast.error(
				// 	data.message ||
				// 		"Error occurred. Please check your credentials."
				// );
				alert(JSON.stringify(data));
			} else {
				setProducts(data.products);
				// getChatHistory();
			}
		} catch (error) {
			// toast.error(`An error occurred while archiving data. ${error}`);
		}
	};
	useEffect(() => {
		loadAllProducts();
	}, []);
	const handleCustomizeClick = (productId) => {
		navigate(`/customize?id=${productId}`);
	};

	return (
		<div className="py-2 pb-12 px-4 w-4/5 mt-8 mx-auto min-h-[80vh]">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">
				Customize Your Product
			</h2>
			{loading ? (
				<div className="col-span-full flex justify-center items-center">
					<div className="text-orange-500 font-semibold text-lg ">
						Loading...
					</div>
				</div>
			) : products.length === 0 ? (
				<div className="col-span-full text-center text-gray-500 text-xl">
					No Customizable Products Available
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
					{products.map((product) => (
						<div
							key={product.id}
							className="bg-white border rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300"
							onClick={() => handleCustomizeClick(product.id)}
						>
							{/* Product Image */}
							<img
								src={product.productImage}
								alt={product.productName}
								className="w-full h-64 object-cover"
							/>

							<div className="p-4">
								{/* Product Name */}
								<h3 className="text-xl font-semibold text-gray-800">
									{product.productName}
								</h3>

								{/* Product Price */}
								<p className="text-lg font-medium text-gray-600 mt-2">
									₱ {product.price}
								</p>

								{/* Customize Button */}
								<button
									className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
									onClick={() =>
										handleCustomizeClick(product.id)
									}
								>
									Customize Now
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default CustomizeSection;

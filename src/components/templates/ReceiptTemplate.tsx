import { CartType } from "@/types/POSTypes";
import React from "react";

export type ReceiptTemplateProps = {
	products: CartType[];
	total: number | string;
};

const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({ products, total }) => {
	return (
		<div style={{ textAlign: 'center', fontFamily: 'monospace', width: '300px' }}>
			<h1 style={{ margin: '0' }}>EYE CARE WEB</h1>
			<p>--------------------------------</p>

			{products.map((item, index) => (
				<div key={index} style={{ marginBottom: '5px' }}>
					{/* Item Name */}
					<div style={{ textTransform: 'uppercase' }}>{item.name}</div>
					{/* Item Price */}
					<div>${Number(item.price).toFixed(2)}</div>
				</div>
			))}

			<p>--------------------------------</p>
			<h2 style={{ margin: '0' }}>TOTAL: ${Number(total).toFixed(2)}</h2>
			<p style={{ marginTop: '10px' }}>THANK YOU!</p>
		</div>
	);
}

export default ReceiptTemplate;
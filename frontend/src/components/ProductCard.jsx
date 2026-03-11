export default function ProductCard({ product }) {
  return (
    <div className="border rounded shadow p-4 flex flex-col">
      <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="h-40 object-cover mb-2"/>
      <h2 className="font-semibold">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <button className="mt-auto bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700">Add to Cart</button>
    </div>
  );
}
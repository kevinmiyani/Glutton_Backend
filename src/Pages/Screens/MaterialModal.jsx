import React, { useState } from "react";

const MaterialModal = ({ product, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [formValues, setFormValues] = useState({
    category: product.materialId.categoryId.name,
    material: product.materialId.name,
    brand: product.brand,
    quantity: product.quantity,
    unit: product.unit,
    pricePerUnit: product.pricePerUnit,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submission for updating the product
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...product,
      materialId: {
        ...product.materialId,
        categoryId: { name: formValues.category },
        name: formValues.material,
      },
      brand: formValues.brand,
      quantity: formValues.quantity,
      unit: formValues.unit,
      pricePerUnit: formValues.pricePerUnit,
    };

    onUpdate(updatedProduct); // Trigger the update in the parent component
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Material Details</h2>

        {!isEditing ? (
          <>
            <p>
              <strong>Category:</strong> {formValues.category}
            </p>
            <p>
              <strong>Material:</strong> {formValues.material}
            </p>
            <p>
              <strong>Brand:</strong> {formValues.brand}
            </p>
            <p>
              <strong>Quantity:</strong> {formValues.quantity}
            </p>
            <p>
              <strong>Unit:</strong> {formValues.unit}
            </p>
            <p>
              <strong>Unit Price:</strong> {formValues.pricePerUnit}
            </p>

            <button
              onClick={() => setIsEditing(true)} // Toggle to edit mode
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Category:</label>
              <input
                type="text"
                name="category"
                value={formValues.category}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Material:</label>
              <input
                type="text"
                name="material"
                value={formValues.material}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Brand:</label>
              <input
                type="text"
                name="brand"
                value={formValues.brand}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={formValues.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Unit:</label>
              <input
                type="text"
                name="unit"
                value={formValues.unit}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Unit Price:</label>
              <input
                type="number"
                name="pricePerUnit"
                value={formValues.pricePerUnit}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MaterialModal;

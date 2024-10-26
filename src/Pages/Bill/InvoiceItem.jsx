/* eslint-disable react/prop-types */
import React from "react";

const InvoiceItem = ({ onItemizedItemEdit, onRowAdd, onRowDel, currency, items }) => {
  return (
    <div className="mt-4">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Price</th>
            <th className="py-2 px-4">Quantity</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={onItemizedItemEdit}
                  id={item.id}
                  className="border p-1 rounded w-full"
                  required
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={onItemizedItemEdit}
                  id={item.id}
                  className="border p-1 rounded w-full"
                  required
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={onItemizedItemEdit}
                  id={item.id}
                  className="border p-1 rounded w-full"
                  min="0"
                  step="0.01"
                  required
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={onItemizedItemEdit}
                  id={item.id}
                  className="border p-1 rounded w-full"
                  min="1"
                  required
                />
              </td>
              <td className="py-2 px-4">
                <button
                  type="button"
                  onClick={() => onRowDel(item)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={onRowAdd}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        Add Item
      </button>
    </div>
  );
};

export default InvoiceItem;

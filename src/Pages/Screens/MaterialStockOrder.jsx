import React, { useState, useEffect } from "react";
import { common, Stock } from "../../api/call";
import { FaArrowLeftLong, FaTrash } from "react-icons/fa6";
import StockManagerPopup from "./StockManagerPopup";
import { useNavigate } from "react-router-dom";

const MaterialEntry = ({ InvertData, OutvertData, setFormData, formData,order }) => {
  console.log("formData.materialOutwertEntry.", formData.materialOutwertEntry);

  // State to manage modal visibility
  const [showModal, setShowModal] = useState(false);

  // State to manage form inputs
  const [materialName, setMaterialName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [tableType, setTableType] = useState("Material Outvert Entry");

  // State to manage table entries
  const [materialInEntries, setMaterialInEntries] = useState(InvertData);
  const [materialOutEntries, setMaterialOutEntries] = useState([]);

  // State to manage materials fetched from API
  const [materials, setMaterials] = useState([]);
  const [showStockManagerPopup, setShowStockManagerPopup] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()

  // Fetch materials from API when modal is opened
  useEffect(() => {
    if (showModal) {
      fetchMaterials();
    }
  }, [showModal]);

  // Function to fetch materials from API
  const fetchMaterials = async () => {
    try {
      // Call API to fetch materials
      const response = await Stock.getAllMaterial(); // This should be the call to your API

      // Debugging: Log the raw response
      console.log("API raw response:", response.data.data);

      // Assuming response.data is the correct part containing materials
      if (response.data.data) {
        setMaterials(response.data.data); // Set materials only if it's an array
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      setMaterials([]); // Handle fetch error and set an empty array
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found in local storage");
        setIsLoading(false);
        return;
      }

      try {
        const response = await common.getorders();
        const data = response.data;

        if (Array.isArray(data)) {
          setOrders(data);
          setFilteredOrders(data);
        } else if (data && typeof data === 'object') {
          const arrayData = Object.values(data).find((value) => Array.isArray(value));
          if (arrayData) {
            setOrders(arrayData);
            setFilteredOrders(arrayData);
          } else {
            throw new Error("Unexpected data structure");
          }
        } else {
          throw new Error("Unexpected data structure");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);
  // Function to handle adding an entry
  const handleAddEntry = () => {

    setFormData((prevFormData) => ({
      ...prevFormData,
      materialOutwertEntry: [
        ...formData.materialOutwertEntry,
        ...materialOutEntries,
      ],
    }));

    // setMaterialOutEntries([{ CategoryName: "", quantity: "", Material: "", Brand: "", Unit: "", PricePerUnit: "" }])
    setShowModal(false);
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterial = [...materialOutEntries];
    updatedMaterial[index][field] = value;
    setMaterialOutEntries(updatedMaterial)
    // setFormData({ ...formData, materialOutwertEntry: updatedMaterial });
  };
  const [orderId, setOrderId] = useState("");

  const stock = (order) => {
    setOrderId(order);
    setShowStockManagerPopup(true)
    // navigate(-1)
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Function to open the modal
  const openModal = () => {
    setSelectedOrder();
    setIsModalOpen(true);
  };
  const openModal1 = () => {
    setSelectedOrder();
    setIsModalOpen1(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalOpen1(false);
    setSelectedOrder(null);
  };
  console.log(filteredOrders)

  return (
    <div className="p-4">
      {/* Add Button */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => stock(filteredOrders)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          + Add System BOM Require
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          + Add Material Outvert Entry
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-full sm:max-w-lg w-full mx-4 sm:mx-0 overflow-y-auto max-h-screen">
            <h2 className="text-xl font-semibold mb-4">Add Material</h2>

            {/* Material Form */}
            {materialOutEntries.map((item, index) => (
              <div key={index} className="mb-2 flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  value={item.CategoryName}
                  onChange={(e) => handleMaterialChange(index, "CategoryName", e.target.value)}
                  placeholder="Category Name"
                  className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                />
                <input
                  type="text"
                  value={item.Material}
                  onChange={(e) => handleMaterialChange(index, "Material", e.target.value)}
                  placeholder="Material Name"
                  className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                />
                <input
                  type="text"
                  value={item.Brand}
                  onChange={(e) => handleMaterialChange(index, "Brand", e.target.value)}
                  placeholder="Brand Name"
                  className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                />
                <input
                  type="text"
                  value={item.Unit}
                  onChange={(e) => handleMaterialChange(index, "Unit", e.target.value)}
                  placeholder="Enter Unit"
                  className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleMaterialChange(index, "quantity", e.target.value)}
                  placeholder="Quantity"
                  className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                />
                <input
                  type="number"
                  value={item.PricePerUnit}
                  onChange={(e) => handleMaterialChange(index, "PricePerUnit", e.target.value)}
                  placeholder="Price Per Unit"
                  className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                />
              </div>
            ))}

            {/* Modal Buttons */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEntry}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Tables */}
      <div className="mt-6 flex flex-col justify-between  w-[90%] ">
        <div className="">
          <h3 className="text-lg font-semibold mb-2">System BOM Require</h3>
          {/* <table className="min-w-full border-collapse border border-gray-300 mb-4"> */}
          <table className=" border-collapse mb-4">
            {/* <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 bg-green-600 text-white">
                  CategoryName
                </th>
                <th className="border border-gray-300 px-4 py-2  bg-green-600 text-white">Material</th>
                <th className="border border-gray-300 px-4 py-2  bg-green-600 text-white">Brand</th>
                <th className="border border-gray-300 px-4 py-2  bg-green-600 text-white">Unit</th>
                <th className="border border-gray-300 px-4 py-2  bg-green-600 text-white">Quantity</th>
                <th className="border border-gray-300 px-4 py-2  bg-green-600 text-white">PricePerUnit</th>
              </tr>

            </thead>
            <tbody>
              {materialInEntries.map((entry, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.CategoryName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.Material}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.Brand}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.Unit}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.PricePerUnit}
                  </td>
                </tr>
              ))}
            </tbody> */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => openModal()}
            >
              View
            </button>
          </table>
        </div>
        {/* Material Invert Entry Table */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Material Outvert Entry</h3>
          {/* <table className="min-w-full border-collapse border border-gray-300 mb-4"> */}
          <table className="mb-4">
            {/* <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 bg-green-600 text-white">
                  CategoryName
                </th>
                <th className="border border-gray-300 px-4 py-2  bg-green-600 text-white">Material</th>
                <th className="border border-gray-300 px-4 py-2  bg-green-600 text-white">Brand</th>
                <th className="border border-gray-300 px-4 py-2  bg-green-600 text-white">Unit</th>
                <th className="border border-gray-300 px-4 py-2  bg-green-600 text-white">Quantity</th>
                <th className="border border-gray-300 px-4 py-2  bg-green-600 text-white">PricePerUnit</th>
              </tr>

            </thead>
            <tbody>
              {OutvertData.map((entry, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.CategoryName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.Material}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.Brand}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.Unit}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {entry.PricePerUnit}
                  </td>
                </tr>
              ))}
            </tbody> */}
             <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => openModal1()}
            >
              View
            </button>
          </table>
        </div>
        {/* Material Outvert Entry Table */}
      </div>
      {showStockManagerPopup && (
        <StockManagerPopup
          orderId={filteredOrders}
          order={order}
          onClose={() => setShowStockManagerPopup(false)}
        />
      )}
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center mt-20 items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto relative dark:bg-boxdark">
            {/* Square Close Button in the Top Right */}
            <button
              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 flex items-center justify-center"
              onClick={closeModal}
            >
              &#x2715; {/* Close icon */}
            </button>

            <h2 className="text-xl font-semibold mb-4">View System BOM Require</h2>

            {/* Company Details */}
            <div className="mb-4">
              <p>Client Name: Ashok Patel</p>
              <p>OrderId: 123456</p>
              <p>Address: 123 Ground Floor, XYZ Building, Mumbai</p>
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1">SR. NO.</th>
                  <th className="border px-2 py-1">ITEM DESCRIPTION</th>
                  <th className="border px-2 py-1">ORDER QUANTITY</th>
                  <th className="border px-2 py-1">BALANCE QUANTITY</th>
                  <th className="border px-2 py-1">DELIVERED QUANTITY</th>
                </tr>
              </thead>
              <tbody>
                {/* Add enough rows to mirror the image */}
                
                {OutvertData.map((entry, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">{index + 1}</td>
                    <td className="border px-2 py-1">{entry.CategoryName}</td>
                    <td className="border px-2 py-1">{entry.Material}</td>
                    <td className="border px-2 py-1">{entry.Brand}</td>
                    <td className="border px-2 py-1"> {entry.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature Section */}
            <div className="mt-8 flex justify-between">
              <div>
                <p className="font-semibold">Receiver Signature:</p>
                <p>_____________________</p>
              </div>
              <div>
                <p className="font-semibold">Authorized Signatory:</p>
                <p>_____________________</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen1 && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center mt-20 items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto relative dark:bg-boxdark">
            {/* Square Close Button in the Top Right */}
            <button
              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 flex items-center justify-center"
              onClick={closeModal}
            >
              &#x2715; {/* Close icon */}
            </button>

            <h2 className="text-xl font-semibold mb-4">View Material Outvert Entry</h2>

            {/* Company Details */}
            <div className="mb-4">
              <p>Client Name: Ashok Patel</p>
              <p>OrderId: 123456</p>
              <p>Address: 123 Ground Floor, XYZ Building, Mumbai</p>
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1">SR. NO.</th>
                  <th className="border px-2 py-1">ITEM DESCRIPTION</th>
                  <th className="border px-2 py-1">ORDER QUANTITY</th>
                  <th className="border px-2 py-1">BALANCE QUANTITY</th>
                  <th className="border px-2 py-1">DELIVERED QUANTITY</th>
                </tr>
              </thead>
              <tbody>
                {/* Add enough rows to mirror the image */}
                {materialInEntries.map((entry, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">{index + 1}</td>
                    <td className="border px-2 py-1">{entry.CategoryName}</td>
                    <td className="border px-2 py-1">{entry.Material}</td>
                    <td className="border px-2 py-1">{entry.Brand}</td>
                    <td className="border px-2 py-1"> {entry.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature Section */}
            <div className="mt-8 flex justify-between">
              <div>
                <p className="font-semibold">Receiver Signature:</p>
                <p>_____________________</p>
              </div>
              <div>
                <p className="font-semibold">Authorized Signatory:</p>
                <p>_____________________</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default MaterialEntry;

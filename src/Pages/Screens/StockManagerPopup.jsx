import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaTrash } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import { Maintenance } from '../../api/call';

const StockManagerPopup = ({ onClose,material,order }) => {
  const [formData, setFormData] = useState({
  
    material:material ? material: [],
  });

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    // e.preventDefault();
    console.log(order)
    // Collect all the form data
    const Data = {
      orderId: order._id,
      data:{
        billOfMaterials:formData.material
      }
    };
    
      const response = await Maintenance.verifyMaintenance(Data);
      console.log("response",response);
      
      if (response.data.data) {
            // Close the popup
            toast.success(" Material to Order")
  
      onClose();
      // navigate('/orders');
  window.location.reload()
      }else{
        toast.error("Fail to add")
      }

  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterial = [...formData.material];
    updatedMaterial[index][field] = value;
    setFormData({ ...formData, material: updatedMaterial });
  };

  const addMaterial = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      material: [...prevFormData.material, { CategoryName: "", quantity: "", Material: "", Brand: "", Unit: "", PricePerUnit: "" }],
    }));
  };

  const removeMaterial = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      material: prevFormData.material.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pl-10">
            <ToastContainer />

    <div className="bg-white dark:bg-boxdark p-4 rounded-lg max-w-screen-lg w-full py-12 ms-60 overflow-hidden">
      <div className="flex justify-end mb-4">
        <button onClick={onClose} className="text-2xl font-bold">&times;</button>
      </div>
      <div className="max-h-96 overflow-y-auto"> {/* Scrollable container */}
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Material and Quantity
          </label>
          {formData.material.map((item, index) => (
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
              <button
                type="button"
                onClick={() => removeMaterial(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMaterial}
            className="mt-2 w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-primary bg-primary p-2 text-white dark:bg-darkprimary dark:border-darkprimary"
          >
            Add Material
          </button>
           <button
            type="button"
            onClick={() => handleSubmit()}
            className="mt-2 ml-2 w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-primary bg-primary p-2 text-white dark:bg-darkprimary dark:border-darkprimary"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default StockManagerPopup;

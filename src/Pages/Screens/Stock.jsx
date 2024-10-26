/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { common, Stock } from "../../api/call";
import { ToastContainer, toast } from "react-toastify";
import { format } from 'date-fns';

const MaterialModal = ({ product, onClose, onSubmit }) => {
  const [editedProduct, setEditedProduct] = useState(product); // Track the edited product
console.log("product",product);

  // Handle input changes when editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value, // Update only the specific field that is being edited
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await common.updateitem(editedProduct._id, {
        quantity: editedProduct.quantity,
        brand: editedProduct.brand,
        unit: editedProduct.unit,
        pricePerUnit: editedProduct.pricePerUnit,
      });
      if (response.status) {
        onSubmit(editedProduct); // Pass the edited product back to the parent
        onClose(); // Close the modal
      } else {
        console.error("Update failed: ", response.message);
      }
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  return (
    <div className="fixed ml-30  inset-0 z-50 flex items-center  justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg mt-5">
        
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Edit Material Details
          </h2>

          {/* Table to display Material Information */}
          <div className="overflow-x-auto overflow-y-auto max-h-64 mb-6">
  <table className="min-w-full table-auto border-collapse border border-gray-300">
    <thead>
      <tr>
        <th className="border border-gray-300 px-4 py-2">Brand</th>
        <th className="border border-gray-300 px-4 py-2">Quantity</th>
        <th className="border border-gray-300 px-4 py-2">Unit</th>
        <th className="border border-gray-300 px-4 py-2">Price Per Unit</th>
        <th className="border border-gray-300 px-4 py-2">Details</th>
        <th className="border border-gray-300 px-4 py-2">Date</th>
      </tr>
    </thead>
    <tbody>
      { product?.updateRecords.length > 0 ? 
      <>
      { product?.updateRecords.map((item,index) => (
          <tr key={index}>
          <td className="border border-gray-300 px-4 py-2">{item.updatedBrand}</td>
          <td className="border border-gray-300 px-4 py-2">{item.updatedQuantity}</td>
          <td className="border border-gray-300 px-4 py-2">{item.updatedUnit}</td>
          <td className="border border-gray-300 px-4 py-2">{item.updatedPricePerUnit}</td>
          <td className="border border-gray-300 px-4 py-2">{item.updatedDetails}</td>
          <td className="border border-gray-300 px-4 py-2">{format(new Date(item.updatedAt), "MMMM do, yyyy, h:mm a")}</td>
        </tr>
        ))}
      </>
       :<>
       No Records Found
       </>
      }
    </tbody>
  </table>
</div>


          {/* Two-column grid layout for editing */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <label className="block">
              <span className="text-gray-700 font-medium">Brand</span>
              <input
                type="text"
                name="brand"
                value={editedProduct.brand}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Quantity</span>
              <input
                type="number"
                name="quantity"
                value={editedProduct.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Unit</span>
              <input
                type="text"
                name="unit"
                value={editedProduct.unit}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Unit Price</span>
              <input
                type="number"
                name="pricePerUnit"
                value={editedProduct.pricePerUnit}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Close
            </button>

            <button
              onClick={handleSubmit} // Update the submit button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stockscreen = () => {
  const [ProductData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addCategory, setaddCategory] = useState(null);
  const [addMaterial, setaddMaterial] = useState(null);
  const [addBrand, setaddBrand] = useState(null);
  const [addDetails, setaddDetails] = useState(null);
  const [additemName, setadditemName] = useState(null);
  const [Quantity, setQuantity] = useState(null);
  const [addUnit, setaddUnit] = useState(null);
  const [addPricePerUnit, setaddPricePerUnit] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const [AllCategory, setAllCategory] = useState([]);
  const [AllMaterial, setAllMaterial] = useState([]);
  const [error, setError] = useState(null);

  // const [addCategory, setAddCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading1, setIsLoading1] = useState(true);
  const [error1, setError1] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({
    clientName: "",
    id: "",
    address: "",
    materialOutvertEntry: [],
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const [selectmid, setselectmid] = useState("");
  const [selectcid, setselectcid] = useState("");
  const [orderId, setOrderId] = useState("");
  const [filterState, setFilterState] = useState("");
  const [managerStatus, setManagerStatus] = useState("");

  // Search and filter state for orders
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const isDesignerPage = location.pathname.includes("designer");
  const role = localStorage.getItem("role");
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    if (activePopup === "category") fetchCategories();
  }, [activePopup]);

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [activePopup]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found in local storage");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true); // Start loading state
      let data;

      // Check if search query or filter state exists
      if (searchQuery || filterState) {
        let queryParams = "";
        if (searchQuery) queryParams += `&query=${searchQuery}`;
        if (filterState) queryParams += `&state=${filterState}`;

        // Fetch using search API when filters/search query are applied
        const response = await common.searchOrder(page, queryParams);
        data = response.data;
      } else {
        // Fetch regular orders when no filters or search query
        const response = await common.getorders(page, itemsPerPage);
        data = response.data;
      }

      if (data.results || data.orders) {
        console.log("data.results || data.orders", data.results || data.orders);

        setOrders(data.results || data.orders);
        setTotalPages(data.totalPages || Math.ceil(data.total / itemsPerPage));
      } else {
        throw new Error("Unexpected data structure");
      }

    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await Stock.getAllCategory();
      if (response.status === 200) {
        setAvailableCategories(response.data.data);
      } else {
        toast.error("Failed to fetch categories.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("An error occurred while fetching categories.");
    }
  };

  const fetchStocks = async () => {
    try {
      const response = await Stock.getAllItems();
      const data = response.data;

      if (data.data) {
        setProductData(data.data);
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

  const openPopup = (popupId) => {
    setActivePopup(popupId);
  };

  const closePopup = () => {
    setActivePopup(null);
    setaddCategory("");
    setaddMaterial("");
    setaddBrand("");
    setaddDetails("");
    setadditemName("");
    setQuantity("");
    setaddUnit("");
    setaddPricePerUnit("");
  };

  const navigate = useNavigate();


  const fetchItems = async () => {
    try {
      const getAllCategory = await Stock.getAllCategory();
      const getAllMaterial = await Stock.getAllMaterial();


      console.log("setAllCategory", getAllCategory.data.data)
      console.log("getAllMaterial", getAllMaterial.data.data)
      if (getAllCategory.data && getAllMaterial.data) {
        setAllCategory(getAllCategory.data.data);
        setAllMaterial(getAllMaterial.data.data);
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const [catname, setcatname] = useState(''); // Holds the selected category ID
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  // Filter materials whenever the category changes
  useEffect(() => {
    if (catname) {
      const filtered = filterMaterialsByCategory(AllMaterial, catname);
      setFilteredMaterials(filtered);
    }
  }, [catname, AllMaterial]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchItems();
  }, []);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setaddMaterial(value);

    if (value.length > 0) {
      // Filter categories based on input value
      const filteredSuggestions = AllMaterial.filter((category) =>
        category.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setaddMaterial(suggestion.name);
    setSuggestions([]);
  };
  const handleSubmitAddMaterial = async () => {
    try {
      if (addCategory && addMaterial) {
        const data = { categoryId: addCategory, name: addMaterial };
        console.log(data);

        const response = await Stock.AddMaterial(data);

        if (response.status === 201) {
          toast.success("Material Added Successfully");
          setaddCategory("");
          setaddMaterial("");
          fetchItems();
        } else {
          toast.error("Failed to Add Material. Ensure the material is unique.");
        }
      } else {
        toast.error("Please fill out all fields.");
      }
    } catch (error) {
      console.error("Error adding material:", error);
      toast.error("An error occurred while adding the material.");
    } finally {
      closePopup();
    }
  };

  const handleCategoryInput = (e) => {
    const userInput = e.target.value;
    setaddCategory(userInput);

    if (userInput.length > 0) {
      const suggestions = availableCategories.filter((category) =>
        category.name.toLowerCase().startsWith(userInput.toLowerCase())
      );
      setFilteredCategories(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmitAddCategory = async () => {
    try {
      if (addCategory) {
        // Close the suggestion dropdown
        setShowSuggestions(false);

        const data = { name: addCategory };
        const response = await Stock.AddCategory(data);
        await fetchStocks()

        if (response) {

          toast.success("Category Added Successfully");
        } else {
          toast.error("Failed to Add Category. Ensure the category is unique.");
        }
      } else {
        toast.error("Please fill out all fields.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("An error occurred while adding the category.");
    } finally {
      closePopup();
    }
  };

  const handleSubmitAddItem = async () => {
    const data = {
      materialId: newOutward.Material,
      itemname:additemName,
      details: addDetails,
      brand: addBrand,
      quantity: Quantity,
      unit: addUnit,
      pricePerUnit: addPricePerUnit,
    };
    console.log("data==>",data);
    
    try {
      if (
        newOutward.Material &&
        addDetails &&
        addBrand &&
        Quantity &&
        addUnit &&
        addPricePerUnit
      ) {
        const data = {
          materialId: newOutward.Material,
          details: addDetails,
          brand: addBrand,
          quantity: Quantity,
          unit: addUnit,
          pricePerUnit: addPricePerUnit,
          itemname:additemName,
        };
        const response = await Stock.AddItem(data);
        console.log("response",response);
        
        if (response.status === 201 || response.status === 200) {
          toast.success("Item Added Successfully");

         fetchItems()
          fetchOrders();
          window.location.reload()
        } else {
          toast.error("Failed to Add Category. Ensure the category is unique.");
        }
      } else {
        toast.error("Please fill out all fields.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("An error occurred while adding the category.");
    } finally {
      closePopup();
    }
  };

  // Function to open modal
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitstart");
    try {
      const StockManagerdata = {
        orderId: orders[0]._id,
        data: orders,
      };
      console.log(StockManagerdata);
      const response = await Stock.verifyStoke(StockManagerdata);
      if (response && (response.status === 201 || response.status === 200)) {
        toast.success("Update Order Successfully");

        setTimeout(() => {
          navigate("/stock");
        }, 1000);
      } else {
        toast.error("Failed to Update Order. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const removeMaterial = (index) => {
    // Filter out the material at the given index
    const updatedMaterials = selectedOrder.materialOutvertEntry.filter(
      (_, i) => i !== index
    );

    // Update the selectedOrder state with the updated materials list
    setSelectedOrder((prevOrder) => ({
      ...prevOrder,
      materialOutvertEntry: updatedMaterials,
    }));
  };
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleModalOpen = (product) => {
    setSelectedProduct(product); // Set the clicked product for editing
    setIsModalOpen1(true); // Open modal
  };

  const handleModalClose = () => {
    setIsModalOpen1(false); // Close modal
    setSelectedProduct(null); // Clear selected product
  };

  // Update only the selected product in the state
  const handleProductSubmit = (updatedProduct) => {
    setProductData((prevData) =>
      prevData.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    // console.log(ProductData)
  };

  const handleSearchOrFilter = (page = 1) => {
    fetchOrders(page);
    setCurrentPage(page);

  };


  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const filterMaterialsByCategory = (materials, categoryId) => {
    if (!categoryId) return [];
    return materials.filter(material => material.categoryId._id === categoryId);
  };


  const handleCategoryChange = (e) => {
    const selectedName = e.target.value;
    const selectedCategory = AllCategory.find(category => category.name === selectedName);

    if (selectedCategory) {
      setNewOutward({ ...newOutward, CategoryName: selectedCategory.name });
      setcatname(selectedCategory._id); // Update category ID
    }
  };
  console.log("catname", catname)

  const [newOutward, setNewOutward] = useState({
    CategoryName: "",
    Material: "",
  });


  // Conditional rendering if loading or error
  if (isLoading) return <p>Loading...</p>;
  if (error1) return <p>Error: {error1}</p>;
  return (
    <>
      <Breadcrumb pageName="Stock" />
      <ToastContainer />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-stroke dark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <div>
            <div className="flex sm:justify-between items-center">
              <h4 className="text-xl font-semibold">All Products</h4>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 text-white bg-green-500 rounded"
                  onClick={() => openPopup("category")}
                >
                  Add Category
                </button>
                <button
                  className="px-3 py-1 text-white bg-green-500 rounded"
                  onClick={() => openPopup("material")}
                >
                  Add Material
                </button>
                <button
                  className="px-3 py-1 text-white bg-green-500 rounded"
                  onClick={() => openPopup("item")}
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Popup for Category */}
            {activePopup === "category" && (
              <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
                <div className="bg-white dark:bg-boxdark dark:text-white p-4 rounded shadow-lg w-[700px] relative">
                  <div className="flex sm:justify-between">
                    <h2 className="text-xl font-semibold ">Add Category</h2>
                    <button
                      className="px-3 py-1  bg-green-500 rounded"
                      onClick={closePopup}
                    >
                      <IoMdClose className="dark:text-white" />
                    </button>
                  </div>
                  <div className="items-center space-x-2 mt-10">
                    <label
                      htmlFor="category"
                      className="text-xl font-medium text-gray-700 "
                    >
                      Category:
                    </label>
                    <input
                      id="category"
                      type="text"
                      className="px-3 py-2 border border-gray-300 rounded w-96 dark:bg-gray-700 bg-white dark:bg-boxdark dark:border-gray-600"
                      placeholder="Enter category"
                      value={addCategory}
                      onChange={handleCategoryInput}
                    />
                    {showSuggestions && filteredCategories.length > 0 && (
                      <ul
                        className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded w-80 mt-2 ml-5
                        max-h-48 overflow-y-auto dark:bg-boxdark mx-auto left-40"
                      >
                        {filteredCategories.map((category, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                            onClick={() => {
                              setaddCategory(category.name);
                              setShowSuggestions(false);
                            }}
                          >
                            {category.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="px-3 py-1 mt-4 flex justify-center text-white bg-green-500 rounded w-56"
                      onClick={handleSubmitAddCategory}
                    >
                      Add Category
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Popup for Material */}
            {activePopup === "material" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:text-white p-6 rounded shadow-lg w-[700px] dark:bg-boxdark">
                  <div className="flex sm:justify-between mb-4">
                    <h2 className="text-xl font-semibold">Add Material</h2>
                    <button
                      className="px-3 py-1 text-white bg-green-500 rounded"
                      onClick={closePopup}
                    >
                      <IoMdClose />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Dropdown Menu */}
                    <div>
                      <label
                        htmlFor="categoryType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Category Type
                      </label>
                      <select
                        id="categoryType"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-boxdark"
                        onChange={(e) => setaddCategory(e.target.value)}
                      >
                        <option value="">--Select a category--</option>
                        {AllCategory.map((category, index) => (
                          <option key={index} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="material"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Material Name
                      </label>
                      <input
                        id="material"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-boxdark"
                        placeholder="Enter material name"
                        value={addMaterial}
                        onChange={handleInputChange}
                      />

                      {/* Suggestion list */}
                      {suggestions.length > 0 && (
                        <ul
                          className={`mt-2 border border-gray-300 rounded bg-white shadow-lg ${suggestions.length > 3
                            ? "max-h-32 overflow-y-auto"
                            : ""
                            }`}
                        >
                          {suggestions.slice(0, 3).map((suggestion, index) => (
                            <li
                              key={index}
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion.name}
                            </li>
                          ))}

                          {/* Render hidden suggestions with scrollbar */}
                          {suggestions.length > 3 &&
                            suggestions.slice(3).map((suggestion, index) => (
                              <li
                                key={index}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                {suggestion.name}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      className="px-3 py-1 mt-4 text-white bg-green-500 rounded w-56"
                      onClick={handleSubmitAddMaterial}
                    >
                      Add Material
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Popup for Item */}
            {activePopup === "item" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-28">
                <div className="bg-white dark:text-white p-4 rounded shadow-lg w-[700px] dark:bg-boxdark">
                  <div className="flex sm:justify-between">
                    <h2 className="text-xl font-semibold">Add Item</h2>
                    <button
                      className="px-3 py-1 text-white bg-green-500 rounded"
                      onClick={closePopup}
                    >
                      <IoMdClose />
                    </button>
                  </div>

                  <div className="flex mt-2">
                    <div className="col-6">
                    <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-1 "
                      >
                        Category
                      </label>
                      <select
                        value={newOutward.CategoryName}
                        onChange={handleCategoryChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-boxdark"
                      >
                        <option value="" disabled>Select Category</option>
                        {AllCategory.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label
                        htmlFor="material"
                        className="block text-sm font-medium text-gray-700 mb-1 "
                      >
                        Material
                      </label>
                      <select
                        id="categoryType"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-boxdark"
                        onChange={(e) => 
                          {
                            console.log("e.target.value",e.target.value);
                            
                            setNewOutward({ ...newOutward, Material: e.target.value })
                       
                      }}
                      >
                        <option value="">Select a Material type</option>

                        {filteredMaterials.length > 0 ? (
                          filteredMaterials.map((mat) => (
                            <option key={mat._id} value={mat._id}>
                              {mat.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No materials available</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="flex mt-2">
                    <div className="col-6">
                      <label
                        htmlFor="brand"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Brand
                      </label>
                      <input
                        id="brand"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-boxdark"
                        placeholder="Brand name"
                        value={addBrand}
                        onChange={(e) => setaddBrand(e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <label
                        htmlFor="brand"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Item Name
                      </label>
                      <input
                        id="brand"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-boxdark"
                        placeholder="Item name"
                        value={additemName}
                        onChange={(e) => setadditemName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex mt-2">
                    <div className="col-4">
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 mb-1 bg-white dark:bg-boxdark"
                      >
                        Quantity
                      </label>
                      <input
                        id="quantity"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-boxdark"
                        placeholder="Quantity"
                        value={Quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="col-4">
                      <label
                        htmlFor="unit"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Unit
                      </label>
                      <input
                        id="unit"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-boxdark"
                        placeholder="Unit"
                        value={addUnit}
                        onChange={(e) => setaddUnit(e.target.value)}
                      />
                    </div>
                    <div className="col-4">
                      <label
                        htmlFor="pricePerUnit"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        PricePerUnit
                      </label>
                      <input
                        id="pricePerUnit"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-boxdark"
                        placeholder="Unit"
                        value={addPricePerUnit}
                        onChange={(e) => setaddPricePerUnit(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex mt-2">
                    <div className="col-12">
                      <label
                        htmlFor="brand"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Details
                      </label>
                      <input
                        id="brand"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white dark:bg-boxdark"
                        placeholder="Details"
                        value={addDetails}
                        onChange={(e) => setaddDetails(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    <button
                      className="px-4 py-2 text-white bg-green-500 rounded"
                      onClick={handleSubmitAddItem}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
  <div className="min-w-full">
    {/* Table Header */}
    <div className="grid grid-cols-6 sm:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5 whitespace-nowrap">
      <div className="col-span-2 flex items-center">
        <p className="font-medium">Category Name</p>
      </div>
      <div className="col-span-1 hidden items-center sm:flex">
        <p className="font-medium">Material</p>
      </div>
      <div className="col-span-1 hidden items-center sm:flex">
        <p className="font-medium">Item Name</p>
      </div>
      <div className="col-span-1 flex items-center">
        <p className="font-medium">Brand</p>
      </div>
      <div className="col-span-1 flex items-center">
        <p className="font-medium">Quantity</p>
      </div>
      <div className="col-span-1 flex items-center">
        <p className="font-medium">Unit</p>
      </div>
      <div className="col-span-1 flex items-center">
        <p className="font-medium">Price per unit</p>
      </div>
      <div className="col-span-1 flex items-center">
        <p className="font-medium">Details</p>
      </div>
    </div>

    {/* Table Body */}
    {ProductData.map((product) => (
      <div
        className="grid grid-cols-6 sm:grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
        key={product.id}
      >
        <div className="col-span-2 flex items-center cursor-pointer">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="text-sm cursor-pointer"
             onClick={() => handleModalOpen(product)}>{product.materialId.categoryId.name}</p>
          </div>
        </div>

        <div
          className="col-span-1 hidden items-center sm:flex"
        >
          <p className="text-sm mr-4">{product.materialId.name}</p>
        </div>
        <div
          className="col-span-1 hidden items-center sm:flex"
        >
          <p className="text-sm mr-4">{product.itemname}</p>
        </div>
       
        <div className="col-span-1 flex items-center">
          <p className="text-sm">{product.brand}</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm mx-2">{product.quantity}</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm">{product.unit}</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm mx-2">{product.pricePerUnit}</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm mx-2">{product.details}</p>
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Material Modal */}
        {isModalOpen1 && selectedProduct && (
          <MaterialModal
            product={selectedProduct} // Pass the selected product to the modal
            onClose={handleModalClose}
            onSubmit={handleProductSubmit} // Handle product submit to update the data
          />
        )}
      </div>
      <div>
        <h1 className="font-semibold mt-10 text-xl">Order Details</h1>
        <div className="container mx-auto p-6">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between">
            <h2 className="text-xl font-bold text-black dark:text-white">
              Orders
            </h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search by Details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border rounded-md dark:bg-boxdark"
              />

              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="ml-2 px-3 py-2 border rounded-md dark:bg-boxdark"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleSearchOrFilter(1)}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Apply
              </button>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 dark:bg-boxdark">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Order ID</th>
                  <th className="py-2 px-4 text-left">Client Name</th>
                  <th className="py-2 px-4 text-left">Address</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2 px-4">{order.orderNumber}</td>
                    <td className="py-2 px-4">{order.orderBy !== "Customer" ? order.clientName : order.userid.name}</td>
                    <td className="py-2 px-4">{order.orderBy !== "Customer" ? order.clientAddress : order.userid.fulladdress}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => openModal(order)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-4 py-2 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                className={`px-4 py-2 ${currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                  }`}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && selectedOrder && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center mt-20 items-center">
              <form
                className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto relative dark:bg-boxdark"
                onSubmit={handleSubmit}
              >
                {/* Square Close Button in the Top Right */}
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 flex items-center justify-center"
                  onClick={closeModal}
                >
                  &#x2715; {/* Close icon */}
                </button>

                <h2 className="text-xl font-semibold mb-4">
                  Order Material Details
                </h2>

                {/* Company Details */}
                <div className="mb-4">
                  <p>OrderId: {selectedOrder.orderNumber}</p>
                  <p>Client Name: {selectedOrder.clientName}</p>
                  <p>Address: {selectedOrder.clientAddress}</p>
                </div>

                {/* Table */}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2 text-left dark:border-darkinput">
                        Category
                      </th>
                      <th className="border border-gray-300 p-2 text-left dark:border-darkinput">
                        Material
                      </th>
                     
                      <th className="border border-gray-300 p-2 text-left dark:border-darkinput">
                        Brand
                      </th>
                      <th className="border border-gray-300 p-2 text-left dark:border-darkinput">
                        Unit
                      </th>
                      <th className="border border-gray-300 p-2 text-left dark:border-darkinput">
                        Quantity
                      </th>
                      <th className="border border-gray-300 p-2 text-left dark:border-darkinput">
                        Item name
                      </th>
                      {/* <th className="border border-gray-300 p-2 text-left dark:border-darkinput">Delete</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.materialOutvertEntry.length > 0 ? (
                      selectedOrder.materialOutvertEntry.map((item, index) => (
                        <tr key={index} className="bg-white dark:bg-boxdark">
                          <td className="border border-gray-300 p-2 dark:border-darkinput">
                            {item.CategoryName}
                          </td>
                          <td className="border border-gray-300 p-2 dark:border-darkinput">
                            {item.Material}
                          </td>
                        
                          <td className="border border-gray-300 p-2 dark:border-darkinput">
                            {item.Brand}
                          </td>
                          <td className="border border-gray-300 p-2 dark:border-darkinput">
                            {item.Unit}
                          </td>
                          <td className="border border-gray-300 p-2 dark:border-darkinput">
                            {item.quantityOutward}
                          </td>
                          <td className="border border-gray-300 p-2 dark:border-darkinput">
                            {item.itemname}
                          </td>
                          {/* <td className="border border-gray-300 p-2 dark:border-darkinput">
                            <button
                              type="button"
                              className="bg-red-500 text-white px-2 py-1 rounded"
                              onClick={() => removeMaterial(index)}
                            >
                              Delete
                            </button>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center p-4">
                          No materials added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* <button
                  type="submit"
                  className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-blue-800 mt-2"
                >
                  Submit
                </button> */}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Stockscreen;

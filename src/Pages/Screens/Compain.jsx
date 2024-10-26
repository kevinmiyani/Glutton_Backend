import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { common, Complain } from "../../api/call"; // Ensure this is your API utility
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const ImagePopup = ({ images, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark p-4 rounded-lg max-w-3xl w-full">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">
            &times;
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 p-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index}`}
              className="w-64 h-64 object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
const MaterialPopup = ({ materials, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark p-4 rounded-lg max-w-3xl w-full">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">
            &times;
          </button>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Category Name</th>
                <th className="border px-4 py-2">Material</th>
                <th className="border px-4 py-2">Brand</th>
                <th className="border px-4 py-2">Unit</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price Per Unit</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{material.CategoryName}</td>
                  <td className="border px-4 py-2">{material.Material}</td>
                  <td className="border px-4 py-2">{material.Brand}</td>
                  <td className="border px-4 py-2">{material.Unit}</td>
                  <td className="border px-4 py-2">{material.quantity}</td>
                  <td className="border px-4 py-2">{material.PricePerUnit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
const MaterialModal = ({ complain, onClose, onSubmit }) => {
  const [editedProduct, setEditedProduct] = useState(complain);
  const navigate = useNavigate();
  // Sync the editedProduct with the complain prop whenever it changes
  useEffect(() => {
    setEditedProduct(complain);
  }, [complain]);

  // Handle input changes when editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      const response = await Complain.updateComplain(editedProduct._id, {
        queryResolveDate: editedProduct.queryResolveDate,
        inspectionDate: editedProduct.inspectionDate,
        paymentReceived: editedProduct.paymentReceived,
        complainRemark: editedProduct.complainRemark,
      });
      if (response.status) {
        onSubmit(editedProduct); // Pass the edited product back to the parent
        window.location.reload(); // Reloads the page after navigating
      } else {
        console.error("Update failed: ", response.message);
      }
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg mt-5 dark:bg-boxdark">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Edit Material Details
          </h2>

          {/* Two-column grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <label className="block">
              <span className="text-gray-700 font-medium">
                Query Resolve Date
              </span>
              <input
                type="date"
                name="queryResolveDate"
                value={
                  editedProduct.queryResolveDate
                    ? new Date(editedProduct.queryResolveDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-boxdark"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Inspection Date</span>
              <input
                type="date"
                name="inspectionDate"
                value={
                  editedProduct.inspectionDate
                    ? new Date(editedProduct.inspectionDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-boxdark"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">
                Payment Received
              </span>
              <input
                type="text"
                name="paymentReceived"
                value={editedProduct.paymentReceived ? "Yes" : "No"}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-boxdark"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Complain Remark</span>
              <input
                type="text"
                name="complainRemark"
                value={editedProduct.complainRemark}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-boxdark"
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
              onClick={handleSubmit}
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
const Compain = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupImages, setPopupImages] = useState([]);
  const [queryDate, setQueryDate] = useState(null);
  const [inspectionDate, setInspectionDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("All");


  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        let queryParams = ``;
  
        // Append query if searchTerm is not null
        if (searchTerm && searchTerm !== "") {
          queryParams += `&query=${encodeURIComponent(searchTerm)}`;
        }
  
        // Append query date if not null
        if (queryDate) {
          const formattedQueryDate = queryDate.toISOString().split("T")[0];
          queryParams += `&startDate=${formattedQueryDate}`;
        }
  
        // Append inspection date if not null
        if (inspectionDate) {
          const formattedInspectionDate = inspectionDate.toISOString().split("T")[0];
          queryParams += `&inspectionStartDate=${formattedInspectionDate}`;

        }

        if (status !== "All") {
          queryParams += `&status=${status}`;
          console.log("status",status);
          
        }
      
  
        // Handle API calls based on search parameters
        let response;
        if (!searchTerm && !queryDate && !inspectionDate && status === "ALl") {
          // No search filters, use the default complain fetching API
          console.log("iffffff");
          
          response = await common.Complain(`?page=${currentPage}`);
        } else {
          console.log("elseee");

          // Use the search API when any search filter is applied
          response = await Complain.searchComplain(`?page=${currentPage}&${queryParams}`);
        }
  
        if (response.data) {
          setComplaints(response.data.results);
          const totalPages = Math.ceil(response.data.total / 10); // Assuming 10 items per page
          setTotalPages(totalPages);
          console.log("totalPages", totalPages);
        } else {
          console.error("Unexpected API response:", response);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
  
    fetchComplaints();
  }, [searchTerm, queryDate, inspectionDate, currentPage,status]);

  const handleImageClick = (images) => {
    setPopupImages(images);
    setShowPopup(true);
  };
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleImageClick1 = (materials) => {
    setSelectedMaterials(materials); // Pass the materialReplacement data
    setIsPopupOpen(true); // Open the popup
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleModalOpen = (data) => {
    setSelectedProduct(data); // Set the clicked product for editing
    setIsModalOpen1(true); // Open modal
  };

  const handleModalClose = () => {
    setIsModalOpen1(false); // Close modal
    setSelectedProduct(null); // Clear selected product
  };
  const handleProductSubmit = (updatedProduct) => {
    setComplaints((prevData) =>
      prevData.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    // console.log(ProductData)
  };

  const handleSubmitdelete = async () => {
    console.log(complaints.inspectionDate);
    try {
      const response = await Complain.delete(complaints[0]._id);

      if (response.status === 200) {
        // Check if the response status indicates success
        console.log(`Deleted complain with ID: ${complaints[0]._id}`);
        window.location.reload(); // Reloads the page after navigating
        // Optionally, you might want to refresh the data or update the UI to reflect the deletion
      } else {
        console.error("Delete failed: ", response.message);
      }
    } catch (error) {
      console.error("Error deleting complain: ", error);
    }
  };
  return (
    <>
      <div>
        <Breadcrumb pageName="Dellers" />
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-md overflow-hidden mb-10">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex align-middle justify-between">
            <h2 className="text-xl font-bold">Complain</h2>
          </div>

          {/* Search Bar */}
          <div className="p-3 flex gap-4">
            <input
              type="text"
              placeholder="Search by Details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-boxdark dark:border-gray-600 dark:text-white"
            />
            <div className="flex flex-col">
              <DatePicker
                selected={queryDate}
                onChange={(date) => {
                  if (date) {
                    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust date to local time
                    setQueryDate(localDate); 
                  }else{
                    setQueryDate(date); 

                  }
                  
                }}
                className="p-2 border border-gray-300 rounded-md shadow-sm dark:bg-boxdark dark:border-gray-600"
                placeholderText="Query Resolve Date"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="flex flex-col">
              <DatePicker
                selected={inspectionDate}
                onChange={(date) => {
                  if (date) {
                    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust date to local time
                    setInspectionDate(localDate); 
                  }else{
                    setInspectionDate(date); 

                  }

                }}
                className="p-2 border border-gray-300 rounded-md shadow-sm dark:bg-boxdark dark:border-gray-600"
                placeholderText="Inspection Date"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <select className="ml-2 px-3 py-2 border rounded-md dark:bg-boxdark"
             value={status}
             onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left font-semibold">Order ID</th>
                  <th className="p-3 text-left font-semibold">
                    Query Resolve Date
                  </th>
                  <th className="p-3 text-left font-semibold">
                    Inspection Date
                  </th>
                  <th className="p-3 text-left font-semibold">
                    Payment Received
                  </th>
                  <th className="p-3 text-left font-semibold">
                    Complaint Attachment
                  </th>
                  <th className="p-3 text-left font-semibold">
                    Query Attachment
                  </th>
                  <th className="p-3 text-left font-semibold">
                    Complain Remark
                  </th>
                  <th className="p-3 text-left font-semibold">
                    Material Replacement Quantity
                  </th>
                  <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Edit
                  </th>
                  <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Delete
                  </th>
                  <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
              {complaints.length > 0 ? (
                 <> 
                 {complaints.map((data, index) => {
                  const queryResolveDate = new Date(data.queryResolveDate); // Get the current date
                  const inspectionDate = new Date(data.inspectionDate); // Correctly reference data.inspectionDate

                  // Compare the inspection date with the current date to determine the status
                  let status = "";
                  if (inspectionDate >= queryResolveDate) {
                    status = "Complete"; // Inspection date is in the past
                  } else if (
                    inspectionDate.toDateString() === queryResolveDate.toDateString()
                  ) {
                    status = "In Progress"; // Inspection date is today
                  } else {
                    status = "Pending"; // Inspection date is in the future
                  }

                  return (
                    <tr
                      key={data._id}
                      className="border-b hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="p-3 text-left">
                        {data.orderNumber}
                      </td>
                      <td className="p-1 text-left">
                        {format(new Date(data.queryResolveDate), "yyyy-MM-dd")}
                      </td>
                      <td className="p-1 text-left">
                        {format(new Date(data.inspectionDate), "yyyy-MM-dd")}
                      </td>
                      <td className="p-3 text-left">
                        {data.paymentReceived ? "Yes" : "No"}
                      </td>
                      <td className="p-3 text-left">
                        {data.complainAttachment.length > 0 ? (
                          <button
                            onClick={() =>
                              handleImageClick(data.complainAttachment)
                            }
                            className="px-2 py-1 bg-green-600 text-white items-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex gap-2"
                          >
                            View
                          </button>
                        ) : (
                          "No Attachment"
                        )}
                      </td>
                      <td className="p-3 text-left">
                        {data.queryAttachment.length > 0 ? (
                          <button
                            onClick={() =>
                              handleImageClick(data.queryAttachment)
                            }
                            className="px-2 py-1 bg-green-600 text-white items-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex gap-2"
                          >
                            View
                          </button>
                        ) : (
                          "No Attachment"
                        )}
                      </td>
                      <td className="p-1 text-left">
                        {data.complainRemark || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleImageClick1(data.materialReplacement)
                          }
                          className="w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border-primary bg-primary p-2 text-white dark:bg-darksecondary dark:border-darksecondary"
                        >
                          View Material
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded transition duration-150"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent page refresh
                            handleModalOpen(data);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                      {isModalOpen1 && selectedProduct && (
                        <MaterialModal
                          complain={selectedProduct} // Pass the selected product to the modal
                          onClose={handleModalClose} // Handle product submit to update the data
                          onSubmit={handleProductSubmit}
                        />
                      )}
                      <td className="border px-4 py-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubmitdelete(data._id);
                          }}
                          className="px-2 py-1 bg-red-500 text-white hover:bg-red-600 rounded transition duration-150"
                        >
                          Delete
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        <span
                          className={`font-semibold ${
                            status === "Complete"
                              ? "text-green-500"
                              : status === "In Progress"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                </>
                ): (
                  <p>No complaints found</p>
                )}
              </tbody>
            </table>
            <div className="flex justify-between p-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {showPopup && (
          <ImagePopup
            images={popupImages}
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>
      {isPopupOpen && (
        <MaterialPopup
          materials={selectedMaterials}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
};

export default Compain;

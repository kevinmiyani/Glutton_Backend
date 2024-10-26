/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { CiSquarePlus } from "react-icons/ci";
import { common, Dealer } from "../../api/call";

const Deller = () => {
  const [Delaler, setDelaler] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const role = localStorage.getItem("role")
  const navigate = useNavigate();
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal"
  ];
  const verifyDealer = async (id) => {
    try {
      const response = await Dealer.verifyDealer(id);
      const data = response.data.data;
      if (data) {
        const updateDelaer = Delaler.map((item) => {
          if (item._id === id) {
            return { ...item, isVerified: true };
          } else {
            return item;
          }
        });
        setDelaler(updateDelaer);
      }
    } catch (error) {
      console.error("Error verifying dealer:", error);
      setError(error.message);
    }
  };

  const handleUserClick = (manager) => {
    if (!manager) {
      console.error("Manager object is null or undefined");
      return;
    }
    navigate("/dealer-profile", {
      state: { manager: { ...manager, role: "Dealer" } },
    });
  };

  const handleImageClick = (images) => {
    setSelectedImages(images);
    setShowPopup(true);
  };



  const fetchDealers = async (page) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found in local storage");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      let response = await common.getdealer(page);
      const { data, totalPages } = response.data;

      if (Array.isArray(data)) {
        setFilteredDealers(data);
        setTotalPages(totalPages); // Update total pages
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (error) {
      console.error("Error fetching dealers:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDealers(currentPage); // Fetch dealers whenever the page changes
  }, [currentPage]);

  // Apply search and filters
  const applyFilters = async (page = currentPage) => {
    try {
      setIsLoading(true);

      let response;
      const searchParam = searchTerm ? `&query=${searchTerm}` : "";
      const filterParam = filter !== "all" ? `&isVerified=${filter}` : "";
      const stateParam = stateFilter !== "all" ? `&state=${stateFilter}` : "";

      response = await Dealer.searchDealer(
        page,
        `${searchParam}${filterParam}${stateParam}`
      );
      const { results, total } = response.data;
      setFilteredDealers(results);
      setTotalPages(Math.ceil(total / 10));
    } catch (error) {
      console.error("Error applying filters:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      applyFilters(currentPage + 1);

    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      applyFilters(currentPage - 1);

    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Dellers" />
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-md overflow-hidden">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex align-middle justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Dealers
          </h2>
          <Link to="/adddeller">
            <button className="flex items-center justify-center gap-1 text-indigo-500 hover:text-indigo-700">
              <CiSquarePlus />
              <span>Add Dealer</span>
            </button>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="p-3 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by Details.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 w-1/3 dark:bg-boxdark"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2 dark:bg-boxdark"
          >
            <option value="all">All</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="border rounded px-3 py-2 dark:bg-boxdark"
          >
            <option value="all">All</option>
            {indianStates.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded"
            onClick={() => applyFilters()}
          >
            Apply
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 text-left font-semibold">Address</th>
                <th className="p-3 text-left font-semibold">Company Name</th>
                <th className="p-3 text-left font-semibold">ContactNumber</th>
                <th className="p-3 text-left font-semibold">Email</th>
                <th className="p-3 text-left font-semibold">State</th>
                <th className="p-3 text-left font-semibold">Remarks</th>
                <th className="p-3 text-left font-semibold">GSTNumber</th>
                <th className="p-3 text-left font-semibold">DealerLocation</th>
                <th className="p-3 text-left font-semibold">Verify Dealer</th>
              </tr>
            </thead>
            <tbody>
              {filteredDealers.map((dealer, index) => (
                <tr
                  key={index}
                  className={`${index !== filteredDealers.length - 1
                    ? "border-b border-gray-200"
                    : ""
                    }`}
                >
                  <td
                    className="p-3 font-medium cursor-pointer"
                    onClick={() => handleUserClick(dealer)}
                  >
                    {dealer.name}
                  </td>
                  <td className="p-3">{dealer.address}</td>
                  <td className="p-3">{dealer.companyName}</td>
                  <td className="p-3">{dealer.contactNumber}</td>
                  <td className="p-3">{dealer.email}</td>
                  <td className="p-3">{dealer.state}</td> {/* Show dealer's state */}
                  <td className="p-3">{dealer.remarks}</td>
                  <td className="p-3">{dealer.gstNumber}</td>
                  <td className="p-3">{dealer.dealerLocation}</td>
                  {role === "ADMIN" ? <td className="p-3">
                    {!dealer.isVerified && (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => verifyDealer(dealer._id)}
                      >
                        Verify
                      </button>
                    )}
                    {dealer.isVerified && (
                      <span className="text-green-500">Verified</span>
                    )}
                  </td> : <td className="p-3">
                    {!dealer.isVerified && (
                      <span className="text-red-500">UnVerified</span>

                    )}
                    {dealer.isVerified && (
                      <span className="text-green-500">Verified</span>
                    )}
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-gray-200 text-gray-600 px-3 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-200 text-gray-600 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Deller;

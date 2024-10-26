import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { common } from '../../api/call';
import { useLocation, useNavigate } from 'react-router-dom';
import user from "../../../src/images/icon/user.png";
import { CiSquarePlus } from "react-icons/ci";

const ImagePopup = ({ images, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark p-4 rounded-lg max-w-3xl w-full">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        <div className="flex overflow-x-auto gap-4 p-4">
          {images.map((image, index) => (
            <img key={index} src={image.url} alt={image.doc} className="w-64 h-64 object-cover" />
          ))}
        </div>
      </div>
    </div>
  );
};

const AddressPopup = ({ address, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full dark:bg-boxdark">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Full Address</h3>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        <p className="text-gray-700">{address}</p>
      </div>
    </div>
  );
};

const SalesManager = () => {
  const [salesManagers, setSalesManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  // State for orders
  const [orders, setOrders] = useState([]);
  const [ordercurrentPage, setorderCurrentPage] = useState(1);
  const [ordertotalPages, setorderTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Search and filter state for orders
  const [ordersearchQuery, setordersearchQuery] = useState("");
  const [filterState, setFilterState] = useState("");
  const [managerStatus, setManagerStatus] = useState("");
  const location = useLocation();
  const isDesignerPage = location.pathname.includes("designer");

  useEffect(() => {
    fetchSalesManagers();
  }, [currentPage, searchQuery, filterStatus]);

  useEffect(() => {
    fetchOrders(ordercurrentPage);
  }, [ordercurrentPage]);

  const fetchOrders = async (page) => {
    setLoading(true);
    const body = {
      managers: { SalesManager: {} },
      page,
      limit: 10,
      query: ordersearchQuery || "",
      state: filterState || "",
      managerStatus: managerStatus || "",
    };

    try {
      const response = await common.getordersbymanager(body);
      setOrders(response.data.results);
      setorderTotalPages(Math.ceil(response.data.total / response.data.limit)); 

    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchOrFilter = (page = 1) => {
    setorderCurrentPage(page);
    fetchOrders(page);
  };

  const getAddOrderLink = () => {
    switch (role) {
      case "ADMIN":
        return "/addorders";
      case "SALESMANAGER":
        return "/addsalesorder";
      case "MAINTAINANECEMANAGER":
        return "/addmaintenanceorder";
      case "LICENSEMANAGER":
        return "/addlicesingorder";
      case "STOREMANAGER":
        return "/addstockorder";
      case "PROJECTHANDLER":
        return "/addprojectorder";
      case "STATEMANAGER":
        return "/addstateorder";
      case "ACCOUNTS":
        return "/addaccountorder";
      case "STOCKMANAGER":
        return "";
      case "DESIGNER":
        return "";
      default:
        return "";
    }
  };

  const handleOrderClick = (order) => {
    setOrderId(order);

    const link = getAddOrderLink();
    if (link) {
      navigate(link, { state: { order } });
    } else if (role === "STOCKMANAGER") {
      setShowStockManagerPopup(true);
    } else if (role === "DESIGNER") {
      setShowDesignerPopup(true);
    }
  };

  const handleUserClick1 = (order) => {
    if (!order) {
      console.error("Order object is null or undefined");
      return;
    }
    navigate("/orderDetails", { state: { order } });
  };



  const fetchSalesManagers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found in local storage');
      setIsLoading(false);
      return;
    }

    // setIsLoading(true);

    try {
      let queryParams = `?page=${currentPage}`;
      let response;

      // Build query parameters based on search and filter criteria
      if (searchQuery || filterStatus !== "All") {
        if (filterStatus !== "All") {
          queryParams += `&position=${filterStatus}`;
        }
        if (searchQuery) {
          queryParams += `&query=${encodeURIComponent(searchQuery)}`;
        }

        response = await common.searchsalesManager(queryParams);
        const { results, total } = response.data;
        setSalesManagers(results);
        setTotalPages(Math.ceil(total / 10));
      } else {
        response = await common.getsalesmanager(currentPage);
        const { data, count } = response.data;
        setSalesManagers(data);
        setTotalPages(Math.ceil(count / 10));
      }



    } catch (error) {
      console.error('Error fetching sales managers:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (manager) => {
    navigate('/sales-profile', { state: { manager: { ...manager, role: 'Sales Executive' } } });
  };

  const handleImageClick = (images) => {
    setSelectedImages(images);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    setShowAddressPopup(true);
  };

  const handleCloseAddressPopup = () => {
    setShowAddressPopup(false);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const checkPendingStatus = (data) => {
    const managers = [
      'SalesManager',
      'LicenseManager',
      'ProjectHandler',
      'MaintainaneceManager',
      'StoreManager'
    ];

    const isPending = managers.some(manager => data[manager]?.status === 'Pending');
    return isPending ? "Pending" : "Complete";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];
  return (
    <>
      {role === "ADMIN" || role === "SALESMANAGER" ? (
        <>
          <div>

            <Breadcrumb pageName="Sales Managers" />
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-md overflow-hidden mb-10">
              <div className="border-b border-gray-200 dark:border-gray-700 items-center">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex align-middle justify-between">
                  <h2 className="text-xl font-bold text-black dark:text-white">Sales Executive</h2>
                </div>
                <div className="flex space-x-2 p-3">
                  <input
                    type="text"
                    placeholder="Search by Details...."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-boxdark dark:border-gray-600 dark:text-white"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-boxdark dark:border-gray-600 dark:text-white"
                  >
                    <option value="All">All</option>
                    <option value="Junior">Junior Sales Executive</option>
                    <option value="Senior">Senior Sales Executive</option>
                    <option value="Manager">Sales Manager</option>
                    <option value="Block">Block</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: 'rgba(87, 179, 62, 1)', color: 'white' }}>
                    <tr>
                      <th className="p-3 text-left font-semibold text-white">Photo</th>
                      <th className="p-3 text-left font-semibold text-white">Name</th>
                      <th className="p-3 text-left font-semibold text-white hidden md:table-cell">Phone</th>
                      <th className="p-3 text-left font-semibold text-white hidden lg:table-cell">Address</th>
                      <th className="p-3 text-left font-semibold text-white">City</th>
                      <th className="p-3 text-left font-semibold text-white">State</th>
                      <th className="p-3 text-left font-semibold text-white">Pincode</th>
                      <th className="p-3 text-left font-semibold text-white">Documents</th>
                      <th className="p-3 text-left font-semibold text-white">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesManagers.length > 0 ? (
                      salesManagers.map((manager, index) => (
                        <tr key={index}>
                          <td className="p-3">
                            <img
                              className="h-10 w-10 rounded-full object-cover cursor-pointer"
                              src={manager.profilephoto || user}
                              alt={manager.name || 'Manager'}
                            />
                          </td>
                          <td className="p-3 font-medium text-gray-800 dark:text-gray-200 cursor-pointer" onClick={() => handleUserClick(manager)}>
                            <div className="truncate max-w-[120px]">{manager.name}</div>
                          </td>
                          <td className="p-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">
                            <div className="truncate max-w-[120px]">{manager.phonenumber}</div>
                          </td>
                          <td className="p-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">
                            <div className="truncate max-w-[180px]">{manager.fulladdress}</div>
                            <button className="text-blue-500 hover:text-blue-700 text-sm" onClick={() => handleAddressClick(manager.fulladdress)}>View More</button>
                          </td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">
                            <div className="truncate max-w-[90px]">{manager.villageorcity}</div>
                          </td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">
                            <div className="truncate max-w-[90px]">{manager.state}</div>
                          </td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">
                            <div className="truncate max-w-[90px]">{manager.pincode}</div>
                          </td>
                          {/* <td className="p-3 text-gray-600 dark:text-gray-300">
                          <button className="text-blue-500 hover:text-blue-700 text-sm" onClick={() => handleImageClick(manager.documents)}>View Documents</button>
                        </td> */}
                          <td className="p-3">
                            {manager.attachdocs && manager.attachdocs.length > 0 ? (
                              <div className="relative inline-block">
                                <img
                                  src={manager.attachdocs[0].url}
                                  alt={manager.attachdocs[0].doc}
                                  className="w-12 h-12 object-cover rounded cursor-pointer"
                                  onClick={() => handleImageClick(manager.attachdocs)}
                                />
                                {manager.attachdocs.length > 1 && (
                                  <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full">
                                    +{manager.attachdocs.length - 1}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">None</span>
                            )}
                          </td>
                          <td className="p-3 text-gray-600 dark:text-gray-300">
                            <div className="truncate max-w-[120px]">{manager.email}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="p-3 text-center text-gray-600">No sales managers found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between p-4">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="bg-blue-500 text-white p-2 rounded">Previous</button>
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="bg-blue-500 text-white p-2 rounded">Next</button>
              </div>
            </div>
            {/* Order Table with Filters and Search */}
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-md overflow-hidden mb-10">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Orders
                </h2>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search by Details..."
                    value={ordersearchQuery}
                    onChange={(e) => setordersearchQuery(e.target.value)}
                    className="px-3 py-2 border rounded-md dark:bg-boxdark"
                  />
                  <select
                    value={managerStatus}
                    onChange={(e) => setManagerStatus(e.target.value)}
                    className="ml-2 px-3 py-2 border rounded-md dark:bg-boxdark"
                  >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                    <option value="OnHold">OnHold</option>
                    <option value="Query">Query</option>
                    <option value="OnWorking">OnWorking</option>
                    <option value="Lost">Lost</option>
                    <option value="In Progress">In Progress</option>
                  </select>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="p-3 text-left font-semibold">OrderId</th>
                      <th className="p-3 text-left font-semibold">Name</th>
                      {!isDesignerPage && (
                        <>
                          <th className="p-3 text-left font-semibold hidden md:table-cell">
                            Phone Number
                          </th>
                        </>
                      )}
                      <th className="p-3 text-left font-semibold hidden lg:table-cell">
                        Address
                      </th>
                      {!isDesignerPage && (
                        <>
                          {role === "ADMIN" && (
                            <th className="p-3 text-left font-semibold hidden lg:table-cell">
                              Assign
                            </th>
                          )}
                        </>
                      )}
                      {!isDesignerPage && (
                        <>
                          <th className="p-3 text-left font-semibold">
                            Advance Payment
                          </th>
                        </>
                      )}
                      <th className="p-3 text-left font-semibold">Photos</th>
                      <th className="p-3 text-left font-semibold">Kilowatt</th>
                      {role !== "ADMIN" && (
                        <th className="p-3 text-left font-semibold">Lead Type</th>
                      )}
                      <th className="p-3 text-left font-semibold">Solar Type</th>
                      {role === "DESIGNER" && (
                        <th className="p-3 text-left font-semibold hidden lg:table-cell">
                          Status
                        </th>
                      )}{" "}
                      {/* <th className="p-3 text-left font-semibold">Add Details</th> */}
                      {!isDesignerPage && (
                        <>
                          <th className="p-3 text-left font-semibold">
                            Order Status
                          </th>
                          <th className="p-3 text-left font-semibold">Message</th>
                        </>
                      )}
                      {/* Conditionally render these columns if the location path includes 'designer' */}
                      {isDesignerPage && (
                        <>
                          <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4">
                            Customer Status
                          </th>
                          <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4">
                            Designer Status
                          </th>
                          <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4">
                            Design View
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center p-3">
                          Loading...
                        </td>
                      </tr>
                    ) : orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr
                          key={index}
                          className={`${index !== orders.length - 1
                            ? "border-b border-gray-200"
                            : ""
                            } cursor-pointer`}
                        >
                          {role === "ADMIN" ||
                            role === "STATEMANAGER" ||
                            role === "SALESMANAGER" ? (
                            <td
                              className="p-3 text-black dark:text-white cursor-pointer"
                              onClick={() => handleUserClick1(order)}
                            >
                              {order.orderNumber}
                            </td>
                          ) : (
                            <td className="p-3 text-black dark:text-white cursor-pointer">
                              {order.orderNumber}
                            </td>
                          )}

                          {role !== "DESIGNER" ? (
                            <>
                              <td
                                className="p-3 text-black dark:text-white"
                              // onClick={() => handleUserClick(order)}
                              >
                                {order.orderBy !== "Customer"
                                  ? order.clientName
                                  : order.userid?.name}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-3 text-black dark:text-white">
                                {order.orderBy !== "Customer"
                                  ? order.clientName
                                  : order.userid?.name}
                              </td>
                            </>
                          )}

                          {isDesignerPage ? (
                            ""
                          ) : (
                            <>
                              <td className="p-3 text-black dark:text-white hidden md:table-cell">
                                {order.orderBy !== "Customer"
                                  ? order.contactNumber
                                  : order.userid?.phonenumber}
                              </td>
                            </>
                          )}
                          <td className="p-3 text-black dark:text-white hidden lg:table-cell">
                            {order.orderBy !== "Customer"
                              ? order.clientAddress
                              : order.userid?.fulladdress}
                          </td>
                          {isDesignerPage ? (
                            ""
                          ) : (
                            <>
                              {role === "ADMIN" && (
                                <td className="p-3 text-black dark:text-white hidden lg:table-cell">
                                  {order.SalesManager.managerid !== null
                                    ? "Assign"
                                    : "UnAssign"}
                                </td>
                              )}
                            </>
                          )}

                          {isDesignerPage ? (
                            ""
                          ) : (
                            <td className="p-3 text-black dark:text-white">
                              {role === "SALESMANAGER" ||
                                role === "LICENSEMANAGER" ||
                                role === "PROJECTHANDLER" ||
                                role === "STOREMANAGER" ||
                                role === "STOCKMANAGER" ||
                                role === "ADMIN" ||
                                role === "ACCOUNTS" ||
                                role === "STATEMANAGER" ? (
                                order.advanceAmount || 0
                              ) : (
                                <>{order.advanceAmount > 0 ? "yes" : "no"}</>
                              )}
                            </td>
                          )}

                          <td className="p-3 text-black dark:text-white">
                            {order?.images?.length > 0 ? (
                              <button
                                className="px-2 py-1 text-white bg-green-600 hover:bg-green-700 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageClick(order?.images);
                                }}
                              >
                                View
                              </button>
                            ) : (
                              "No Images"
                            )}
                          </td>
                          <td className="p-3 text-black dark:text-white">
                            {order.conformKilowatt}
                          </td>
                          {role !== "ADMIN" && (
                            <td className="p-3 text-black dark:text-white">
                              {order.typeOfLead}
                            </td>
                          )}
                          <td className="p-3 text-black dark:text-white">
                            {order.typeOfSolarSystem}
                          </td>
                          {role === "DESIGNER" ? (
                            <>
                              <td className="p-3 text-black dark:text-white">
                                {role === "CUSTOMER" ? order.customerstatus : "no"}
                              </td>
                            </>
                          ) : (
                            ""
                          )}

                          {/* {(role === "SALESMANAGER" ||
                            role === "LICENSEMANAGER" ||
                            role === "PROJECTHANDLER" ||
                            role === "STOREMANAGER" ||
                            role === "STOCKMANAGER" ||
                            role === "STATEMANAGER" ||
                            role === "MAINTAINANECEMANAGER" ||
                            role === "ADMIN" ||
                            role === "DESIGNER") && (
                              <td
                                className="p-3 text-black dark:text-white cursor-pointer"
                                onClick={() => handleOrderClick(order)}
                              >
                                <button className="px-2 py-1 bg-green-600 text-white items-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex gap-2">
                                  <CiSquarePlus size={20} />
                                  Add
                                </button>
                              </td>
                            )} */}

                          {role === "ACCOUNTS" && (
                            <td
                              className="p-3 text-black dark:text-white cursor-pointer"
                              onClick={() => accountOrder(order)}
                            >
                              <button className="px-2 py-1 bg-green-600 text-white items-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex gap-2">
                                <CiSquarePlus size={20} />
                                Add
                              </button>
                            </td>
                          )}
                          {isDesignerPage ? (
                            ""
                          ) : (
                            <>
                              {role === "SALESMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.SalesManager.status}
                                </td>
                              )}
                              {role === "ACCOUNTS" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.Accounts.status}
                                </td>
                              )}
                              {role === "LICENSEMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.LicenseManager.status}
                                </td>
                              )}
                              {role === "PROJECTHANDLER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.ProjectHandler.status}
                                </td>
                              )}
                              {role === "MAINTAINANECEMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.MaintainaneceManager.status}
                                </td>
                              )}
                              {role === "STOREMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.StoreManager.status}
                                </td>
                              )}
                              {role === "DESIGNER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.Designer.status}
                                </td>
                              )}
                              {role === "ADMIN" && (
                                <td className="p-3 text-black dark:text-white">
                                  {checkPendingStatus(order)}
                                </td>
                              )}
                              {role === "STATEMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {checkPendingStatus(order)}
                                </td>
                              )}
                              {role === "STOCKMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.material.length > 0
                                    ? "Complete"
                                    : "Peding"}
                                </td>
                              )}
                            </>
                          )}

                          {/* message */}
                          {isDesignerPage ? (
                            ""
                          ) : (
                            <>
                              {role === "SALESMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.SalesManager.message}
                                </td>
                              )}
                              {role === "LICENSEMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.LicenseManager.message}
                                </td>
                              )}
                              {role === "PROJECTHANDLER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.ProjectHandler.message}
                                </td>
                              )}
                              {role === "MAINTAINANECEMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.MaintainaneceManager.message}
                                </td>
                              )}
                              {role === "STOREMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.StoreManager.message}
                                </td>
                              )}
                              {role === "DESIGNER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.Designer.message}
                                </td>
                              )}
                              {role === "ACCOUNTS" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.Accounts.message}
                                </td>
                              )}
                              {role === "ADMIN" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.message || ""}
                                </td>
                              )}
                              {role === "STATEMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.remarks || ""}
                                </td>
                              )}
                              {role === "STOCKMANAGER" && (
                                <td className="p-3 text-black dark:text-white">
                                  {order.remarks || ""}
                                </td>
                              )}
                            </>
                          )}

                          {isDesignerPage && (
                            <td className="p-3 text-black dark:text-white">
                            {order.designConformation === "YES" ? "Approved" : "Reject"}
                            </td>
                          )}
                          {isDesignerPage && (
                            <td className="p-3 text-black dark:text-white">
                              {order.Designer?.status}
                            </td>
                          )}
                          {isDesignerPage && (
                            <td className="p-3 text-black dark:text-white">
                              <button
                                // onClick={handleImageClick1(order.designPlan)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageClick1(order.designPlan);
                                }}
                                className="px-2 py-1 bg-green-600 text-white items-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex gap-2"
                              >
                                <CiSquarePlus size={20} />
                                View
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center p-3">
                          No Orders Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-3 flex justify-between">
                <button
                  className={`px-4 py-2 bg-gray-300 dark:bg-gray-600  rounded ${ordercurrentPage === 1 && "opacity-50"
                    }`}
                  onClick={() =>
                    setorderCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                  }
                  disabled={ordercurrentPage === 1}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
                  Page {ordercurrentPage} of {ordertotalPages}
                </span>
                <button
                  className={`px-4 py-2 bg-gray-300 dark:bg-gray-600  rounded ${ordercurrentPage === ordertotalPages && "opacity-50"
                    }`}
                  onClick={() =>
                    setorderCurrentPage((prevPage) =>
                      Math.min(prevPage + 1, ordertotalPages)
                    )
                  }
                  disabled={ordercurrentPage === ordertotalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center mt-10">You do not have permission to view this page.</div>
      )}

      {showPopup && <ImagePopup images={selectedImages} onClose={handleClosePopup} />}
      {showAddressPopup && <AddressPopup address={selectedAddress} onClose={handleCloseAddressPopup} />}
    </>
  );
};

export default SalesManager;

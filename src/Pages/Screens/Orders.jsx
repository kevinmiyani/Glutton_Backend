import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiSquarePlus } from "react-icons/ci";
import { common } from "../../api/call";
import { Adminorder } from './Adminorder';
import OtherWiseorderDisplay from './OtherWiseorderDisplay';
import user from "../../../src/images/icon/user.png";

const ImagePopup = ({ images, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full dark:bg-boxdark">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">
            &times;
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 p-4">
          {images.map((image, index) => (
            <img key={index} src={image} alt="Order" className="w-64 h-64 object-cover" />
          ))}
        </div>
      </div>
    </div>
  );
};

const ImagePopup1 = ({ images, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full dark:bg-boxdark">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">
            &times;
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 p-4">
          <img src={images} alt="No Photos" className="w-64 h-64 object-cover" />
        </div>
      </div>
    </div>
  );
};
const Order = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // State for orders
  const [orders, setOrders] = useState([]);
  const [ordercurrentPage, setorderCurrentPage] = useState(1);
  const [ordertotalPages, setorderTotalPages] = useState(1);
  const [orderId, setOrderId] = useState("");

  // Search and filter state for orders
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const isDesignerPage = location.pathname.includes("designer");
  const role = localStorage.getItem("role");
  const uid = localStorage.getItem("uid");

  const stateOptions = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];
  const [stateFilter, setStateFilter] = useState("");
  const [salesManagerFilter, setSalesManagerFilter] = useState("");
  const [dealerFilter, setDealerFilter] = useState("");
  const userRole = localStorage.getItem('role');
  const position = localStorage.getItem('position');
  const [filterStatus, setFilterStatus] = useState("All");
  const [salesManagerOptions, setSalesManagerOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [dealerrpage, setdealerrpage] = useState(1);
  const [dealerhasMore, setdealerhasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dealerOptions, setDealerOptions] = useState([]);



  const [showPopup, setShowPopup] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImages1, setSelectedImages1] = useState([]);
  const [showPopup1, setShowPopup1] = useState(false);

  const handleImageClick = (images) => {
    setSelectedImages(images);
    setShowPopup(true);
  };
  const handleImageClick1 = (images) => {
    setSelectedImages1(images);
    setShowPopup1(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowPopup1(false);
  };
  // Fetch dealers when the component mounts or the page changes
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        setLoading(true);
        const response = await common.getdealer(dealerrpage);
        const data = response?.data?.data;

        if (data && data.length > 0) {
          setDealerOptions(data);
        } else {
          setdealerhasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch dealers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealers();
  }, [page]);

  const handleDealerScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom && dealerhasMore && !loading) {
      setdealerrpage((prev) => prev + 1);
    }
  };

  const fetchSalesManagers = async (page) => {
    try {
      setLoading(true);
      const response = await common.getsalesmanager(page)
      const data = response?.data?.data;

      if (data.length > 0) {
        setSalesManagerOptions(data);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch sales managers:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (hasMore && !loading) {
      fetchSalesManagers(page);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [ordercurrentPage]);


  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (
        searchQuery ||
        stateFilter ||
        salesManagerFilter ||
        dealerFilter ||
        filterStatus !== "All"
      ) {
        // Build query params for search
        let queryParams = "";
        if (role !== 'Admin') queryParams += `&currentManagerId=${uid}`
        if (searchQuery) queryParams += `&query=${searchQuery}`;
        if (stateFilter) queryParams += `&state=${stateFilter}`;
        if (salesManagerFilter) queryParams += `&salesManagerId=${salesManagerFilter}`;
        if (dealerFilter) queryParams += `&dealerId=${dealerFilter}`;
        if (filterStatus && filterStatus !== "All") queryParams += `&orderStatus=${filterStatus}`;

        // Use search API when filters/search query are applied
        response = await common.searchOrder(ordercurrentPage, queryParams);
        // Update state with fetched data

        setOrders(response.data.results);
        setorderTotalPages(Math.ceil(response.data.total / 10));
      } else {
        // Use getorders API when no filters/search query
        response = await common.getorders(ordercurrentPage, 10); // Assuming limit is 10
        // Update state with fetched data
        setOrders(response.data.orders);
        setorderTotalPages(response.data.totalPages);
      }


    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error);
    } finally {
      setIsLoading(false);
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

  // Handle navigation to the manager profile page
  const handleUserClick = (manager) => {
    if (!manager) {
      console.error("Manager object is null or undefined");
      return;
    }
    navigate("/state-profile", {
      state: { manager: { ...manager, role: "State Executive" } },
    });
  };

  return (
    <>
      {userRole === "ADMIN" || userRole === "SALESMANAGER" || userRole === "STATEMANAGER" ? (
        <>
          <div className="flex space-x-2 p-3">
            {/* Search Input First */}
            <input
              type="text"
              placeholder="Search by Order Details...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-boxdark dark:border-gray-600 dark:text-white"
            />

            {/* Status Dropdown Third */}
            <select
              className="bg-gray-200 dark:bg-gray-700 dark:bg-boxdark  p-2 rounded"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
              <option value="Onhold">On Hold</option>
              <option value="query">Query</option>
              <option value="Onworking">On Working</option>
            </select>
          </div>

          <div className="p-4 bg-gray-800 w-full">
            <div className="flex space-x-4 justify-between">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="p-2 rounded bg-gray-700 dark:bg-boxdark"
              >
                <option value="">Select State</option>
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              {userRole === "SALESMANAGER" && position === "Manager" && (
                // <select
                //   value={salesManagerFilter}
                //   onChange={(e) => setSalesManagerFilter(e.target.value)}
                //   className="p-2 rounded bg-gray-700 dark:bg-boxdark"
                // >
                //   <option value="">Select Sales Executive</option>
                //   {salesManagerOptions.map((manager) => (
                //     <option key={manager} value={manager}>
                //       {manager}
                //     </option>
                //   ))}
                // </select>
                <select
                  value={salesManagerFilter}
                  onChange={(e) => setSalesManagerFilter(e.target.value)}
                  onScroll={handleScroll}
                  className="p-2 rounded bg-gray-700 dark:bg-boxdark"
                >
                  <option value="">Select Sales Executive</option>
                  {salesManagerOptions.map((manager, index) => (
                    <option key={index} value={manager._id}>
                      {manager.name}
                    </option>
                  ))}
                  {loading && <option>Loading more...</option>}
                </select>
              )}

              {userRole !== "SALESMANAGER" && (
                <div>
                  <select
                    value={dealerFilter}
                    onChange={(e) => setDealerFilter(e.target.value)}
                    className="p-2 rounded bg-gray-700 dark:bg-boxdark"
                    onScroll={handleDealerScroll}
                  >
                    <option value="">Select Dealer</option>
                    {dealerOptions.map((dealer, index) => (
                      <option key={index} value={dealer._id}>
                        {dealer.name}
                      </option>
                    ))}
                    {loading && <option>Loading...</option>}
                  </select>
                </div>
              )}

              {/* Apply Button */}
              <button
                className="p-2 bg-indigo-600 text-white rounded"
                onClick={() => handleSearchOrFilter()}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      ) : null}


      {userRole === 'ADMIN' || userRole === "SALESMANAGER" || userRole === "STATEMANAGER" ? <Adminorder orderData={orders}
        currentPage={ordercurrentPage}
        totalPages={ordertotalPages}
        setCurrentPage={setorderCurrentPage}
      /> : ""}

      {/* Order Table with Filters and Search */}
      {userRole === 'ADMIN' || userRole === "SALESMANAGER" || userRole === "STATEMANAGER" ?
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-md overflow-hidden mt-10">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between">
            <h2 className="text-xl font-bold text-black dark:text-white">
              Orders
            </h2>

          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left font-semibold">Add Details</th>
                  <th className="p-3 text-left font-semibold">OrderNumber</th>
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
                {isLoading ? (
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

                      {(role === "SALESMANAGER" ||
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
                        )}

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
                          {order._id}
                        </td>
                      )}

                      {role !== "DESIGNER" ? (
                        <>
                          <td
                            className="p-3 text-black dark:text-white cursor-pointer"
                          >
                            {order.orderBy !== "Customer"
                              ? order.clientName
                              : order.userid?.name}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-black dark:text-white cursor-pointer">
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
                        {order.images?.length > 0 ? (
                          <button
                            className="px-2 py-1 text-white bg-green-600 hover:bg-green-700 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageClick(order.images);
                            }}
                          >
                            View
                          </button>
                        ) : (
                          "No Images"
                        )}

                      </td>
                      {showPopup && (
                        <ImagePopup images={selectedImages} onClose={handleClosePopup} />
                      )}
                      {showPopup1 && (
                        <ImagePopup1 images={selectedImages1} onClose={handleClosePopup} />
                      )}

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
                              {order.StateManager.status}
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
                          {order.Customer?.status}
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
        : <></>}
      {!['ADMIN', "SALESMANAGER", "STATEMANAGER"].includes(userRole) &&
        <div className='mt-10'>
          {/* <Adminorder/> */}
          <OtherWiseorderDisplay />
        </div>}


    </>
  );
};

export default Order;

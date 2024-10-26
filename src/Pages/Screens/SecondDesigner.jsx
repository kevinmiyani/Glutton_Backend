

import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiSquarePlus } from "react-icons/ci";
import { common } from "../../api/call";
import user from "../../images/icon/user.png"

import StockManagerPopup from "./StockManagerPopup";
import DesignerPopup from "./DesignerPopup";

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

  const [orders, setOrders] = useState([]);
  const [ordercurrentPage, setorderCurrentPage] = useState(1);
  const [ordertotalPages, setorderTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Search and filter state for orders
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState("");
  const [managerStatus, setManagerStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const [showStockManagerPopup, setShowStockManagerPopup] = useState(false);
  const [showDesignerPopup, setShowDesignerPopup] = useState(false);
  const [selectedImages1, setSelectedImages1] = useState([]);


  const location = useLocation();
  const isDesignerPage = location.pathname.includes("designer");
  const role = localStorage.getItem("role");
  const uid = localStorage.getItem("uid");

  const [showPopupimg, setShowPopupimg] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageClick = (images) => {
    setSelectedImages(images);
    setShowPopupimg(true);
  };
  const handleImageClick1 = (images) => {
    setSelectedImages1(images);
    setShowPopup1(true);
  };

  const handleClosePopup = () => {
    setShowPopup1(false);
    setShowPopup(false);
    setShowPopupimg(false);

  };
  useEffect(() => {
    fetchOrders(ordercurrentPage);
  }, [ordercurrentPage]);

  const fetchOrders = async (page) => {
    setIsLoading(true);
    const body = {
      managers: {},
      page,
      limit: 10,
      query: searchQuery || "",
      state: filterState || "",
      managerStatus: managerStatus || "",
    };

    switch (role) {
      case "SALESMANAGER":
        body.managers.SalesManager = { managerid: uid };
        break;
      case "LICENSEMANAGER":
        body.managers.LicenseManager = { managerid: uid };
        break;
      case "PROJECTHANDLER":
        body.managers.ProjectHandler = { managerid: uid };
        break;
      case "STOREMANAGER":
        body.managers.StoreManager = { managerid: uid };
        break;
      case "MAINTAINANECEMANAGER":
        body.managers.MaintainaneceManager = { managerid: uid };
        break;
      case "STATEMANAGER":
        body.managers.StateManager = { managerid: uid };
        break;
      case "DESIGNER":
        body.managers.Designer = { managerid: uid };
        break;
      case "ACCOUNTS":
        body.managers.Accounts = { managerid: uid };
        break;
      default:
        console.warn(`No case for role: ${role}`);
    }

    console.log("body", body);

    try {
      const response = await common.getordersbymanager(body);
      setOrders(response.data.results);
      setorderTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error)
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
    navigate("/manager-profile", {
      state: { manager: { ...manager, role: "State Executive" } },
    });
  };
  const accountOrder = (manager) => {
    if (!manager) {
      console.error("Manager object is null or undefined");
      return;
    }
    navigate("/addaccountorder", {
      state: { manager: { ...manager, role: role } },
    });
  };
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <>


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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                {role !== "DESIGNER" && (
                  <>
                    <th className="p-3 text-left font-semibold hidden md:table-cell">
                      Phone Number
                    </th>
                  </>
                )}
                <th className="p-3 text-left font-semibold hidden lg:table-cell">
                  Address
                </th>
                {role !== "DESIGNER" && (
                  <>
                    {role === "ADMIN" && (
                      <th className="p-3 text-left font-semibold hidden lg:table-cell">
                        Assign
                      </th>
                    )}
                  </>
                )}
                {role !== "DESIGNER" && (
                  <>
                    <th className="p-3 text-left font-semibold">Advance Payment</th>
                  </>
                )}
                <th className="p-3 text-left font-semibold">Photos</th>
                <th className="p-3 text-left font-semibold">Kilowatt</th>
                {(role !== 'ADMIN') && <th className="p-3 text-left font-semibold">Lead Type</th>}
                <th className="p-3 text-left font-semibold">Solar Type</th>
                {(role === 'DESIGNER') && <th className="p-3 text-left font-semibold hidden lg:table-cell">Status</th>}
                <th className="p-3 text-left font-semibold">Add Details</th>
                <th className="p-3 text-left font-semibold">Client Latitude</th>
                <th className="p-3 text-left font-semibold">Client Longitude</th>
                {role !== "DESIGNER" && (
                  <>
                    <th className="p-3 text-left font-semibold">Order Status</th>
                    <th className="p-3 text-left font-semibold">Message</th>
                  </>
                )}

                {/* Conditionally render these columns if the location path includes 'designer' */}
                {role === "DESIGNER" && (
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
                    className={`${index !== orders.length - 1 ? 'border-b border-gray-200' : ''} cursor-pointer`}
                  >
                    {role === "ADMIN" || role === "STATEMANAGER" || role === "SALESMANAGER" ? <td className="p-3 text-black dark:text-white cursor-pointer" onClick={() => handleUserClick1(order)}>
                      {order.orderNumber}
                    </td> : <td className="p-3 text-black dark:text-white cursor-pointer">
                      {order.orderNumber}
                    </td>}


                    {role !== "DESIGNER" ? (<><td
                      className="p-3 text-black dark:text-white cursor-pointer"
                      onClick={() => handleUserClick(order)}
                    >
                      {order.orderBy !== "Customer"
                        ? order.clientName
                        : order.userid?.name}
                    </td></>) : (<><td
                      className="p-3 text-black dark:text-white cursor-pointer">
                      {order.orderBy !== "Customer"
                        ? order.clientName
                        : order.userid?.name}
                    </td></>)}

                    {role === "DESIGNER" ? "" : <>
                      <td className="p-3 text-black dark:text-white hidden md:table-cell">
                        {order.orderBy !== "Customer"
                          ? order.contactNumber
                          : order.userid?.phonenumber}
                      </td>
                    </>}
                    <td className="p-3 text-black dark:text-white hidden lg:table-cell">
                      {order.orderBy !== "Customer"
                        ? order.clientAddress
                        : order.userid?.fulladdress}
                    </td>
                    {role === "DESIGNER" ? "" : <>
                      {role === "ADMIN" && (
                        <td className="p-3 text-black dark:text-white hidden lg:table-cell">
                          {order.SalesManager.managerid !== null
                            ? "Assign"
                            : "UnAssign"}
                        </td>
                      )}
                    </>}

                    {role === "DESIGNER" ? "" : <td className="p-3 text-black dark:text-white">
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
                    </td>}

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
                    <td className="p-3 text-black dark:text-white">
                      {order.expectedKilowatt}
                    </td>
                    {role !== "ADMIN" && (
                      <td className="p-3 text-black dark:text-white">
                        {order.typeOfLead}
                      </td>
                    )}
                    <td className="p-3 text-black dark:text-white">
                      {order.typeOfSolarSystem}
                    </td>
                    {(role === 'DESIGNER') ? <><td className="p-3 text-black dark:text-white">
                      {(role === 'CUSTOMER') ? (
                        order.customerstatus
                      ) : "no"}
                    </td></> : ""}


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
                    <td className="p-3 text-black dark:text-white">
                      {order.clientLatitude || "N/A"}
                    </td>
                    <td className="p-3 text-black dark:text-white">
                      {order.clientLongitude || "N/A"}
                    </td>
                    {role === "DESIGNER" ? "" : <>
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
                          {order.material.length > 0 ? "Complete" : "Peding"}
                        </td>
                      )}</>}


                    {/* message */}
                    {role === "DESIGNER" ? "" : <>
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
                    </>}

                    {role === "DESIGNER" && (
                      <td className="p-3 text-black dark:text-white">
                        {order.designConformation === "YES" ? "Approved" : "Reject"}
                      </td>
                    )}
                    {role === "DESIGNER" && (
                      <td className="p-3 text-black dark:text-white">
                        {order.Designer?.status}
                      </td>
                    )}
                    {role === "DESIGNER" && (
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
            className={`px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded ${ordercurrentPage === 1 && "opacity-50"
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
      {showPopupimg && (
        <ImagePopup images={selectedImages} onClose={handleClosePopup} />
      )}
      {showPopup1 && (
        <ImagePopup1 images={selectedImages1} onClose={handleClosePopup} />
      )}

      {showStockManagerPopup && (
        <StockManagerPopup
          orderId={orderId}
          onClose={() => setShowStockManagerPopup(false)}
        />
      )}
      {showDesignerPopup && (
        <DesignerPopup
          orderId={orderId}
          onClose={() => setShowDesignerPopup(false)}
        />
      )}
    </>
  );
};

export default Order;

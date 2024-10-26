import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { FaArrowLeftLong } from "react-icons/fa6";
import { common, License, Maintenance, Project, Sales, StoreManager, StockManager } from "../../api/call.js";
import { getCollection } from "../../api/helper";
import { ToastContainer, toast } from "react-toastify";

const Addorders = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Helper function to get options for each key
  const getOptionsForKey = (key) => {
    switch (key) {
      case 'salesexecutive':
        return salesexecutives;
      case 'licenseManager':
        return licenseManagers;
      case 'projectHandler':
        return projectHandlers;
      case 'maintenanceManager':
        return maintenanceManagers;
      case 'storeManager':
        return storeManagers;
      case 'designer':
        return designers;
      case 'stateManager':
        return stateManagers
      default:
        return [];
    }
  };

  const [salesexecutives, setSalesExecutives] = useState([]);
  const [licenseManagers, setLicenseManagers] = useState([]);
  const [projectHandlers, setProjectHandlers] = useState([]);
  const [maintenanceManagers, setMaintenanceManagers] = useState([]);
  const [storeManagers, setStoreManagers] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [stateManagers, setStateManagers] = useState([]);
  const [orderLoading, setorderLoading] = useState(false);
  const navigate = useNavigate()


  const [formData, setFormData] = useState({
    id: "",
    clientName: "",
    clientEmail: "",
    contactNumber: "",
    conformKilowatt: "",
    salesexecutive: "",
    licenseManager: "",
    projectHandler: "",
    maintenanceManager: "",
    storeManager: "",
    designer: "",
    stateManager: "",
    orderNumber: ""
  });

  const [managers, setManagers] = useState({
    salesexecutive: null,
    licenseManager: null,
    projectHandler: null,
    maintenanceManager: null,
    storeManager: null,
    designer: null,
    stateManager: null
  });

  const order = location.state?.order || {};

  useEffect(() => {
    if (order) {


      setFormData({
        clientName: order._id ? (order.orderBy === "Customer" ? order.userid.name : order.clientName) : "",
        clientEmail: order._id ? (order.orderBy === "Customer" ? order.userid.email : order.clientEmail) : "",
        contactNumber: order._id ? (order.orderBy === "Customer" ? order.userid.phonenumber : order.contactNumber) : "",
        conformKilowatt: order._id ? order.conformKilowatt : "",
        salesexecutive: order.SalesManager.managerid ? order.SalesManager.managerid._id : "",
        licenseManager: order.LicenseManager.managerid ? order.LicenseManager.managerid._id : "",
        projectHandler: order.ProjectHandler.managerid ? order.ProjectHandler.managerid._id : "",
        maintenanceManager: order.MaintainaneceManager.managerid ? order.MaintainaneceManager.managerid._id : "",
        storeManager: order.StoreManager.managerid ? order.StoreManager.managerid._id : "",
        designer: order.Designer.managerid ? order.Designer.managerid._id : "",
        stateManager: order.StateManager.managerid ? order.StateManager.managerid._id : "",
        id: order._id || "",
        orderNumber: order.orderNumber || "",
      });
      setManagers({
        salesexecutive: order.SalesManager.managerid,
        licenseManager: order.LicenseManager.managerid,
        projectHandler: order.ProjectHandler.managerid,
        maintenanceManager: order.MaintainaneceManager.managerid,
        storeManager: order.StoreManager.managerid,
        designer: order.Designer ? order.Designer.managerid : null,
        stateManager: order.StateManager ? order.StateManager.managerid : null, // Add stateManager

      });
    }
    fetchExecutives();
  }, [order]);

  const fetchExecutives = async () => {

    try {
      const [salesResponse, licenseResponse, projectResponse, maintenanceResponse, storeResponse, designerResponse, stateManagerResponse] = await Promise.all([
        Sales.allmanager(),
        License.allsenior(),
        Project.allsenior(),
        Maintenance.allsenior(),
        StoreManager.assignstore(),
        common.getdesigner(),
        StockManager.allstateManager()
      ]);
      console.log("Asdass", salesResponse.data);


      setSalesExecutives(salesResponse.data.data);
      setLicenseManagers(licenseResponse.data.data);
      setProjectHandlers(projectResponse.data.data);
      setMaintenanceManagers(maintenanceResponse.data.data);
      setStoreManagers(storeResponse.data.data);
      console.log("storeManagers",storeManagers)
      setDesigners(designerResponse.data.data);
      setStateManagers(stateManagerResponse.data.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setorderLoading(true);


    // Define the mapping of form fields to their corresponding roles
    const roleMapping = {
      salesexecutive: "SalesManager",
      licenseManager: "LicenseManager",
      projectHandler: "ProjectHandler",
      maintenanceManager: "MaintainaneceManager",
      storeManager: "StoreManager",
      designer: "Designer",
      stateManager: "StateManager",
    };

    // Create an array of updates
    const updates = Object.keys(roleMapping).reduce((acc, key) => {
      if (formData[key]) {
        acc.push({
          AssignManagerRole: roleMapping[key],
          AssignManagerid: formData[key],
        });
      }
      return acc;
    }, []);

    const Managerdata = {
      orderId: order._id,
      MultipleManager: updates,
      data: formData,
    };

    try {
      const response = await Sales.verifySales(Managerdata);
      if (response && (response.status === 201 || response.status === 200)) {
        toast.success("Order updated successfully");
        setFormData({
          clientName: "",
          clientEmail: "",
          contactNumber: "",
          conformKilowatt: "",
          salesexecutive: "",
          licenseManager: "",
          projectHandler: "",
          maintenanceManager: "",
          storeManager: "",
          designer: "",
          stateManager: "",
        });
        navigate("/orders")
      } else {
        toast.error("Failed to update order. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setorderLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Form Layout" />
      <ToastContainer />

      <div>
        <div className="flex flex-col gap-5">
          {role === "ADMIN" && (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b flex justify-between items-center border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Order</h3>
                <Link to="/orders">
                  <button className="flex items-center justify-center gap-1">
                    <FaArrowLeftLong />
                    <span>Go Back</span>
                  </button>
                </Link>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                  {/* Old Fields */}
                  <div className="mb-4.5 mt-3">
                    <label className="mb-3 block text-black dark:text-white">order Number<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                      required
                    />
                  </div>
                  <div className="mb-4.5 mt-3">
                    <label className="mb-3 block text-black dark:text-white">Client Name<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                      required
                    />
                  </div>
                  <div className="mb-4.5 mt-3">
                    <label className="mb-3 block text-black dark:text-white">Client Email</label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleChange}
                      className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"

                    />
                  </div>
                  <div className="mb-4.5 mt-3">
                    <label className="mb-3 block text-black dark:text-white">Contact Number<span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                      required
                    />
                  </div>
                  <div className="mb-4.5 mt-3">
                    <label className="mb-3 block text-black dark:text-white">Confirm Kilowatt<span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="conformKilowatt"
                      value={formData.conformKilowatt}
                      onChange={handleChange}
                      className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                      required
                    />
                  </div>

                  {/* Conditional rendering for managers */}
                  {Object.keys(managers).map((key) => (
                    <div className="mb-4.5 mt-3" key={key}>
                      <label className="mb-3 block text-black dark:text-white">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      {managers[key] ? (
                        <div>
                          <p>Name: {managers[key].name}</p>
                          <p>Email: {managers[key].email}</p>
                        </div>
                      ) : (
                        <select
                          id={key}
                          name={key}
                          value={formData[key]}
                          onChange={handleChange}
                          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"

                        >
                          <option value="">Select {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                          {getOptionsForKey(key).map((executive) => (
                            <option key={executive._id} value={executive._id}>
                              {executive.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center border-t p-6 border-stroke dark:border-strokedark">
                  <button type="submit" className="btn-primary py-2 px-5">
                    {orderLoading ? 'Loading...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};



export default Addorders;

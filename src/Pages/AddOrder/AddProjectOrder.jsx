import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Project } from "../../api/call.js";
import { ToastContainer, toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../api/firebaseconfig.js";

const AddProjectOrder = () => {
  const location = useLocation();
  const order = location.state?.order || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orderNumber: "",
    clientName: "",
    contactNumber: "",
    clientEmail: "",
    GEDADocuments: [],
    solarSystemType: "",
    estimatedDispatchDate: "",
    paymentConfirmation: "",
    wifiConfiguration: "",
    inverterCompanyName: "",
    username: "",
    password: "",
    designConformation: "",
    installerName: "",
    projectCompletionDate: "",
    installerPrice: 0,
    meterInstallation: "",
    cigRegistrationDate: "",
    cigCompletedDate: "",
    CLGletter: [],
    id: "",
    Assignmaintenanceaddexecutive: "",
    Status: "",
    query: "",
    typeOfLead: "",
    LicenseManagerStatus: "",
    LicenseManagerMessage: "",
    MaintainaneceManagerStatus: "",
    MaintainaneceManagerMessage: "",
    StoreManagerStatus: "",
    StoreManagerMessage: "",
    DesignerStatus: "",
    DesignerMessage: "",
    AccountsStatus: "",
    AccountsMessage: "",
    CustomerStatus: "",
    CustomerMessage: "",
    SalesManagerStatus: "",
    SalesManagerMessage: "",
    clientLatitude: "",
    clientLongitude: "",
    billOfMaterials: [],

  });
  const [uploading, setUploading] = useState({});
  const [uploadProgress, setUploadProgress] = useState({
    CLGletter: [],
    GEDADocuments: []
  });
  const [executives, setExecutives] = useState([]);
  const [projectLoading, setprojectLoading] = useState(false);
  console.log("CLGletter", order);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const response = await Project.assignMaintenance();
        console.log("response", response);
        if (response.data.status) {
          setExecutives(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    console.log("executives", executives)

    fetchExecutives();
  }, []);

  useEffect(() => {
    if (order) {
      setFormData({
        id: order._id || "",
        clientName: order._id
          ? order?.orderBy === "Customer"
            ? order?.userid?.name
            : order?.clientName
          : "",
        contactNumber: order._id
          ? order.orderBy === "Customer"
            ? order?.userid?.phonenumber
            : order?.contactNumber
          : "",
        address: order._id
          ? order.orderBy === "Customer"
            ? order?.userid?.fulladdress
            : order?.clientAddress
          : "",
        clientEmail: order._id ? order.orderBy === "Customer"
          ? order?.userid?.email
          : order?.clientEmail
          : "",
        orderNumber: order?.orderNumber ? order?.orderNumber : "",
        GEDADocuments: order.GEDADocuments ? order.GEDADocuments : [],
        solarSystemType: order?.solarSystemType ? order?.solarSystemType : "",
        estimatedDispatchDate: order?.estimatedDispatchDate
          ? new Date(order?.estimatedDispatchDate).toISOString().split("T")[0]
          : "",
        billOfMaterials: order?.billOfMaterials ? order?.billOfMaterials : [],
        paymentConfirmation: order?.paymentConfirmation ? order?.paymentConfirmation : "",
        wifiConfiguration: order?.wifiConfiguration ? order?.wifiConfiguration : "",
        inverterCompanyName: order?.inverterCompanyName ? order?.inverterCompanyName : "",
        username: order?.username ? order?.username : "",
        password: order?.password ? order?.password : "",
        designConformation: order?.designConformation ? order?.designConformation : "",
        installerName: order?.installerName ? order?.installerName : "",
        projectCompletionDate: order?.projectCompletionDate
          ? new Date(order?.projectCompletionDate).toISOString().split("T")[0]
          : "",
        installerPrice: order?.installerPrice ? order?.installerPrice : "",
        meterInstallation: order.meterInstallation ? order.meterInstallation : "",
        CLGletter: order.CLGletter ? order.CLGletter : [],
        cigRegistrationDate: order.cigRegistrationDate
          ? new Date(order.cigRegistrationDate).toISOString().split("T")[0]
          : "",
        cigCompletedDate: order.cigCompletedDate
          ? new Date(order.cigCompletedDate).toISOString().split("T")[0]
          : "",
        Assignmaintenanceaddexecutive:
          order?.MaintainaneceManager?.managerid ? order.MaintainaneceManager?.managerid : "",
        Status: order.ProjectHandler.status ? order.ProjectHandler.status : "",
        query: order.ProjectHandler.message ? order.ProjectHandler.message : "",
        typeOfLead: order?.typeOfLead ? order?.typeOfLead : "",
        LicenseManagerStatus: order.LicenseManager.status,
        LicenseManagerMessage: order.LicenseManager.message,
        SalesManagerStatus: order.SalesManager.status,
        SalesManagerMessage: order.SalesManager.message,
        MaintainaneceManagerStatus: order.MaintainaneceManager.status,
        MaintainaneceManagerMessage: order.MaintainaneceManager.message,
        StoreManagerStatus: order.StoreManager.status,
        StoreManagerMessage: order.StoreManager.message,
        DesignerStatus: order.Designer.status,
        DesignerMessage: order.Designer.message,
        AccountsStatus: order.Accounts.status,
        AccountsMessage: order.Accounts.message,
        CustomerStatus: order.Customer.status,
        CustomerMessage: order.Customer.message,
        clientLongitude: order.clientLongitude ? order.clientLongitude : "",
        clientLatitude: order.clientLatitude ? order.clientLatitude : "",

      });
    }
  }, []);

  const handleFileUpload = (file, fieldName, index = null) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        // Update progress
        setUploadProgress((prev) => {
          const newProgress = [...(prev[fieldName] || [])]; // Handle both single and multiple
          if (index !== null) {
            newProgress[index] = Math.round(progress);
          } else {
            newProgress[0] = Math.round(progress); // For single file
          }
          return {
            ...prev,
            [fieldName]: newProgress,
          };
        });

        setUploading((prev) => ({
          ...prev,
          [fieldName]: true,
        }));
      },
      (error) => {
        console.error("Upload failed:", error);
        toast.error("File upload failed. Please try again.");
        setUploading((prev) => ({
          ...prev,
          [fieldName]: false,
        }));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Set formData correctly: For single file like paymentConfirmation, store it as a string
        setFormData((prevFormData) => {
          if (index !== null) {
            // For multiple files like GEDA documents
            const newDocuments = [...(prevFormData[fieldName] || [])];
            newDocuments[index] = downloadURL;
            return {
              ...prevFormData,
              [fieldName]: newDocuments,
            };
          } else {
            // For single file like paymentConfirmation
            return {
              ...prevFormData,
              [fieldName]: downloadURL, // Store as a string
            };
          }
        });

        setUploading((prev) => ({
          ...prev,
          [fieldName]: false,
        }));

        // Reset upload progress after completion
        setUploadProgress((prev) => {
          const newProgress = [...(prev[fieldName] || [])];
          if (index !== null) {
            newProgress[index] = 0;
          } else {
            newProgress[0] = 0;
          }
          return {
            ...prev,
            [fieldName]: newProgress,
          };
        });

        toast.success("File uploaded successfully");
      }
    );
  };




  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // If it's a file input, handle the file upload
    if (files) {
      const filesArray = Array.from(files);
      filesArray.forEach((file, index) => {
        handleFileUpload(file, name, filesArray.length > 1 ? index : null); // Pass index for multiple
      });
    }
    // If it's a text input, update form data directly
    else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value, // Store text input values like wifiConfiguration
      }));
    }
  };


  const handleDateChange = (e) => {
    let { name, value } = e.target;
    value = value.replace(/[^\d-]/g, '');
    if (value.length > 4 && value[4] !== '-') {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 7 && value[7] !== '-') {
      value = value.slice(0, 7) + '-' + value.slice(7);
    }
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (value.match(regex)) {
      const [day, month, year] = value.split("/");
      const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
      setFormData((prevData) => ({
        ...prevData,
        [`${name}ISO`]: isoDate,
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setprojectLoading(true);
    try {
      const Managerdata = {
        orderId: order._id,
        status: formData.Status,
        message: formData.query,
        AssignManagerRole: "MaintainaneceManager",
        AssignManagerid: formData.Assignmaintenanceaddexecutive,
        data: { ...formData,paymentConfirmation: formData.paymentConfirmation.length > 0 ? formData.paymentConfirmation :""},
      };
      console.log("Form data:", Managerdata);
      const response = await Project.verifyProject(Managerdata);
      if (response && (response.status === 201 || response.status === 200)) {
        toast.success('Order Updated Successfully');


        setTimeout(() => {
          navigate('/orders'); // Redirect to the orders page after 1 second
        }, 2000); // 500 milliseconds = 0.5 seconds
      } else {
        toast.error('Failed to Update Order. Please try again.');
      }
      console.log('Form submitted successfully:', response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error submitting the form. Please try again.");
    } finally {
      setprojectLoading(false);
    }
  };

  const formatDateForInput = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [isEditable, setIsEditable] = useState(false);



  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const [newMaterial, setNewMaterial] = useState({
    CategoryName: '',
    Material: '',
    Brand: '',
    Unit: '',
    quantity: '',
    PricePerUnit: ''
  });

  const addMaterial = () => {
    setShowModal(true);
  };

  // Closes modal
  const closeModal = () => {
    setShowModal(false);
    setNewMaterial({
      CategoryName: '',
      Material: '',
      Brand: '',
      Unit: '',
      quantity: '',
      PricePerUnit: ''
    });
  };
  const toggleModal = () => {
    setShowModal1(!showModal1);
  };

  // Handles changes in the new material input fields
  const handleNewMaterialChange = (field, value) => {
    setNewMaterial({ ...newMaterial, [field]: value });
  };

  // Adds a new material to the list and stores it
  const saveNewMaterial = () => {
    if (newMaterial.CategoryName && newMaterial.Material && newMaterial.Brand) {
      setFormData({
        ...formData,
        billOfMaterials: [...formData.billOfMaterials, newMaterial]
      });
      toast.success('Material added successfully'); // Simple success message for demonstration purposes
      closeModal(); // Close modal after adding new material
    } else {
      toast.success('Please fill in all required fields'); // Simple validation
    }
  };

  // Remove a material
  const removeMaterial = (index) => {
    const updatedMaterials = formData.billOfMaterials.filter((_, i) => i !== index);
    setFormData({ ...formData, billOfMaterials: updatedMaterials });
  };



  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b flex justify-between items-center border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add Project Order
            </h3>
            <Link to="/orders">
              <button className="flex items-center justify-center gap-1">
                <FaArrowLeftLong />
                <span>Go Back</span>
              </button>
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="p-6.5">
            {/* Order Number */}






            <div className="mb-4.5">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="orderNumber"
              >
                Order Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                value={formData?.orderNumber}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter order number"
                required
                readOnly
              />
            </div>

            {/* Name and Contact Number in One Row */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="clientName"
                >
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData?.clientName}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter client name"
                  required
                  // disabled={!!formData.clientName}  
                  readOnly
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="contactNumber"
                >
                  Contact Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData?.contactNumber}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter contact number"
                  required
                  disabled={!!formData.contactNumber}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4.5">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="clientEmail"
              >
                Email
              </label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={formData?.clientEmail}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter client email"
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="clientLatitude"
                >
                  Client Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="clientLatitude"
                  name="clientLatitude"
                  value={formData?.clientLatitude}
                  placeholder="Client Latitude"
                  onChange={handleChange}
                  className="border rounded bg-white dark:bg-boxdark  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="clientLongitude"
                >
                  Client Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="clientLongitude"
                  name="clientLongitude"
                  value={formData?.clientLongitude}
                  placeholder="Client Longitude"
                  onChange={handleChange}
                  className="border rounded bg-white dark:bg-boxdark  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>

            {/* Set Documents and Type of Solar System in One Row */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="xl:w-1/2 w-full">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="solarSystemType"
                >
                  Type of Solar System<span className="text-red-500">*</span>
                </label>
                <select
                  id="solarSystemType"
                  name="solarSystemType"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  value={formData?.solarSystemType}
                  onChange={handleChange}
                  required
                  disabled={!!formData.solarSystemType}
                >
                  <option value="">Select Solar System Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="SolarFarm">Solar Farm</option>
                  <option value="SolarPump">Solar Pump</option>
                </select>
              </div>
              <div className="xl:w-1/2 w-full">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="typeOfLead"
                >
                  Type Of Lead<span className="text-red-500">*</span>
                </label>
                <select
                  id="typeOfLead"
                  name="typeOfLead"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  value={formData?.typeOfLead}
                  onChange={handleChange}
                  required
                  disabled={!!formData.typeOfLead}
                >
                  <option value="">Select Type Of Lead</option>
                  <option value="Lead">Lead</option>
                  <option value="Quotation">Quotation</option>
                  <option value="HotPipeline">Hot Pipeline</option>
                  <option value="OrderCount">Order Count</option>
                  {/* <option value="SolarPump">Solar Pump</option> */}
                </select>
              </div>
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

            </div>

            {/* Dispatch Date */}
            <div className="mb-4.5">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="estimatedDispatchDate"
              >
                Estimated  Dispatch Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="estimatedDispatchDate"
                name="estimatedDispatchDate"
                value={formData?.estimatedDispatchDate} // Display the formatted date
                onChange={handleDateChange}
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
                placeholder="YYYY/MM/DD" // Ensure proper format
                maxLength={10} // Max length for DD/MM/YYYY format
              />
            </div>

            {/* Bill of Materials and Payment Confirmation in One Row */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              {/* <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white" htmlFor="billOfMaterials">
                  Bill of Materials
                </label>
              
              </div> */}
              {/* <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white" htmlFor="billOfMaterials">
                  Bill of Materials
                </label>
                {formData?.billOfMaterials?.length ? (
                  <div className="mt-2">
                    {formData.billOfMaterials.map((item, index) => (
                      <div key={index}>
                        {item.includes(".pdf") ? (
                          <embed src={item} type="application/pdf" width="100%" height="500px" />
                        ) : (
                          <img src={item} alt="Preview" className="max-w-50 h-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    type="file"
                    id="billOfMaterials"
                    name="billOfMaterials"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleChange}
                  />
                )}
                {uploading?.billOfMaterials && uploadProgress?.billOfMaterials?.length > 0 && (
                  <div>
                    {uploadProgress.billOfMaterials.map((progress, index) => (
                      <div key={index}>Uploading: {progress}%</div>
                    ))}
                  </div>
                )}
              </div> */}

            </div>
            <div className="w-full xl:w-1/2">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="paymentConfirmation"
              >
                Payment Confirmation
              </label>
              {formData?.paymentConfirmation ? (
                <div className="mt-2">
                  {formData?.paymentConfirmation?.includes(".pdf") ? (
                    <embed
                      src={formData?.paymentConfirmation}
                      type="application/pdf"
                      width="100%"
                      height="500px"
                    />
                  ) : (
                    <img
                      src={formData?.paymentConfirmation}
                      alt="Preview"
                      className="max-w-50 h-auto"
                    />
                  )}
                </div>
              ) : (
                <input
                  type="file"
                  id="paymentConfirmation"
                  name="paymentConfirmation"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={handleChange} // Use updated handleChange function
                />
              )}
              {uploading?.paymentConfirmation && (
                <div>Uploading: {uploadProgress?.paymentConfirmation[0]}%</div> // Handle single file progress
              )}
            </div>


            {/* WiFi Details */}
            <div className="mb-4.5 mt-2">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="wifiConfiguration"
              >
                WiFi Configuration
              </label>
              <input
                type="text"
                id="wifiConfiguration"
                name="wifiConfiguration"
                value={formData?.wifiConfiguration}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter WiFi configuration"
              />
            </div>

            {/* Company Name */}
            <div className="mb-4.5">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="inverterCompanyName"
              >
                Inverter Company Name
              </label>
              <input
                type="text"
                id="inverterCompanyName"
                name="inverterCompanyName"
                value={formData?.inverterCompanyName}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter company name"

              />
            </div>

            {/* username and password in One Row */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="username"
                >
                  username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData?.username}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter username"

                />
              </div>
              <div className="w-full xl:w-1/2">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type={isEditable ? "text" : "password"} // Toggle between password and text
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter password"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission or page refresh
                    setIsEditable(!isEditable);
                  }}
                  className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
                >
                  {isEditable ? "Hide" : "Show"} Password
                </button>
              </div>
            </div>


            <div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Add Button */}
                <div>
                  <span className="mb-">Bill Of Material</span>
                  <div className="flex gap-4 mt-2">
                    {/* Add Material Button */}
                    <button
                      type="button"
                      onClick={addMaterial}
                      className="mb-4 w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-primary bg-primary p-2 text-white dark:bg-darkprimary dark:border-darkprimary"
                    >
                      + Add Material
                    </button>

                    {/* View Button */}
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="mb-4 w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-primary bg-primary p-2 text-white dark:bg-darksecondary dark:border-darksecondary"
                    >
                      View Material
                    </button>
                  </div>

                  {/* Display the Added Materials */}
                  {showModal1 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white dark:bg-darkinput p-6 rounded-lg max-w-3xl w-full">
                        <h2 className="text-xl font-semibold mb-4">Materials List</h2>

                        {/* Table of Materials */}
                        <div className="overflow-x-auto">
                          {formData.billOfMaterials.length === 0 ? (
                            <p>No materials added yet.</p>
                          ) : (
                            <div className="max-h-64 overflow-y-auto">
                              <table className="w-full table-auto border-collapse border border-gray-300 dark:border-darkinput">
                                <thead>
                                  <tr className="bg-gray-200 dark:bg-darksecondary">
                                    <th className="border border-gray-300 p-2 text-left dark:border-darkinput">Category</th>
                                    <th className="border border-gray-300 p-2 text-left dark:border-darkinput">Material</th>
                                    <th className="border border-gray-300 p-2 text-left dark:border-darkinput">Brand</th>
                                    <th className="border border-gray-300 p-2 text-left dark:border-darkinput">Unit</th>
                                    <th className="border border-gray-300 p-2 text-left dark:border-darkinput">Quantity</th>
                                    <th className="border border-gray-300 p-2 text-left dark:border-darkinput">Price Per Unit</th>
                                    <th className="border border-gray-300 p-2 text-left dark:border-darkinput">Delete</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {formData.billOfMaterials.map((item, index) => (
                                    <tr key={index} className="bg-white dark:bg-boxdark">
                                      <td className="border border-gray-300 p-2 dark:border-darkinput">{item.CategoryName}</td>
                                      <td className="border border-gray-300 p-2 dark:border-darkinput">{item.Material}</td>
                                      <td className="border border-gray-300 p-2 dark:border-darkinput">{item.Brand}</td>
                                      <td className="border border-gray-300 p-2 dark:border-darkinput">{item.Unit}</td>
                                      <td className="border border-gray-300 p-2 dark:border-darkinput">{item.quantity}</td>
                                      <td className="border border-gray-300 p-2 dark:border-darkinput">{item.PricePerUnit}</td>
                                      <td className="border border-gray-300 p-2 dark:border-darkinput bg-red-500 text-white"><td>
                                        <button onClick={() => removeMaterial(index)}>Delete</button>
                                      </td></td>

                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>


                        {/* Close Button */}
                        <button
                          type="button"
                          onClick={toggleModal}
                          className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Modal */}
              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white dark:bg-darkinput p-6 rounded-lg max-w-xl w-full">
                    <h2 className="text-xl mb-4">Add New Material</h2>

                    {/* New Material Input Form */}
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                      <input
                        type="text"
                        value={newMaterial.CategoryName}
                        onChange={(e) => handleNewMaterialChange('CategoryName', e.target.value)}
                        placeholder="Category Name"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                      <input
                        type="text"
                        value={newMaterial.Material}
                        onChange={(e) => handleNewMaterialChange('Material', e.target.value)}
                        placeholder="Material Name"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                      <input
                        type="text"
                        value={newMaterial.Brand}
                        onChange={(e) => handleNewMaterialChange('Brand', e.target.value)}
                        placeholder="Brand Name"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                      <input
                        type="text"
                        value={newMaterial.Unit}
                        onChange={(e) => handleNewMaterialChange('Unit', e.target.value)}
                        placeholder="Enter Unit"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                      <input
                        type="number"
                        value={newMaterial.quantity}
                        onChange={(e) => handleNewMaterialChange('quantity', e.target.value)}
                        placeholder="Quantity"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                      <input
                        type="number"
                        value={newMaterial.PricePerUnit}
                        onChange={(e) => handleNewMaterialChange('PricePerUnit', e.target.value)}
                        placeholder="PricePerUnit"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                    </div>

                    {/* Add Material Button */}
                    <button
                      type="button"
                      onClick={saveNewMaterial}
                      className="mt-4 w-full bg-green-500 text-white p-2 rounded-lg"
                    >
                      Add Material
                    </button>

                    {/* Close Modal Button */}
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>


            {/* Design Confirmation */}
            <div className="mb-4.5">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="designConformation"
              >
                Design Confirmation<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="designConformation"
                name="designConformation"
                value={formData?.designConformation}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter design confirmation"
                required
                readOnly
                disabled
              />
            </div>

            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white" htmlFor="GEDADocuments">
                GEDA Documents
              </label>
              {formData?.GEDADocuments?.length > 0 ? (
                <div className="mt-2">
                  {formData.GEDADocuments.map((item, index) => (
                    <div key={index}>
                      {item?.includes(".pdf") ? (
                        <embed src={item} type="application/pdf" width="100%" height="500px" />
                      ) : (
                        <img src={item} alt="Preview" className="max-w-50 h-auto" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <input
                  type="file"
                  id="GEDADocuments"
                  name="GEDADocuments"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  multiple
                  onChange={handleChange}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                />
              )}
              {uploading?.GEDADocuments && uploadProgress?.GEDADocuments?.length > 0 && (
                <div>
                  {uploadProgress.GEDADocuments.map((progress, index) => (
                    <div key={index}>Uploading file {index + 1}: {progress}%</div>
                  ))}
                </div>
              )}
            </div>


            {/* Installer Name */}
            <div className="mb-4.5 mt-2">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="installerName"
              >
                Installer Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="installerName"
                name="installerName"
                value={formData?.installerName}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter installer name"
                required
              />
            </div>
            {/* Installer Price */}
            <div className="mb-4.5">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="installerPrice"
              >
                Installer Price<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="installerPrice"
                name="installerPrice"
                value={formData?.installerPrice}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter installer price"
                required
              />
            </div>

            {/* Project Completion Date */}

            <div className="mb-4.5">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="projectCompletionDate"
              >
                Project Completion Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="projectCompletionDate"
                name="projectCompletionDate"
                value={formData?.projectCompletionDate} // Display the formatted date
                onChange={handleDateChange}
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
                placeholder="YYYY/MM/DD" // Ensure proper format
                maxLength={10} // Max length for DD/MM/YYYY format
              />
            </div>

            {formData.Assignmaintenanceaddexecutive?.name ? (
              <div className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark">
                <p>Name: {formData.Assignmaintenanceaddexecutive?.name}</p>
                <p>Email: {formData.Assignmaintenanceaddexecutive?.email}</p>
              </div>
            ) : (
              <div className="mb-4 w-full mt-2">
                <label htmlFor="firstDropdown" className="block text-gray-700">
                  Assign Maintenance Executive<span className="text-red-500">*</span>
                </label>
                <select
                  id="firstDropdown"
                  // value={formData.Assignmaintenanceaddexecutive}
                  name="Assignmaintenanceaddexecutive"
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-boxdark"
                  required
                >
                  <option value="" selected>
                    Select Maintenance Executive
                  </option>
                  {executives.map((executive) => (
                    <option key={executive._id} value={executive._id}>
                      {executive.name}
                    </option>
                  ))}
                </select>
              </div>)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="LicenseManagerStatus"
                >
                  LicenseManager Status
                </label>
                <input
                  id="LicenseManagerStatus"
                  name="LicenseManagerStatus"
                  value={formData.LicenseManagerStatus}
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="LicenseManagerMessage"
                >
                  LicenseManager Message
                </label>
                <input
                  id="LicenseManagerMessage"
                  name="LicenseManagerMessage"
                  value={formData.LicenseManagerMessage}
                  placeholder="NO Message"
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="SalesExecutiveStatus"
                >
                  Sales Executive Status
                </label>
                <input
                  id="ProjectExecutiveStatus"
                  name="ProjectExecutiveStatus"
                  value={formData.SalesManagerStatus}
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="SalesExecutiveMessage"
                >
                  Sales Executive Message
                </label>
                <input
                  id="SalesExecutiveMessage"
                  name=" SalesExecutiveMessage"
                  value={formData.SalesManagerMessage}
                  placeholder="NO Message"
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="MaintainaneceExecutiveStatus"
                >
                  Maintainanece Executive Status
                </label>
                <input
                  id="MaintainaneceExecutiveStatus"
                  name="MaintainanecetExecutiveStatus"
                  value={formData.MaintainaneceManagerStatus}
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="MaintainaneceExecutiveMessage"
                >
                  Maintainanece Executive Message
                </label>
                <input
                  id="MaintainaneceExecutiveMessage"
                  name="MaintainaneceExecutiveMessage"
                  value={formData.MaintainaneceMessage}
                  placeholder="NO Message"
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="StoreExecutiveStatus"
                >
                  Store Executive Status
                </label>
                <input
                  id="StoreExecutiveStatus"
                  name="StoreExecutiveStatus"
                  value={formData.StoreManagerStatus}
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="StoreExecutiveMessage"
                >
                  Store Executive Message
                </label>
                <input
                  id="StoreExecutiveMessage"
                  name="StoreExecutiveMessage"
                  value={formData.StoreManagerMessage}
                  placeholder="NO Message"
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="DesignerStatus"
                >
                  Designer Status
                </label>
                <input
                  id="DesignerStatus"
                  name="DesignerStatus"
                  value={formData.DesignerStatus}
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="DesignerMessage"
                >
                  Designer Message
                </label>
                <input
                  id="DesignerMessage"
                  name="DesignerMessage"
                  value={formData.DesignerMessage}
                  placeholder="NO Message"
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="AccountsStatus"
                >
                  Account's Status
                </label>
                <input
                  id="AccountsStatus"
                  name="AccountsStatus"
                  value={formData.AccountsStatus}
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="AccountsMessage"
                >
                  Account's Message
                </label>
                <input
                  id="AccountsMessage"
                  name="AccountsMessage"
                  value={formData.AccountsMessage}
                  placeholder="NO Message"
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="CustomerStatus"
                >
                  Customer's Status
                </label>
                <input
                  id="CustomerStatus"
                  name="CustomerStatus"
                  value={formData.CustomerStatus}
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="CustomerMessage"
                >
                  Customer's Message
                </label>
                <input
                  id="CustomerMessage"
                  name="CustomerMessage"
                  value={formData.CustomerMessage}
                  placeholder="NO Message"
                  readOnly
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>
            <div className="flex mt-3">
              <div className="mb-4 col-6">
                <label htmlFor="firstDropdown" className="block text-gray-700">
                  Status<span className="text-red-500">*</span>
                </label>
                <select
                  id="firstDropdown"
                  value={formData.Status}
                  name="Status"
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full bg-white dark:bg-boxdark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Pending">Pending</option>
                  <option value="Complete">Complete</option>
                  <option value="OnHold">OnHold</option>
                  <option value="Query">Query</option>
                  <option value="OnWorking">OnWorking</option>
                </select>
              </div>
              <div className="mb-4 col-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="query"
                >
                  Query
                </label>
                <input
                  type="text"
                  id="query"
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full bg-white dark:bg-boxdark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Query"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 rounded bg-primary px-6 py-2 text-white shadow-md hover:bg-primary-dark"
            >
              {projectLoading ? 'Loading...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProjectOrder;

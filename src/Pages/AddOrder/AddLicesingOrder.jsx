import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { License } from "../../api/call.js";
import FileUpload from "../../components/FileUpload.jsx";
import { ToastContainer, toast } from "react-toastify";

import { storage } from "../../api/firebaseconfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddLicensingOrder = () => {
  const location = useLocation();
  const order = location.state?.order || {};
  console.log("order", order);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    orderNumber: "",
    clientName: "",
    contactNumber: "",
    clientEmail: "",
    solarSystemType: "",
    clientLocation: "",
    discomOption: "",
    applicationForm: [],
    signDocuments: "",
    siteDocuments: [],
    status: "",
    query: "",
    Assignprojectaddexecutive: "",
    typeOfLead: "",
    figibilityApprove: "",
    CIGRegistrationDate: "",
    CIGCompleteDate: "",
    CIGletter: [],
    meterInstallationDate: "",
    GEDADocuments: "",
    SalesManagerStatus: "",
    SalesManagerMessage: "",
    ProjectHandlerStatus: "",
    ProjectHandlerMessage: "",
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
    clientLongitude: "",
    clientLatitude: ""
  });

  const [executives, setExecutives] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({
    applicationForm: 0,
    zdrLetter: 0,
    signDocuments: 0,
    siteDocuments: [],
    CIGletter: [],
    GEDADocuments: []
  });
  const [uploading, setUploading] = useState({
    applicationForm: false,
    zdrLetter: false,
    signDocuments: false,
    siteDocuments: false,
  });
  console.log("CIGletter", order);
  const [licesingLoading, setlicesingLoading] = useState(false);
  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const response = await License.assignProject();
        if (response.data.status) {
          setExecutives(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchExecutives();
  }, []);

  useEffect(() => {
    if (order) {
      setFormData({
        id: order._id || "",
        clientName: order._id
          ? order.orderBy === "Customer"
            ? order.userid.name
            : order.clientName
          : "",
        contactNumber: order._id
          ? order?.orderBy === "Customer"
            ? order.userid?.phonenumber
            : order?.contactNumber
          : "",
        clientEmail: order._id
          ? order?.orderBy === "Customer"
            ? order?.userid?.email
            : order?.clientEmail
          : "",
        orderNumber: order?.orderNumber ? order?.orderNumber : "",
        solarSystemType: order?.solarSystemType ? order.solarSystemType : "",
        clientLocation: order?.clientLocation ? order?.clientLocation : "",
        discomOption: order?.discomOption ? order?.discomOption : "",
        applicationForm: order?.applicationForm ? order?.applicationForm : null,
        signDocuments: order?.signDocuments ? order?.signDocuments : null,
        siteDocuments: order.siteDocuments ? order.siteDocuments : [],
        status: order.LicenseManager?.status ? order.LicenseManager?.status : "",
        query: order.LicenseManager?.message ? order.LicenseManager?.message : "",
        Assignprojectaddexecutive: order.ProjectHandler.managerid ? order.ProjectHandler.managerid : "",
        typeOfLead: order.typeOfLead ? order.typeOfLead : "",
        figibilityApprove: order?.figibilityApprove ? order?.figibilityApprove : "",
        CIGRegistrationDate: order?.CIGRegistrationDate
          ? new Date(order?.CIGRegistrationDate).toISOString().split("T")[0]
          : "",
        CIGCompleteDate: order?.CIGCompleteDate
          ? new Date(order?.CIGCompleteDate).toISOString().split("T")[0]
          : "",
        meterInstallationDate: order?.meterInstallationDate
          ? new Date(order?.meterInstallationDate).toISOString().split("T")[0]
          : "",
        CIGletter: order.CIGletter ? order.CIGletter : [],
        GEDADocuments: order.GEDADocuments ? order.GEDADocuments : [],
        SalesManagerStatus: order.SalesManager?.status,
        SalesManagerMessage: order.SalesManager?.message,
        ProjectHandlerStatus: order.ProjectHandler?.status,
        ProjectHandlerMessage: order.ProjectHandler?.message,
        MaintainaneceManagerStatus: order.MaintainaneceManager?.status,
        MaintainaneceManagerMessage: order.MaintainaneceManager?.message,
        StoreManagerStatus: order.StoreManager?.status,
        StoreManagerMessage: order.StoreManager?.message,
        DesignerStatus: order.Designer?.status,
        DesignerMessage: order.Designer?.message,
        AccountsStatus: order.Accounts?.status,
        AccountsMessage: order.Accounts?.message,
        CustomerStatus: order.Customer?.status,
        CustomerMessage: order.Customer?.message,
        clientLatitude: order.clientLatitude ? order.clientLatitude : "",
        clientLongitude: order.clientLongitude ? order.clientLongitude : ""
      });
    }
  }, []);

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   if (files) {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       [name]: files.length > 1 ? Array.from(files) : files[0],
  //     }));
  //   } else {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       [name]: value,
  //     }));
  //   }
  // };

  // const handleFileUpload = (file, fieldName, index = null) => {
  //   const fileRef = ref(storage, `attachments/${file.name}`);
  //   const uploadTask = uploadBytesResumable(fileRef, file);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       if (fieldName === "GEDADocuments") {
  //         setUploadProgress((prev) => {
  //           const newProgress = [...prev[fieldName]];
  //           newProgress[index] = Math.round(progress);
  //           return {
  //             ...prev,
  //             [fieldName]: newProgress,
  //           };
  //         });
  //       } else if (fieldName === "CIGletter") {
  //         setUploadProgress((prev) => {
  //           const newProgress = [...prev[fieldName]];
  //           newProgress[index] = Math.round(progress);
  //           return {
  //             ...prev,
  //             [fieldName]: newProgress,
  //           };
  //         });
  //       } else {
  //         setUploadProgress((prev) => ({
  //           ...prev,
  //           [fieldName]: Math.round(progress),
  //         }));
  //         setUploading((prev) => ({
  //           ...prev,
  //           [fieldName]: true,
  //         }));
  //       }
  //     },
  //     (error) => {
  //       console.error("Upload failed:", error);
  //       toast.error("File upload failed. Please try again.");
  //       if (fieldName === "GEDADocuments") {
  //         setUploading((prev) => ({ ...prev, [fieldName]: false }));
  //       }else if (fieldName === "CIGletter") {
  //         setUploading((prev) => ({ ...prev, [fieldName]: false }));
  //       }
  //     },
  //     async () => {
  //       const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //       if (fieldName === "GEDADocuments") {
  //         setFormData((prevFormData) => ({
  //           ...prevFormData,
  //           [fieldName]: [...(prevFormData[fieldName] || []), downloadURL],
  //         }));
  //       } else if (fieldName === "CIGletter") {
  //         ((prevFormData) => ({
  //           ...prevFormData,
  //           [fieldName]: [...(prevFormData[fieldName] || []), downloadURL],
  //         }));
  //       } else {
  //         ((prevFormData) => ({
  //           ...prevFormData,
  //           [fieldName]: [...(prevFormData[fieldName] || []), downloadURL],
  //         }));
  //       }
  //       if (fieldName === "CIGletter") {
  //         setUploadProgress((prev) => {
  //           const newProgress = [...prev[fieldName]];
  //           newProgress[index] = 0;
  //           return {
  //             ...prev,
  //             [fieldName]: newProgress,
  //           };
  //         });
  //       }else if (fieldName === "GEDADocuments") {
  //         setUploadProgress((prev) => {
  //           const newProgress = [...prev[fieldName]];
  //           newProgress[index] = 0;
  //           return {
  //             ...prev,
  //             [fieldName]: newProgress,
  //           };
  //         });
  //       } 
  //       toast.success("File uploaded successfully");
  //     }
  //   );
  // };

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   if (files) {
  //     if (name === "GEDADocuments") {
  //       const filesArray = Array.from(files);
  //       filesArray.forEach((file, index) => {
  //         handleFileUpload(file, name, index);
  //       });
  //     } else if (name === "CIGletter") {
  //       const filesArray = Array.from(files);
  //       filesArray.forEach((file, index) => {
  //         handleFileUpload(file, name, index);
  //       });
  //     } else {
  //       handleFileUpload(files[0], name);
  //     }
  //   }  else {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       [name]: e.target.value,
  //     }));
  //   }
  // };


  const handleFileUpload = (file, fieldName, index = null) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress((prev) => {
          const newProgress = prev[fieldName] ? [...prev[fieldName]] : [];
          if (index !== null) {
            newProgress[index] = Math.round(progress);
          }
          return { ...prev, [fieldName]: newProgress };
        });
        setUploading((prev) => ({ ...prev, [fieldName]: true }));
      },
      (error) => {
        console.error("Upload failed:", error);
        toast.error("File upload failed. Please try again.");
        setUploading((prev) => ({ ...prev, [fieldName]: false }));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prevFormData) => {
          if (index !== null) {
            // Handle multiple files
            return {
              ...prevFormData,
              [fieldName]: [...(prevFormData[fieldName] || []), downloadURL],
            };
          } else {
            // Handle single file
            return {
              ...prevFormData,
              [fieldName]: downloadURL,
            };
          }
        });

        setUploadProgress((prev) => {
          const newProgress = prev[fieldName] ? [...prev[fieldName]] : [];
          if (index !== null) {
            newProgress[index] = 0;
          }
          return { ...prev, [fieldName]: newProgress };
        });
        setUploading((prev) => ({ ...prev, [fieldName]: false }));
        toast.success("File uploaded successfully");
      }
    );
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files) {
      const filesArray = Array.from(files);
      filesArray.forEach((file, index) => {
        handleFileUpload(file, name, files.length >= 1 ? index : null);
      });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: e.target.value,
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
    setlicesingLoading(true);
    try {
      const Managerdata = {
        orderId: order._id,
        status: formData.status,
        message: formData.query,
        AssignManagerRole: "ProjectHandler",
        AssignManagerid: formData.Assignprojectaddexecutive,
        data: {
          ...formData,
          applicationForm: formData.applicationForm && formData.applicationForm.length > 0 ? formData.applicationForm[0] : "",
          signDocuments: formData.signDocuments && formData.signDocuments.length > 0 ? formData.signDocuments[0] : ""
        }
      };

      console.log("Form data:", Managerdata);
      const response = await License.verifyLicense(Managerdata);
      if (response && (response.status === 201 || response.status === 200)) {
        toast.success("Update Order Successfully");

        setTimeout(() => {
          navigate("/orders"); // Redirect to the orders page after 0.5 second
        }, 2000); // 500 milliseconds = 0.5 second
      } else {
        toast.error("Failed to Add Category. Ensure the category is unique.");
      }
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setlicesingLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b flex justify-between items-center border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add Licensing Order
            </h3>
            <Link to="/orders">
              <button className="flex items-center justify-center gap-1">
                <FaArrowLeftLong />
                <span>Go Back</span>
              </button>
            </Link>
          </div>
          <form className="p-6.5" onSubmit={handleSubmit}>
            {/* Order Number and Name in One Row */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
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
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter order number"
                  value={formData?.orderNumber}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="name"
                >
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="clientName"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter your name"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
            </div>

            {/* Contact Number and Email in One Row */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
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
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter contact number"
                  value={formData?.contactNumber}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="w-full xl:w-1/2">
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
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter your email"
                  value={formData?.clientEmail}
                  onChange={handleChange}
                  readOnly
                />
              </div>
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
                  readOnly
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
                  readOnly
                />
              </div>
            </div>
            {/* Solar System Type and Client Location in One Row */}
            <div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-2.5 block text-black dark:text-white"
                    htmlFor="solarSystemType"
                  >
                    Solar System Type<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="solarSystemType"
                    name="solarSystemType"
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                    value={formData?.solarSystemType}
                    onChange={handleChange}
                    required
                    disabled={formData?.solarSystemType}
                  >
                    <option value="">Select Solar System Type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="SolarFarm">Solar Farm</option>
                    <option value="SolarPump">Solar Pump</option>
                  </select>
                </div>
                <div className="w-full xl:w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="figibilityApprove"
                  >
                    Figibility Approve<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="figibilityApprove"
                    name="figibilityApprove"
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                    value={formData?.figibilityApprove}
                    onChange={handleChange}
                    required
                  >
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                    {/* <option value="SolarPump">Solar Pump</option> */}
                  </select>
                </div>
              </div>
            </div>

            {/* Discom Option */}
            <div className="mb-4.5">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="discomOption"
              >
                Discom Option<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="discomOption"
                name="discomOption"
                value={formData?.discomOption}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                readOnly
              />
            </div>
            <div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-2.5 block text-black dark:text-white"
                    htmlFor="CIGRegistrationDate"
                  >
                    CIG Registration Date
                  </label>
                  <input
                    type="date"
                    id="CIGRegistrationDate"
                    name="CIGRegistrationDate"
                    value={formData?.CIGRegistrationDate} // Display the formatted date
                    onChange={handleDateChange}
                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="YYYY/MM/DD"
                    maxLength={10}
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-2.5 block text-black dark:text-white"
                    htmlFor="CIGCompleteDate"
                  >
                    CIG Complete Date
                  </label>
                  <input
                    type="date"
                    id="CIGCompleteDate"
                    name="CIGCompleteDate"
                    value={formData?.CIGCompleteDate} // Display the formatted date
                    onChange={handleDateChange}
                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="YYYY/MM/DD"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
            <div className="w-full xl:w-1/2">
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="meterInstallationDate"
              >
                Meter Installation Date
              </label>
              <input
                type="date"
                id="meterInstallationDate"
                name="meterInstallationDate"
                value={formData?.meterInstallationDate} // Display the formatted date
                onChange={handleDateChange}
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="YYYY/MM/DD"
                maxLength={10}
              />
            </div>

            {/* File Uploads */}
            <div className="mb-4.5 flex flex-col gap-4 mt-2">
              <div>
                <label htmlFor="CIGletter">CIG Letter</label>
                {formData?.CIGletter?.length > 0 ? (
                  <div className="mt-2">
                    {formData?.CIGletter.map((item, index) => (
                      <div key={index} className="mt-1">
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
                    id="CIGletter"
                    name="CIGletter"
                    className="w-full"
                    multiple
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  />
                )}
                {uploading.CIGletter && uploadProgress.CIGletter?.length > 0 &&
                  uploadProgress.CIGletter.map((progress, index) => (
                    <div key={index}>Uploading file {index + 1}: {progress}%</div>
                  ))
                }
              </div>

              <div>
                <label htmlFor="applicationForm">Application Form</label>
                {formData.applicationForm ? (
                  <div className="mt-2">
                    {formData.applicationForm.includes(".pdf") ? (
                      <embed src={formData.applicationForm} type="application/pdf" width="100%" height="500px" />
                    ) : (
                      <img src={formData.applicationForm} alt="Preview" className="max-w-50 h-auto" />
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="applicationForm"
                      name="applicationForm"
                      className="w-full"
                      onChange={handleChange}
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                    />
                    {uploading.applicationForm && (
                      <div>Uploading: {uploadProgress.applicationForm}%</div>
                    )}
                  </div>
                )}
              </div>

              {/* GEDA Documents */}
              <div className="w-full">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="GEDADocuments"
                >
                  GEDA Documents
                </label>
                {formData?.GEDADocuments?.length > 0 ? (
                  <div className="mt-2">
                    {
                      formData?.GEDADocuments?.map((item, index) => (
                        <div className="mt-1" key={index}>
                          {item.includes(".pdf") ? (
                            <embed src={item} type="application/pdf" width="100%" height="500px" />
                          ) : (
                            <img src={item} alt="Preview" className="max-w-50 h-auto" />
                          )}
                        </div>
                      ))
                    }
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

                {uploading.GEDADocuments && uploadProgress.GEDADocuments?.length > 0 &&
                  uploadProgress.GEDADocuments.map((progress, index) => (
                    <div
                      key={index}>
                      Uploading file {index + 1}: {progress}%
                    </div>
                  ))}
              </div>
              <div>
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="signDocuments"
                >
                  Sign Documents
                </label>
                {formData.signDocuments ? (
                  <div className="mt-2">

                    {formData.signDocuments.includes(".pdf") ? (
                      <embed
                        src={formData.signDocuments}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                      />
                    ) : (
                      <img
                        src={formData.signDocuments}
                        alt="Preview"
                        className="max-w-50 h-auto"
                      />
                    )}
                  </div>
                ) : (
                  <div>

                    <input
                      type="file"
                      id="signDocuments"
                      name="signDocuments"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleChange}
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                    />
                    {uploading.signDocuments && (
                      <div>Uploading: {uploadProgress.signDocuments}%</div>
                    )}
                  </div>
                )}
              </div>

            </div>
            {formData.Assignprojectaddexecutive?.name ? (
              <div className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <p>Name: {formData.Assignprojectaddexecutive?.name}</p>
                <p>Email: {formData.Assignprojectaddexecutive?.email}</p>
              </div>
            ) : (
              <div className="mb-4 w-full">
                <label htmlFor="firstDropdown" className="block text-gray-700">
                  Assign Project Eaxecutive<span className="text-red-500">*</span>
                </label>
                <select
                  id="firstDropdown"
                  name="Assignprojectaddexecutive"
                  value={formData.Assignprojectaddexecutive}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-boxdark"
                >
                  <option value="" selected>
                    Select Project Executive
                  </option>
                  {executives.map((executive) => (
                    <option key={executive._id} value={executive._id}>
                      {executive.name}
                    </option>
                  ))}
                </select>
              </div>
            )}





            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="LicenseManagerStatus"
                >
                  SalesManager Status
                </label>
                <input
                  id="LicenseManagerStatus"
                  name="LicenseManagerStatus"
                  value={formData.SalesManagerStatus}
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="LicenseManagerMessage"
                >
                  SalesManager Message
                </label>
                <input
                  id="LicenseManagerMessage"
                  name="LicenseManagerMessage"
                  value={formData.SalesManagerMessage}
                  placeholder="NO Message"
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="ProjectExecutiveStatus"
                >
                  Project Executive Status
                </label>
                <input
                  id="ProjectExecutiveStatus"
                  name="ProjectExecutiveStatus"
                  value={formData.ProjectHandlerStatus}
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="ProjectExecutiveMessage"
                >
                  Project Executive Message
                </label>
                <input
                  id="ProjectExecutiveMessage"
                  name="ProjectExecutiveMessage"
                  value={formData.ProjectHandlerMessage}
                  placeholder="NO Message"
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
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
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
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
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="StoreExecutiveStatus"
                  readOnly
                >
                  Store Executive Status
                </label>
                <input
                  id="StoreExecutiveStatus"
                  name="StoreExecutiveStatus"
                  value={formData.StoreManagerStatus}
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
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
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
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
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
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
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
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
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
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
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
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
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
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
                  // onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
                />
              </div>
            </div>






            <div className="flex mt-2">
              <div className="mb-4 col-6">
                <label htmlFor="firstDropdown" className="block text-gray-700">
                  Status<span className="text-red-500">*</span>
                </label>
                <select
                  id="firstDropdown"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-boxdark"
                >
                  <option value="" selected>
                    Select an option
                  </option>
                  <option value="Pending">Pending</option>
                  <option value="Complete">Complete</option>
                  <option value="OnHold">OnHold</option>
                  <option value="Query">Query</option>
                  <option value="OnWorking">OnWorking</option>
                </select>
              </div>
              <div className="mb-4 col-6">
                <label htmlFor="query" className="block text-gray-700">
                  Query
                </label>
                <input
                  type="text"
                  id="textInput"
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full bg-white dark:bg-boxdark  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter Query"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 w-full rounded bg-primary py-3 px-5 text-white transition hover:bg-primary-dark"
            >
              {licesingLoading ? 'Loading...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddLicensingOrder;

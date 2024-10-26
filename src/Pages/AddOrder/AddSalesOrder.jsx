/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Sales } from "../../api/call.js";
import { ToastContainer, toast } from "react-toastify";
import { storage } from "../../api/firebaseconfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useLocation } from "react-router-dom";

const AddSalesOrder = () => {
  const location = useLocation();
  const order = location.state?.order || {};
  const navigate = useNavigate();
  const {
    name,
    email,
    phonenumber,
    clientAddress,
    orderid,
    salesManager,
    expectedKilowatt,
    typeOfProject,
    typeOfSolarSystem,
    discomOption,
    documentProblem,
    lightbill,
    monthlyBills,
    remarks,
    sensionLoan,
    shadowFreeArea,
    typeOfLead,
    applicationForm,
    clientLocation,
    orderNumber,
    companyName,
    dispatchDate,
    installerName,
    installerPrice,
    projectCompletionDate,
    username,
    wifiDetails,
    designPlan,
    followupDate,
    solarSystemType,
    followupStatus
  } = location.state || {};


  const [formData, setFormData] = useState({
    typeOfSolarSystem: "",
    followupDate: "",
    followupComment: "",
    followupStatus: "",
    clientName: "",
    contactNumber: "",
    clientAddress: "",
    expectedKilowatt: "",
    discomOption: "",
    conformKilowatt: "",
    typeOfLead: "",
    documentProblem: "",
    monthlyBills: "",
    lightbill: "",
    sensionLoan: "",
    remarks: "",
    shadowFreeArea: "",
    siteSurveyFormAttachment: [],
    images: [],
    imagess: [],
    clientEmail: "",
    id: "",
    Assignlicensingaddexecutive: "",
    Status: "",
    query: "",
    solarSystemType: "",
    CustomerQuery: "",
    CustomerStatus: "",
    finalAmount: "",
    advanceAmount: "",
    quotationAttachment1: "",
    quotationAttachment2: "",
    quotationAttachment3: "",
    quotationAttachment4: "",
    quotationAttachment5: "",
    LicenseManagerStatus: "",
    LicenseManagerMessage: "",
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
    // CustomerStatus: "",
    CustomerMessage: "",
    lostReason: "",
    orderNumber: "",
    clientLatitude: "",
    clientLongitude: "",
    orderDoc: [],
    orderDocs: []


  });

  const [executives, setExecutives] = useState([]);
  const [designConformation, setdesignConformation] = useState("");
  const [uploadProgressLightbill, setUploadProgressLightbill] = useState(0);
  const [uploadingSiteSurvey, setUploadingSiteSurvey] = useState(false);
  const [uploadProgressSiteSurvey, setUploadProgressSiteSurvey] = useState(0);
  const [uploadProgress, setUploadProgress] = useState({
    lightbill: 0,
    siteSurveyFormAttachment: [],
    images: [],
    orderDoc: [],
    quotationAttachments: {},
    quotationAttachment1: 0
  });
  const [uploading, setUploading] = useState({
    lightbill: false,
    siteSurveyFormAttachment: false,
    quotationAttachments: {},
    quotationAttachment1: false
  });
  const [salesLoading, setsalesLoading] = useState(false);
  const [uploadingQuotation, setUploadingQuotation] = useState({});
  const [uploadProgressQuotation, setUploadProgressQuotation] = useState({});

  useEffect(() => {
    fetchExecutives();
  }, []);

  // console.log(orderId);

  useEffect(() => {
    if (order) {
      setFormData({
        id: order._id || "",
        clientName: order._id
          ? order.orderBy === "Customer"
            ? order.userid?.name
            : order?.clientName
          : "",
        contactNumber: order._id
          ? order.orderBy === "Customer"
            ? order.userid?.phonenumber
            : order?.contactNumber
          : "",
        clientAddress: order._id
          ? order?.orderBy === "Customer"
            ? order.userid?.fulladdress
            : order?.clientAddress
          : "",
        expectedKilowatt: order?.expectedKilowatt ? order.expectedKilowatt : "",
        discomOption: order?.discomOption ? order?.discomOption : "",
        conformKilowatt: order.conformKilowatt ? order.conformKilowatt : "",
        typeOfLead: order?.typeOfLead ? order?.typeOfLead : "",
        documentProblem: order.documentProblem ? order.documentProblem : "",
        monthlyBills: order.monthlyBills ? order.monthlyBills : "",
        sensionLoan: order?.sensionLoan ? order?.sensionLoan : "",
        remarks: order?.remarks ? order?.remarks : "",
        shadowFreeArea: order.shadowFreeArea ? order.shadowFreeArea : "",
        siteSurveyFormAttachment: order?.siteSurveyFormAttachment
          ? order?.siteSurveyFormAttachment
          : [],
        imagess: order?.images
          ? order?.images
          : [],
        orderDocs: order?.orderDoc
          ? order?.orderDoc
          : [],
        clientEmail: order.clientEmail ? order.clientEmail : "",
        Assignlicensingaddexecutive: order?.LicenseManager?.managerid
          ? order.LicenseManager?.managerid
          : "",
        Status: order.SalesManager?.status ? order.SalesManager?.status : "",
        query: order.SalesManager?.message ? order.SalesManager?.message : "",
        typeOfSolarSystem: order?.typeOfSolarSystem
          ? order?.typeOfSolarSystem
          : "",
        solarSystemType: order?.solarSystemType ? order?.solarSystemType : "",
        followupDate: order?.followupDate
          ? new Date(order?.followupDate).toISOString().split("T")[0]
          : "",
        followupComment: order?.followupComment ? order?.followupComment : "",
        followupStatus: order?.followupStatus ? order?.followupStatus : "",
        CustomerQuery: order.Customer ? order.Customer.message : "",
        CustomerStatus: order.Customer ? order.Customer.status : "",
        finalAmount: order?.finalAmount ? order?.finalAmount : "",
        advanceAmount: order?.advanceAmount ? order?.advanceAmount : "",
        quotationAttachment1: order?.quotationAttachment1
          ? order?.quotationAttachment1
          : "",
        quotationAttachment2: order?.quotationAttachment2
          ? order?.quotationAttachment2
          : "",
        quotationAttachment3: order?.quotationAttachment3
          ? order?.quotationAttachment3
          : "",
        quotationAttachment4: order?.quotationAttachment4
          ? order?.quotationAttachment4
          : "",
        quotationAttachment5: order?.quotationAttachment5
          ? order?.quotationAttachment5
          : "",
        lightbill: order?.lightbill
          ? order?.lightbill
          : "",
        LicenseManagerStatus: order.LicenseManager?.status,
        LicenseManagerMessage: order.LicenseManager?.message,
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
        lostReason: order?.lostReason
          ? order?.lostReason
          : "",
        // CustomerStatus: order.Customer.status,
        CustomerMessage: order.Customer?.message,
        orderNumber: order.orderNumber ? order.orderNumber : "",
        clientLatitude: order?.clientLatitude ? order?.clientLatitude : "",
        clientLongitude: order?.clientLongitude ? order?.clientLongitude : "",
        orderDoc: [],
        images: []
      });
      setdesignConformation(order?.designConformation ? order?.designConformation : "",)
    }
  }, []);

  const fetchExecutives = async () => {
    try {
      const response = await Sales.assignLicesing();
      if (response.data.status) {
        setExecutives(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileUpload = (file, fieldName, index = null) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        if (fieldName === "siteSurveyFormAttachment") {
          setUploadProgress((prev) => {
            const newProgress = [...prev[fieldName]];
            newProgress[index] = Math.round(progress);
            return {
              ...prev,
              [fieldName]: newProgress,
            };
          });
          setUploading((prev) => ({ ...prev, [fieldName]: true }));

        } else if (fieldName === "images") {
          setUploadProgress((prev) => {
            const newProgress = [...prev[fieldName]];
            newProgress[index] = Math.round(progress);
            return {
              ...prev,
              [fieldName]: newProgress,
            };
          });
          setUploading((prev) => ({
            ...prev,
            [fieldName]: true,
          }));
        } else if (fieldName === "orderDoc") {
          setUploadProgress((prev) => {
            const newProgress = [...prev[fieldName]];
            newProgress[index] = Math.round(progress);
            return {
              ...prev,
              [fieldName]: newProgress,
            };
          });
          setUploading((prev) => ({
            ...prev,
            [fieldName]: true,
          }));
        } else {
          setUploadProgress((prev) => ({
            ...prev,
            [fieldName]: Math.round(progress),
          }));
        }
      },
      (error) => {
        console.error("Upload failed:", error);
        toast.error("File upload failed. Please try again.");
        if (fieldName === "siteSurveyFormAttachment") {
          setUploading((prev) => ({ ...prev, [fieldName]: false }));
        } else {
          setUploading((prev) => ({ ...prev, [fieldName]: false }));
        }
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        if (fieldName === "siteSurveyFormAttachment") {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: [...(prevFormData[fieldName] || []), downloadURL],
          }));
        } else if (fieldName === "images") {
          setFormData((prevFormData) => ({
            ...prevFormData,
            images: [...(prevFormData.images || []), downloadURL],
            imagess: [...(prevFormData.imagess || []), downloadURL], // If both fields need to be updated
          }));
          // setFormData((prevFormData) => ({
          //   ...prevFormData,
          //   [fieldName]: [...(prevFormData[fieldName] || []), downloadURL],
          // }));
        } else if (fieldName === "orderDoc") {
          setFormData((prevFormData) => ({
            ...prevFormData,
            orderDoc: [...(prevFormData.orderDoc || []), downloadURL],
            orderDocs: [...(prevFormData.orderDocs || []), downloadURL], // If both fields need to be updated
          }));
          // setFormData((prevFormData) => ({
          //   ...prevFormData,
          //   [fieldName]: [...(prevFormData[fieldName] || []), downloadURL],
          // }));
        } else {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: downloadURL,
          }));
          setUploading((prev) => ({
            ...prev,
            [fieldName]: false,
          }));
        }

        if (fieldName === "siteSurveyFormAttachment") {
          setUploadProgress((prev) => {
            const newProgress = [...prev[fieldName]];
            newProgress[index] = 0;
            return {
              ...prev,
              [fieldName]: newProgress,
            };
          });
          setUploading((prev) => ({
            ...prev,
            [fieldName]: false,
          }));
        } else if (fieldName === "images") {
          setUploadProgress((prev) => {
            const newProgress = [...prev[fieldName]];
            newProgress[index] = 0;
            return {
              ...prev,
              [fieldName]: newProgress,
            };
          });
          setUploading((prev) => ({
            ...prev,
            [fieldName]: false,
          }));
        } else if (fieldName === "orderDoc") {
          setUploadProgress((prev) => {
            const newProgress = [...prev[fieldName]];
            newProgress[index] = 0;
            return {
              ...prev,
              [fieldName]: newProgress,
            };
          });
          setUploading((prev) => ({
            ...prev,
            [fieldName]: false,
          }));
        } else {
          setUploadProgress((prev) => ({
            ...prev,
            [fieldName]: 0,
          }));
          setUploading((prev) => ({
            ...prev,
            [fieldName]: false,
          }));
        }

        toast.success("File  uploaded successfully");
      }
    );
  };

  const handleDesignChange = () => {
    const { name, value } = e.target;

    setdesignConformation(value);
  }

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   if (files) {
  //     if (name === "siteSurveyFormAttachment") {
  //       const filesArray = Array.from(files);
  //       filesArray.forEach((file, index) => {
  //         handleFileUpload(file, name, index);
  //       });
  //     } else if (name === "images") {
  //       const filesArray = Array.from(files);
  //       filesArray.forEach((file, index) => {
  //         handleFileUpload(file, name, index);
  //       });
  //     } else if (name === "orderDoc") {
  //       const filesArray = Array.from(files);
  //       filesArray.forEach((file, index) => {
  //         handleFileUpload(file, name, index);
  //       });
  //     } else {
  //       handleFileUpload(files[0], name);
  //     }
  //   }
  //   // If it's a text input, update form data directly
  //   else {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       [name]: value, // Store text input values like wifiConfiguration
  //     }));
  //   }
  // };


  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;

  //   if (files) {
  //     const filesArray = Array.from(files);

  //     // Check for images field and limit upload to 20 files
  //     if (name === "images") {
  //       const currentImageCount = formData.images.length || 0;

  //       if (filesArray.length + currentImageCount > 20) {
  //         toast.error("You can only upload up to 20 images.");
  //         return;
  //       }

  //       filesArray.forEach((file, index) => {
  //         handleFileUpload(file, name, index);
  //       });
  //     } else if (name === "siteSurveyFormAttachment") {
  //       filesArray.forEach((file, index) => {
  //         handleFileUpload(file, name, index);
  //       });
  //     } else if (name === "orderDoc") {
  //       filesArray.forEach((file, index) => {
  //         handleFileUpload(file, name, index);
  //       });
  //     } else {
  //       handleFileUpload(files[0], name);
  //     }
  //   } else {
  //     // If it's a text input, update form data directly
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       [name]: value, // Store text input values
  //     }));
  //   }
  // };



  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;

  //   if (files) {
  //     const filesArray = Array.from(files);

  //     // Check the total number of files (existing + new)
  //     const currentFileCount = (formData[name] && Array.isArray(formData[name])) ? formData[name].length : 0;
  //     const totalFileCount = currentFileCount + filesArray.length;

  //     if (totalFileCount > 20) {
  //       toast.error(`You can only upload up to 20 files for ${name}. Current count: ${currentFileCount}`);
  //       return;
  //     }

  //     if (name === "images" || name === "siteSurveyFormAttachment" || name === "orderDoc") {
  //       filesArray.forEach((file, index) => {
  //         handleFileUpload(file, name, index);
  //       });
  //     } else {
  //       handleFileUpload(files[0], name);
  //     }
  //   } else {
  //     // If it's a text input, update form data directly
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       [name]: value, // Store text input values
  //     }));
  //   }
  // };
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const filesArray = Array.from(files);

      if (name === "images") {
        // Check the current number of files uploaded for the 'images' field
        const currentImageCount = (formData.images && Array.isArray(formData.images)) ? formData.images.length : 0;
        const newImageTotal = currentImageCount + filesArray.length + formData.imagess.length;
        if (newImageTotal > 20) {
          toast.error(`You can only upload up to 20 images. Currently uploaded: ${currentImageCount}`);
          return;
        }

        // If within the limit, upload the images
        filesArray.forEach((file, index) => {
          handleFileUpload(file, name, index);
        });

      } else if (name === "siteSurveyFormAttachment" || name === "orderDoc") {
        // For other fields (e.g., siteSurveyFormAttachment or orderDoc), handle uploads as needed
        filesArray.forEach((file, index) => {
          handleFileUpload(file, name, index);
        });
      } else {
        // For fields with a single file upload
        handleFileUpload(files[0], name);
      }
    } else {
      // If it's a text input, update form data directly
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value, // Store text input values
      }));
    }
  };


  const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsalesLoading(true);
    try {
      const SalesManagerdata = {
        orderId: order._id,
        status: formData.Status,
        message: formData.query,
        AssignManagerRole: "LicenseManager",
        AssignManagerid: formData.Assignlicensingaddexecutive,
        data: {
          ...formData, orderDoc: [...formData.orderDocs],
          images: [...formData.imagess], quotationAttachment1: formData.quotationAttachment1?.length > 0 ? formData.quotationAttachment1 : "",
        },
      };
      console.log("SalesManagerdata", SalesManagerdata);
      const response = await Sales.verifySales(SalesManagerdata);

      if (response && (response.status === 201 || response.status === 200)) {
        toast.success("Update Order Successfully");

        setTimeout(() => {
          navigate("/orders");
        }, 1000);
      } else {
        toast.error("Failed to Update Order. Please try again.");
      }
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setsalesLoading(false);
    }
  };

  const formatDateForInput = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleDateChange = (e) => {
    let { name, value } = e.target;
    value = value.replace(/[^\d-]/g, "");
    if (value.length > 4 && value[4] !== "-") {
      value = value.slice(0, 4) + "-" + value.slice(4);
    }
    if (value.length > 7 && value[7] !== "-") {
      value = value.slice(0, 7) + "-" + value.slice(7);
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

  const [previewURL, setPreviewURL] = useState('');
  const handleFileChange = (e, name) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0]; // Take the first file
      const storageRef = ref(storage, `docs/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Set loading state to true for the specific file
      setUploading((prev) => ({ ...prev, [name]: true }));

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get the progress of the upload
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [name]: progress }));
        },
        (error) => {
          console.error("Upload failed", error);
          toast.error("File upload failed");

          // Set loading state to false for the specific file in case of an error
          setUploading((prev) => ({ ...prev, [name]: false }));
        },
        async () => {
          // Handle successful uploads
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(`File available at ${downloadURL}`);

          // Update formData state with the downloadURL directly as a string
          setFormData((prev) => ({
            ...prev,
            [name]: downloadURL,
          }));

          // Dynamically set the preview URL for the specific file
          if (name === "quotationAttachment1") {
            setPreviewURL(downloadURL);
          }

          toast.success("File uploaded successfully");

          // Reset loading state and progress after successful upload
          setUploading((prev) => ({ ...prev, [name]: false }));
          setUploadProgress((prev) => ({ ...prev, [name]: 0 }));
        }
      );
    }
  };

  const calculateOverallProgress = () => {
    // Extract only numeric progress values
    const numericProgressValues = Object.values(uploadProgress).filter(value => typeof value === 'number' && value > 0);

    const totalProgress = numericProgressValues.reduce((acc, curr) => acc + curr, 0);
    const numberOfFiles = numericProgressValues.length;

    return numberOfFiles ? Math.round(totalProgress / numberOfFiles) : 0;
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white dark:bg-boxdark p-8 rounded shadow-md w-full max-w-6xl">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Add Sales Order Details</h1>
            <Link
              to="/orders"
              className="inline-block text-black font-bold py-2 px-4 rounded mb-4 dark:text-white"
            >
              <FaArrowLeftLong className="mr-2 inline-block " />
              Go back to Orders
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            {/* First Row - Two Fields */}

            <div className="w-full mb-3">
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
                value={formData.orderNumber}
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="clientName"
                >
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData?.clientName || name}
                  onChange={handleChange}
                  className="border rounded bg-white dark:bg-boxdark  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  readOnly
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="contactNumber"
                >
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData?.contactNumber || phonenumber}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  required
                  readOnly
                />
              </div>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="clientAddress"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="3"
                id="clientAddress"
                name="clientAddress"
                value={formData?.clientAddress || clientAddress}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                required
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
            {/* Second Row - Two Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="expectedKilowatt"
                >
                  Expected Kilowatt<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="expectedKilowatt"
                  name="expectedKilowatt"
                  value={formData?.expectedKilowatt || expectedKilowatt}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="conformKilowatt"
                >
                  Shadow Free Area
                </label>
                <input
                  type="text"
                  id="shadowFreeArea"
                  name="shadowFreeArea"
                  value={formData?.shadowFreeArea || shadowFreeArea}
                  onChange={handleChange}
                  placeholder="Shadow Free Area"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark mb-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div className="w-full ">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="followupStatus"
                >
                  Type of SolarSystem<span className="text-red-500">*</span>
                </label>
                <select
                  id="typeOfSolarSystem"
                  name="typeOfSolarSystem"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  value={formData?.typeOfSolarSystem || typeOfSolarSystem}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type of SolarSystem</option>
                  <option value="ONGrid">ON Grid</option>
                  <option value="OFFGrid">OFF Grid</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="ResidentialCommon">
                    Residential Common
                  </option>
                </select>
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="conformKilowatt"
                >
                  Conform Kilowatt<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="conformKilowatt"
                  name="conformKilowatt"
                  value={formData?.conformKilowatt}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>
            {/* followupDate Date and followupStatus */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  followupDate Date<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="followupDate"
                  name="followupDate"
                  value={formData?.followupDate || followupDate} // Display the formatted date
                  onChange={handleDateChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  required
                  placeholder="YYYY/MM/DD" // Ensure proper format
                  maxLength={10} // Max length for DD/MM/YYYY format
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="followupStatus"
                >
                  Followup Status<span className="text-red-500">*</span>
                </label>
                <select
                  id="followupStatus"
                  name="followupStatus"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  value={formData?.followupStatus || followupStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Followup Status</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* followupComment  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                // htmlFor="followupComment"
                >
                  Followup Comment
                </label>
                <input
                  type="text"
                  id="followupComment"
                  name="followupComment"
                  value={formData?.followupComment}
                  onChange={handleChange}
                  placeholder="Followup Comment"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="discomOption"
                >
                  Discom Option
                </label>
                <input
                  type="text"
                  id="discomOption"
                  name="discomOption"
                  value={formData?.discomOption || discomOption}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>

            <div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="solarSystemType"
                  >
                    Solar System Type<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="solarSystemType"
                    name="solarSystemType"
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                    value={formData.solarSystemType}
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

                <div className="w-full xl:w-1/2">
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
                    value={formData?.typeOfLead || typeOfLead}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type Of Lead</option>
                    <option value="Lead">Lead</option>
                    <option value="Quotation">Quotation</option>
                    <option value="HotPipeline">Hot Pipeline</option>
                    <option value="OrderCount">Order Count</option>
                    <option value="Lost">Lost</option>
                    {/* <option value="SolarPump">Solar Pump</option> */}
                  </select>
                </div>

              </div>
              {formData.typeOfLead === 'Lost' && (
                <div className="mt-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="lostReason"
                  >
                    Reason for Lost<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lostReason"
                    name="lostReason"
                    type="text"
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                    value={formData.lostReason}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="advanceAmount"
                >
                  Advance Amount<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="advanceAmount"
                  name="advanceAmount"
                  value={formData?.advanceAmount}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  required
                  placeholder="Advance Amount"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="finalAmount"
                >
                  Final Amount<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="finalAmount"
                  name="finalAmount"
                  value={formData?.finalAmount}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  required
                  placeholder="Final Amount"
                />
              </div>
            </div>
            {/* File Uploads */}
            {/* Lightbill Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Lightbill Attachment
              </label>
              {formData.lightbill ? (
                <div className="mt-2">
                  {formData.lightbill.includes(".pdf") ? (
                    <embed
                      src={formData.lightbill}
                      type="application/pdf"
                      width="100%"
                      height="500px"
                    />
                  ) : (
                    <img
                      src={formData.lightbill}
                      alt="Preview"
                      className="max-w-50 h-auto"
                    />
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    onChange={(e) => handleChange(e)}
                    name="lightbill"
                    className="border rounded w-full py-2 px-3"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  />
                </div>
              )}
              {uploading.lightbill && (
                <div className="mt-2">
                  <progress value={uploadProgress.lightbill} max="100" className="w-full" />
                  <span>{uploadProgress.lightbill}%</span>
                </div>
              )}
            </div>
            {/* Uploaded orderDocs* */}

            <div className="mb-4.5">
              {formData?.orderDocs?.length > 0 ? (
                <div className="mt-2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Uploaded orderDocs
                    <span className="text-red-500">*</span>
                  </label>
                  {formData?.orderDocs?.map((item, index) => (
                    <div className="mt-1" key={index}>
                      {item.includes(".pdf") ? (
                        <embed
                          src={item}
                          type="application/pdf"
                          width="100%"
                          height="500px"
                        />
                      ) : (
                        <img
                          src={item}
                          alt="Preview"
                          className="max-w-50 h-auto"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}

            </div>


            {/* Order Documents */}
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Order Documents {!formData.orderDocs || formData.orderDocs.length === 0 ? <span className="text-red-500">*</span> : ""}
              </label>

              <div className="mt-2">
                {formData.orderDoc.length > 0 &&
                  <div className="mt-2">
                    {formData.orderDoc.map((url, index) => (
                      <div key={index} className="mt-1">
                        {url.includes(".pdf") ? (
                          <embed src={url} type="application/pdf" width="100%" height="500px" />
                        ) : (
                          <img src={url} alt={`Preview ${index + 1}`} className="max-w-50 h-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                }
              </div>
              <input
                type="file"
                id="orderDoc"
                name="orderDoc"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onChange={handleChange}
                required={!formData.orderDocs || formData.orderDocs.length === 0}
                multiple
                accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
              />
              {uploading.orderDoc &&
                uploadProgress.orderDoc.map((progress, index) => (
                  <div key={index}>
                    <progress value={progress} max="100" className="w-full" />
                    <span>Uploading file {index + 1}: {progress}%</span>
                  </div>
                ))}
              {/* {uploading?.orderDoc && (
                <div>Uploading: {uploadProgress.orderDoc}%</div>
              )} */}
            </div>
            {/* Multiple File Upload for Site Survey */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Site Survey Form Attachment
              </label>
              {formData?.siteSurveyFormAttachment?.length > 0 ? (<>
                <div className="mt-2">
                  {formData.siteSurveyFormAttachment.length > 0 && (
                    <div className="mt-2">
                      {formData.siteSurveyFormAttachment.map((url, index) => (
                        <div key={index} className="mt-1">
                          {url.includes(".pdf") ? (
                            <embed src={url} type="application/pdf" width="100%" height="500px" />
                          ) : (
                            <img src={url} alt={`Preview ${index + 1}`} className="max-w-50 h-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>) : (<>
                <div>
                  <input
                    type="file"
                    multiple
                    onChange={handleChange}
                    name="siteSurveyFormAttachment"
                    className="border rounded w-full py-2 px-3"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  />
                  {uploading.siteSurveyFormAttachment &&
                    uploadProgress.siteSurveyFormAttachment.map((progress, index) => (
                      <div key={index}>
                        <progress value={progress} max="100" className="w-full" />
                        <span>Uploading file {index + 1}: {progress}%</span>
                      </div>
                    ))}

                </div>
              </>)}

            </div>


            <div className="mb-4.5">
              {formData?.imagess?.length > 0 ? (
                <div className="mt-2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Uploaded Images
                    <span className="text-red-500">*</span>
                  </label>
                  {formData?.imagess?.map((item, index) => (
                    <div className="mt-1" key={index}>
                      {item.includes(".pdf") ? (
                        <embed
                          src={item}
                          type="application/pdf"
                          width="100%"
                          height="500px"
                        />
                      ) : (
                        <img
                          src={item}
                          alt="Preview"
                          className="max-w-50 h-auto"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}

            </div>
            {/* Order Documents */}
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Images
              </label>

              <div className="mt-2">
                {formData.images.length > 0 &&
                  <div className="mt-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="mt-1">
                        {url.includes(".pdf") ? (
                          <embed src={url} type="application/pdf" width="100%" height="500px" />
                        ) : (
                          <img src={url} alt={`Preview ${index + 1}`} className="max-w-50 h-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                }
              </div>
              <input
                type="file"
                id="images"
                name="images"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                onChange={handleChange}
                required={!formData.images || formData.images.length === 0} 
                multiple
                accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
              />
              {uploading.images &&
                uploadProgress.images.map((progress, index) => (
                  <div key={index}>
                    <progress value={progress} max="100" className="w-full" />
                    <span>Uploading file {index + 1}: {progress}%</span>
                  </div>
                ))}
              {/* {uploading?.orderDoc && (
                <div>Uploading: {uploadProgress.orderDoc}%</div>
              )} */}
            </div>

            {/* <div className="mb-4">
              {uploadingSiteSurvey && (
                <div className="mt-2">
                  <progress
                    value={uploadProgressSiteSurvey}
                    max="100"
                    className="w-full"
                  />
                  <span>{uploadProgressSiteSurvey}%</span>
                </div>
              )}
            </div> */}
            {/* Quotation Attachment 1 */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quotation Attachment
                </label>
                {formData?.quotationAttachment1 && (
                  <div className="mt-2">
                    {formData?.quotationAttachment1?.includes(".pdf") ? (
                      <embed
                        src={formData?.quotationAttachment1}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                      />
                    ) : (
                      <img
                        src={formData?.quotationAttachment1}
                        alt="Preview"
                        className="max-w-50 h-auto"
                      />
                    )}
                  </div>
                )}
              </div>

              {previewURL && (
                <div className="mt-4">
                  <p className="text-gray-500">Uploaded File Preview:</p>
                  {previewURL.endsWith('.pdf') ? (
                    <iframe
                      src={previewURL}
                      title="PDF Preview"
                      className="w-36 h-36 border" // Width and height set to 150px
                    />
                  ) : (
                    <img
                      src={previewURL}
                      alt="Uploaded Preview"
                      className="mt-2 w-36 h-36 object-cover rounded" // Width and height set to 150px
                    />
                  )}
                </div>
              )}
              <>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "quotationAttachment1")}
                  className={`mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${uploading.quotationAttachment1 ? 'opacity-50' : ''}`}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  disabled={uploading.quotationAttachment1} // Disable input while uploading
                />
                {uploading.quotationAttachment1 && (
                  <div className="mt-2">
                    <p className="text-gray-500">Uploading: {calculateOverallProgress()}%</p>
                    <div className="bg-gray-200 h-2 rounded">
                      <div
                        className="bg-blue-500 h-full rounded"
                        style={{ width: `${calculateOverallProgress()}%` }}
                      />
                    </div>
                  </div>
                )}

              </>
            </div>

            {/* Repeat for Quotation Attachment 2 to 5 */}

            {/* Repeat for Quotation Attachment 2 to 5 */}

            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="designConformation"
              >
                Design Approval
              </label>
              <select
                id="designConformation"
                name="designConformation"
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark mb-2"
                value={designConformation}
                onChange={handleDesignChange}

                disabled
              >
                <option value="">Not require</option>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>
            </div>
            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="sensionLoan"
                >
                  Sension Loan
                </label>
                <input
                  type="text"
                  id="sensionLoan"
                  name="sensionLoan"
                  value={formData?.sensionLoan}
                  onChange={handleChange}
                  placeholder="Sension Loan"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="remarks"
                >
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData?.remarks}
                  onChange={handleChange}
                  placeholder="Remarks"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>

            {/* Dropdown for Assign Licensing Executive */}
            {formData.Assignlicensingaddexecutive?.name ? (
              <div className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark">
                <p>Name: {formData.Assignlicensingaddexecutive?.name}</p>
                <p>Email: {formData.Assignlicensingaddexecutive?.email}</p>
              </div>
            ) : (
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="Assignlicensingaddexecutive"
                >
                  Assign Licensing Executive<span className="text-red-500">*</span>
                </label>
                <select
                  id="Assignlicensingaddexecutive"
                  name="Assignlicensingaddexecutive"
                  value={formData?.Assignlicensingaddexecutive}
                  onChange={handleAssignChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  required
                >
                  <option value="">Select Executive</option>
                  {executives.map((exec) => (
                    <option key={exec._id} value={exec._id}>
                      {exec.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Customer Status and Query Fields */}
            {order && order.orderBy === "Customer" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
                <div className="mb-4 ">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="Status"
                  >
                    Customer Status<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="CustomerStatus"
                    name="CustomerStatus"
                    value={formData.CustomerStatus}
                    onChange={handleChange}
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                    <option value="OnHold">On Hold</option>
                    <option value="Query">Query</option>
                    <option value="OnWorking">On Working</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="query"
                  >
                    Customer Query
                  </label>
                  <textarea
                    id="CustomerQuery"
                    name="CustomerQuery"
                    value={formData.CustomerQuery}
                    onChange={handleChange}
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
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
                  LicenseManager Message
                </label>
                <input
                  id="LicenseManagerMessage"
                  name="LicenseManagerMessage"
                  value={formData.LicenseManagerMessage}
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
                  htmlFor="ProjectManagerMessage"
                >
                  Project Executive Message
                </label>
                <input
                  id=" ProjectManagerMessage"
                  name=" ProjectManagerMessage"
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
            {/* Status and Query Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div className="mb-4 ">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="Status"
                >
                  Status<span className="text-red-500">*</span>
                </label>
                <select
                  id="Status"
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Complete">Complete</option>
                  <option value="OnHold">On Hold</option>
                  <option value="Query">Query</option>
                  <option value="OnWorking">On Working</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="query"
                >
                  Query
                </label>
                <textarea
                  id="query"
                  name="query"
                  value={formData.query}
                  placeholder="Query"
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {salesLoading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddSalesOrder;

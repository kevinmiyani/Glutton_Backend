/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { CiSquarePlus } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { ORDER, Stock } from "../../api/call";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../api/firebaseconfig";

const OrderDetails = () => {
  const location = useLocation();
  const { order } = location.state || {}; // Extract the order from the passed state
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(order);
  const [orderLoading, setorderLoading] = useState(false);
  const role = localStorage.getItem("role")

  console.log("dateee", editedOrder.dispatchDate)


  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const useCarousel = (items) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    const handlePrev = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    return { currentIndex, handleNext, handlePrev };
  };
  const DocumentCarousel = ({ documents, label }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = (e) => {
      e.preventDefault(); // Prevent form submission
      e.stopPropagation(); // Stop event propagation
      if (currentIndex < documents.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    const handlePrev = (e) => {
      e.preventDefault(); // Prevent form submission
      e.stopPropagation(); // Stop event propagation
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    return (
      <div>
        <div className="relative mt-2 flex items-center justify-center">
          <button
            onClick={handlePrev}
            className="absolute left-0 bg-black text-white p-2 rounded-full shadow hover:bg-indigo-600 transition duration-200"
            disabled={currentIndex === 0}
            type="button" // Explicitly set button type
          >
            <FaArrowLeft className="text-white text-[10px]" />
          </button>
          <div className="flex justify-center w-96">
            {documents[currentIndex] &&
              typeof documents[currentIndex] === "string" &&
              documents[currentIndex].includes(".pdf") ? (
              <embed
                src={documents[currentIndex]}
                type="application/pdf"
                className="w-[80vh] h-[200px] object-cover"
              />
            ) : (
              <img
                src={documents[currentIndex]}
                alt={`Document ${currentIndex + 1}`}
                className="w-[70%] h-auto object-cover"
              />
            )}
          </div>
          <button
            onClick={handleNext}
            className="absolute right-0 bg-black text-white p-2 rounded-full shadow hover:bg-indigo-600 transition duration-200"
            disabled={currentIndex === documents.length - 1}
            type="button" // Explicitly set button type
          >
            <FaArrowRight className="text-white text-[10px]" />
          </button>
        </div>
        <div className="text-center mt-2">
          {currentIndex + 1} / {documents.length}
        </div>
      </div>
    );
  };

  if (!order) {
    return <div>No Order Found</div>;
  }

  const formatDate = (date) => {
    if (!date) return ''; // Handle empty dates
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Implement your submit logic here, e.g., send updated order to the server
  //   console.log("Updated Order: ", editedOrder);
  //   setIsEditing(false); // Exit edit mode after submission
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setorderLoading(true);

    const Managerdata = {
      orderId: editedOrder._id,
      data: {
        ...editedOrder,
        quotationAttachment1: editedOrder.quotationAttachment1?.length > 0 ? editedOrder.quotationAttachment1 : "",
        deliveryChallan: editedOrder.deliveryChallan?.length > 0 ? editedOrder.deliveryChallan : "",
        paymentConfirmation: editedOrder.paymentConfirmation?.length > 0 ? editedOrder.paymentConfirmation : "",
        signDocuments: editedOrder.signDocuments?.length > 0 ? editedOrder.signDocuments : "",
        designPlan: editedOrder.designPlan?.length > 0 ? editedOrder.designPlan : "",
        applicationForm: editedOrder.applicationForm?.length > 0 ? editedOrder.applicationForm : "",
        materialDeliveryPhotos: editedOrder.materialDeliveryPhotos?.length > 0 ? editedOrder.materialDeliveryPhotos : "",
        siteSurveyFormAttachment: editedOrder.siteSurveyFormAttachment?.length > 0 ? editedOrder.siteSurveyFormAttachment : "",
        GEDADocuments: editedOrder.GEDADocuments?.length > 0 ? editedOrder.GEDADocuments : "",
        lightbill: editedOrder.lightbill?.length > 0 ? editedOrder.lightbill : "",
        SiteDocuments: editedOrder.SiteDocuments?.length > 0 ? editedOrder.SiteDocuments : "",
        billOfMaterials: formdata.billOfMaterials.length > 0 ? formdata.billOfMaterials : [],
        materialOutvertEntry: FormData1.materialOutvertEntry.length > 0 ? FormData1.materialOutvertEntry : [],
      }
    };

    try {
      const response = await ORDER.verifyOrder(Managerdata);
      console.log("response.data", response.data);
      if (response.status === 200) {
        setEditedOrder(response.data.data)
        console.log("response.data", response.data.data);
        toast.success("Order updated successfully!");
        navigate("/orders")
      } else {
        console.log("Failed to verify editedOrder. Please try again.");
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setorderLoading(false);
    }
  };
  const [isUploading, setIsUploading] = useState({
    quotationAttachment1: false,
    quotationAttachment2: false,
    quotationAttachment3: false,
    quotationAttachment4: false,
    quotationAttachment5: false,
    paymentConfirmation: false,
    signDocuments: false,
    materialDeliveryPhotos: false,
    applicationForm: false,
    designPlan: false,
    deliveryChallan: false,
    siteSurveyFormAttachment: false,
    GEDADocuments: false,
    lightbill: false,
    SiteDocuments: false
  });
  const [previewURL, setPreviewURL] = useState('');
  const [previewURL6, setPreviewURL6] = useState('');
  const [previewURL7, setPreviewURL7] = useState('');
  const [previewURL8, setPreviewURL8] = useState('');
  const [previewURL9, setPreviewURL9] = useState('');
  const [previewURL10, setPreviewURL10] = useState('');
  const [previewURL11, setPreviewURL11] = useState('');
  const [previewURLs11, setPreviewURLs11] = useState([]);
  const [previewURLs12, setPreviewURLs12] = useState([]);
  const [previewURLs13, setPreviewURLs13] = useState([]);
  const handleFileChange = (e, name) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0]; // Take the first file
      const storageRef = ref(storage, `docs/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Set loading state to true for the specific file
      setIsUploading((prev) => ({ ...prev, [name]: true }));

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
          setIsUploading((prev) => ({ ...prev, [name]: false }));
        },
        async () => {
          // Handle successful uploads
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(`File available at ${downloadURL}`);

          // Update editedOrder state with the downloadURL directly as a string
          setEditedOrder((prev) => ({
            ...prev,
            [name]: downloadURL,
          }));

          // Dynamically set the preview URL for the specific file
          if (name === "quotationAttachment1") {
            setPreviewURL(downloadURL);
          } else if (name === "paymentConfirmation") {
            setPreviewURL6(downloadURL);
          } else if (name === "signDocuments") {
            setPreviewURL7(downloadURL);
          } else if (name === "materialDeliveryPhotos") {
            setPreviewURL8(downloadURL);
          } else if (name === "applicationForm") {
            setPreviewURL9(downloadURL);
          } else if (name === "designPlan") {
            setPreviewURL10(downloadURL);
          } else if (name === "lightbill") {
            setPreviewURL11(downloadURL);
          }

          toast.success("File uploaded successfully");

          // Reset loading state and progress after successful upload
          setIsUploading((prev) => ({ ...prev, [name]: false }));
          setUploadProgress((prev) => ({ ...prev, [name]: 0 }));
        }
      );
    }
  };

  // Function to calculate overall progress
  const calculateOverallProgress = () => {
    const totalProgress = Object.values(uploadProgress).reduce((acc, curr) => acc + curr, 0);
    const numberOfFiles = Object.values(uploadProgress).filter(progress => progress > 0).length; // Count only files with progress
    return numberOfFiles ? Math.round(totalProgress / numberOfFiles) : 0; // Avoid division by zero
  };

  const handleFileChange1 = (e, name) => {
    const files = e.target.files;

    if (files.length > 0) {
      const newPreviewURLs = [];

      Array.from(files).forEach((file) => {
        const storageRef = ref(storage, `docs/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Set loading state to true for the specific file
        setIsUploading((prev) => ({ ...prev, [name]: true }));

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prev) => ({ ...prev, [name]: progress }));
          },
          (error) => {
            console.error("Upload failed", error);
            toast.error("File upload failed");

            // Set loading state to false in case of an error
            setIsUploading((prev) => ({ ...prev, [name]: false }));
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(`File available at ${downloadURL}`);

            // Update the editedOrder state with the new file URL
            setEditedOrder((prev) => ({
              ...prev,
              [name]: prev[name] ? [...prev[name], downloadURL] : [downloadURL], // Store files as an array
            }));

            newPreviewURLs.push(downloadURL); // Store preview URL for this file


            if (name === "GEDADocuments") {
              if (newPreviewURLs.length === files.length) {
                setPreviewURLs12((prevURLs) => [...prevURLs, ...newPreviewURLs]);
              }
            } else if (name === "siteSurveyFormAttachment") {
              if (newPreviewURLs.length === files.length) {
                setPreviewURLs11((prevURLs) => [...prevURLs, ...newPreviewURLs]);
              }
            } else if (name === "SiteDocuments") {
              if (newPreviewURLs.length === files.length) {
                setPreviewURLs13((prevURLs) => [...prevURLs, ...newPreviewURLs]);
              }
            }
            // Once all files are uploaded, update the preview URLs in setPreviewURLs12

            toast.success("File uploaded successfully");

            // Reset loading state and progress after upload
            setIsUploading((prev) => ({ ...prev, [name]: false }));
            setUploadProgress((prev) => ({ ...prev, [name]: 0 }));
          }
        );
      });
    }
  };


  const handleFileUpload = (file, fieldName, index = null) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        // Update progress for the file
        setUploadProgress((prev) => {
          const newProgress = [...(prev[fieldName] || [])];
          if (index !== null) {
            newProgress[index] = Math.round(progress); // For multiple files
          } else {
            newProgress[0] = Math.round(progress); // For single file
          }
          return {
            ...prev,
            [fieldName]: newProgress,
          };
        });

        // Set uploading state to true
        setUploading((prev) => ({
          ...prev,
          [fieldName]: true,
        }));
      },
      (error) => {
        console.error("Upload failed:", error);
        toast.error("File upload failed. Please try again.");

        // Reset uploading state on error
        setUploading((prev) => ({
          ...prev,
          [fieldName]: false,
        }));
      },
      async () => {
        // Get download URL once upload is completed
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Update formData with the file URL
        setEditedOrder((prevFormData) => {
          if (index !== null) {
            // For multiple files like GEDA documents
            const newDocuments = [...(prevFormData[fieldName] || [])];
            newDocuments[index] = downloadURL;
            return {
              ...prevFormData,
              [fieldName]: newDocuments,
            };
          } else {
            return {
              ...prevFormData,
              [fieldName]: downloadURL, // Store as a string
            };
          }
        });

        // Reset upload progress after successful completion
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

        // Reset uploading state
        setUploading((prev) => ({
          ...prev,
          [fieldName]: false,
        }));

        toast.success("File uploaded successfully");
      }
    );
  };

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;

  //   // If it's a file input, handle the file upload
  //   if (files) {
  //     const filesArray = Array.from(files);
  //     filesArray.forEach((file, index) => {
  //       handleFileUpload(file, name, filesArray.length > 1 ? index : null); // Pass index for multiple files
  //     });
  //   }
  //   // If it's a text input, update the form data directly
  //   else {
  //     setEditedOrder((prevOrder) => ({
  //       ...prevOrder,
  //       [name]: value, // Store text input values
  //     }));
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // If it's a file input, handle the file upload
    if (files) {
      const filesArray = Array.from(files);
      filesArray.forEach((file, index) => {
        handleFileUpload(file, name, filesArray.length > 1 ? index : null); // Pass index for multiple files
      });
    }
    // If it's a text input, update the form data directly
    else {
      setEditedOrder((prevOrder) => ({
        ...prevOrder,
        [name]: value, // Store text input values
      }));
    }
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    console.log("Updated Data:", editedOrder); // Log the updated data
    // You can further process the data, like sending to API, etc.
  };

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [formdata, setFormData] = useState(order);

  const [newMaterial, setNewMaterial] = useState({
    CategoryName: "",
    Material: "",
    Brand: "",
    Unit: "",
    quantity: "",
    PricePerUnit: "",
  });

  const addMaterial = () => {
    setShowModal(true);
  };
  const handleNewMaterialChange = (field, value) => {
    setNewMaterial({ ...newMaterial, [field]: value });
  };
  const saveNewMaterial = () => {
    if (newMaterial.CategoryName && newMaterial.Material && newMaterial.Brand) {
      setFormData({
        ...formdata,
        billOfMaterials: [...formdata.billOfMaterials, newMaterial],
      });

      toast.success("Material Add SuccessFull");
      closeModal(); // Close modal after adding new material
    } else {
      toast.error("Please fill in all required fields"); // Simple validation
    }
  };
  const removeMaterial = (index) => {
    const updatedMaterials = formdata.billOfMaterials.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formdata, billOfMaterials: updatedMaterials });
  };
  const closeModal = () => {
    setShowModal(false);
    setNewMaterial({
      CategoryName: "",
      Material: "",
      Brand: "",
      Unit: "",
      quantity: "",
      PricePerUnit: "",
    });
  };
  const toggleModal = () => {
    setShowModal1(!showModal1);
  };
  const [showModal2, setShowModal2] = useState(false);
  const toggleModal1 = () => {
    setShowModal2(!showModal2);
  };

  // outword
  const [showOutwardModal, setShowOutwardModal] = useState(false);
  const [showOutwardListModal, setShowOutwardListModal] = useState(false);
  const [FormData1, setFormData1] = useState(order);

  const [newOutward, setNewOutward] = useState({
    CategoryName: "",
    Material: "",
    Brand: "",
    Unit: "",
    quantityOutward: "",
    PricePerUnit: "",
  });
  const closeOutwardModal = () => {
    setShowOutwardModal(false);
    setNewOutward({
      CategoryName: "",
      Material: "",
      Brand: "",
      Unit: "",
      quantityOutward: "",
      PricePerUnit: "",
    });
  };
  const addOutward = () => {
    setShowOutwardModal(true);
  };
  const toggleOutwardListModal = () => {
    setShowOutwardListModal(!showOutwardListModal);
  };
  const handleNewOutwardChange = (field, value) => {
    setNewOutward({ ...newOutward, [field]: value });
  };
  const saveNewOutward = async () => {
    const { CategoryName, Material, Brand, quantityOutward } = newOutward;
    console.log("newOutward", newOutward);

    if (CategoryName && Material && Brand && quantityOutward) {
      // Prepare the request body for the API call
      const stockCheckData = {
        materialName: Material,
        brand: Brand,
        quantity: quantityOutward,
      };

      await Stock.checkstock(stockCheckData)
        .then((response) => {
          const { status, message, data } = response.data;

          if (!status) {
            toast.error(message);
          } else if (data.isEnoughStock === false) {
            toast.error(
              `Stock is insufficient. Available: ${data.availableStock} , Requested: ${data.requestedQuantity}`
            );
          } else {
            toast.success("Stock is added");
            setFormData1({
              ...FormData1,
              materialOutvertEntry: [
                ...FormData1.materialOutvertEntry,
                newOutward,
              ],
            });
            closeOutwardModal();
          }
        })
        .catch((error) => {
          // Handle any API errors
          alert(`Error checking stock: ${error.message}`);
        });
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const removeMaterialout = (index) => {
    const updatedMaterialsout = FormData1.materialOutvertEntry.filter(
      (_, i) => i !== index
    );
    setFormData1({ ...FormData1, materialOutvertEntry: updatedMaterialsout });
  };
  const [uploading, setUploading] = useState({
    quotationAttachment1: false,
    quotationAttachment2: false,
    quotationAttachment3: false,
    quotationAttachment4: false,
    quotationAttachment5: false,
    paymentConfirmation: false,
    signDocuments: false,
    designPlan: false,
    applicationForm: false,
    materialDeliveryPhotos: false,
    siteSurveyFormAttachment: false,
    GEDADocuments: false,
    lightbill: false,
    SiteDocuments: false
  });
  const [uploadProgress, setUploadProgress] = useState({
    CLGletter: 0, // Assuming these are numbers for progress
    GEDADocuments: 0,
    quotationAttachment1: 0,
    quotationAttachment2: 0,
    quotationAttachment3: 0,
    quotationAttachment4: 0,
    quotationAttachment5: 0,
    deliveryChallan: 0,
    paymentConfirmation: 0,
    signDocuments: 0,
    designPlan: 0,
    applicationForm: 0,
    materialDeliveryPhotos: 0,
    siteSurveyFormAttachment: 0,
    lightbill: 0,
    SiteDocuments: 0
  });
  const [uploadingQuotation, setUploadingQuotation] = useState({});


  // const handleFileUpload = (file, fieldName, index = null) => {
  //   const fileRef = ref(storage, `attachments/${file.name}`);
  //   const uploadTask = uploadBytesResumable(fileRef, file);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

  //       // Update progress
  //       setUploadProgress((prev) => {
  //         const newProgress = [...(prev[fieldName] || [])]; // Handle both single and multiple
  //         if (index !== null) {
  //           newProgress[index] = Math.round(progress);
  //         } else {
  //           newProgress[0] = Math.round(progress); // For single file
  //         }
  //         return {
  //           ...prev,
  //           [fieldName]: newProgress,
  //         };
  //       });

  //       setUploading((prev) => ({
  //         ...prev,
  //         [fieldName]: true,
  //       }));
  //     },
  //     (error) => {
  //       console.error("Upload failed:", error);
  //       toast.error("File upload failed. Please try again.");
  //       setUploading((prev) => ({
  //         ...prev,
  //         [fieldName]: false,
  //       }));
  //     },
  //     async () => {
  //       const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //       setFormData((prevFormData) => {
  //         if (index !== null) {
  //           // For multiple files like GEDA documents
  //           const newDocuments = [...(prevFormData[fieldName] || [])];
  //           newDocuments[index] = downloadURL;
  //           return {
  //             ...prevFormData,
  //             [fieldName]: newDocuments,
  //           };
  //         } else {
  //           return {
  //             ...prevFormData,
  //             [fieldName]: downloadURL, // Store as a string
  //           };
  //         }
  //       });


  //       // Reset upload progress after completion
  //       setUploadProgress((prev) => {
  //         const newProgress = [...(prev[fieldName] || [])];
  //         if (index !== null) {
  //           newProgress[index] = 0;
  //         } else {
  //           newProgress[0] = 0;
  //         }
  //         return {
  //           ...prev,
  //           [fieldName]: newProgress,
  //         };
  //       });
  //       setUploading((prev) => ({
  //         ...prev,
  //         [fieldName]: false,
  //       }));

  //       toast.success("File uploaded successfully");
  //     }
  //   );
  // };
  console.log(order);
  return (
    <div className="p-4  dark:bg-boxdark rounded-lg shadow-md">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-black dark:text-white">
          Order Details
        </h1>
        <div className="flex items-center">
          <MdKeyboardBackspace
            onClick={handleGoBack}
            className="text-indigo-500 text-2xl cursor-pointer ml-4"
          />
          {role === "ADMIN" && <button
            onClick={handleEditToggle}
            className="flex items-center gap-1 text-black dark:text-white ml-2"
          >
            <CiSquarePlus />
            <span>{isEditing ? "Cancel" : "Edit"}</span>
          </button>}

        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="container mx-auto p-4  ">
          <div className="max-w-full mx-auto bg-white dark:bg-boxdark rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-t-lg">
              <h2 className="text-gray-800 dark:text-white text-xl font-bold text-center">
                Order Details
              </h2>
            </div>

            <div className="p-6 bg-gray-100 dark:bg-gray-600 rounded-b-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Order Number Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="orderNumber"
                  >
                    Order Number:
                  </label>
                  <input
                    id="orderNumber"
                    className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white font-bold"
                    type="text"
                    value={editedOrder.orderNumber}
                    readOnly
                  />
                </div>
                {/* Client Name Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="clientName"
                  >
                    Client Name:
                  </label>
                  <input
                    id="clientName"
                    className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white font-bold"
                    type="text"
                    value={
                      editedOrder.orderBy === "Customer"
                        ? editedOrder.userid.name
                        : editedOrder.clientName
                    }
                    readOnly
                  />
                </div>
                {/* Client Email Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="clientEmail"
                  >
                    Client Email:
                  </label>
                  <input
                    id="clientEmail"
                    className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white font-bold"
                    type="email"
                    value={editedOrder.orderBy === "Customer"
                      ? editedOrder.userid?.email : editedOrder.clientEmail}
                    readOnly
                  />
                </div>
                {/* Contact Number Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="contactNumber"
                  >
                    Contact Number:
                  </label>
                  <input
                    id="contactNumber"
                    className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 font-bold"
                    type="text"
                    value={editedOrder.orderBy === "Customer" ? editedOrder.userid?.contactNumber : editedOrder.contactNumber}
                    readOnly
                  />
                </div>
                {/* Address Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="contactNumber"
                  >
                    Address:
                  </label>
                  <input
                    id="contactNumber"
                    className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 font-bold"
                    type="text"
                    value={editedOrder.orderBy === "Customer" ? editedOrder.userid?.clientAddress : editedOrder.clientAddress}
                    readOnly
                  />
                </div>
                {/* Client Latitude Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="clientLatitude"
                  >
                    Client Latitude:
                  </label>
                  <input
                    id="clientLatitude"
                    className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 font-bold"
                    type="text"
                    value={editedOrder.clientLatitude}
                    readOnly
                  />
                </div>
                {/* Client Longitude Field */}
                <div className="mb-4">
                  <label
                    className="block dark:bg-boxdark text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="clientLongitude"
                  >
                    Client Longitude:
                  </label>
                  <input
                    id="clientLongitude"
                    className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 font-bold"
                    type="text"
                    value={editedOrder.clientLongitude}
                    readOnly
                  />
                </div>
                {/* Order Count Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="orderCount"
                  >
                    Order Count:
                  </label>
                  <input
                    id="orderCount"
                    className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 font-bold"
                    type="text"
                    value={editedOrder.orderCount}
                    readOnly
                  />
                </div>
                {/* Kilowatt Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="expectedKilowatt"
                  >
                    Kilowatt:
                  </label>
                  {isEditing ? (
                    <input
                      id="expectedKilowatt"
                      type="text"
                      name="expectedKilowatt"
                      value={editedOrder.expectedKilowatt}
                      onChange={handleChange}
                      className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.expectedKilowatt}
                    </div>
                  )}
                </div>
                {/* Exact Kilowatt Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="conformKilowatt"
                  >
                    Exact Kilowatt:
                  </label>
                  {isEditing ? (
                    <input
                      id="conformKilowatt"
                      type="text"
                      name="conformKilowatt"
                      value={editedOrder.conformKilowatt}
                      onChange={handleChange}
                      className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.conformKilowatt}
                    </div>
                  )}
                </div>
                {/* Final Amount Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="finalAmount"
                  >
                    Final Amount:
                  </label>
                  {isEditing ? (
                    <input
                      id="finalAmount"
                      type="text"
                      name="finalAmount"
                      value={editedOrder.finalAmount}
                      onChange={handleChange}
                      className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.finalAmount}
                    </div>
                  )}
                </div>
                {/* Type of Solar System Field */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-300 font-semibold mb-1"
                    htmlFor="typeOfSolarSystem"
                  >
                    Type of Solar System:
                  </label>
                  {isEditing ? (
                    <select
                      id="typeOfSolarSystem"
                      name="typeOfSolarSystem"
                      value={editedOrder.typeOfSolarSystem}
                      onChange={handleChange}
                      className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      <option value="">Select Type of Solar System</option>
                      <option value="ONGrid">ON Grid</option>
                      <option value="OFFGrid">OFF Grid</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="ResidentialCommon">
                        Residential Common
                      </option>
                    </select>
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.typeOfSolarSystem}
                    </div>
                  )}
                </div>
                {/* Solar System Type Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Solar System Type:
                  </strong>{" "}
                  {isEditing ? (
                    <select
                      name="solarSystemType"
                      value={editedOrder.solarSystemType}
                      onChange={handleChange}
                      className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      <option value="">Select Solar System Type</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="SolarFarm">Solar Farm</option>
                      <option value="SolarPump">Solar Pump</option>
                    </select>
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.solarSystemType}
                    </div>
                  )}
                </div>
                {/* Advance Payment Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Advance Payment:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="advanceAmount"
                      value={editedOrder.advanceAmount}
                      onChange={handleChange}
                      className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.advanceAmount}
                    </div>
                  )} 
                </div>
                {/* Remarks Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Remarks:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="remarks"
                      value={editedOrder.remarks}
                      onChange={handleChange}
                      className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.remarks}
                    </div>
                  )}
                </div>
                {/* Followup Status Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Followup Status:
                  </strong>{" "}
                  {isEditing ? (
                    <select
                      name="followupStatus"
                      value={editedOrder.followupStatus}
                      onChange={handleChange}
                      className="w-full dark:bg-boxdark p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      <option value="">Select Followup Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.followupStatus}
                    </div>
                  )}
                </div>
                {/* Followup Comment Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Followup Comment:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="followupComment"
                      value={editedOrder.followupComment}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.followupComment}
                    </div>
                  )}
                </div>
                {/* Followup Date Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Followup Date:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="date"
                      name="followupDate"
                      value={formatDate(editedOrder.followupDate)} // Set the date for editing
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {formatDate(editedOrder.followupDate)}
                    </div>
                  )}
                </div>
                {/* Discom Option Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Discom Option:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="discomOption"
                      value={editedOrder.discomOption}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.discomOption}
                    </div>
                  )}
                </div>
                {/* Delivery Date Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Delivery Date:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="date"
                      name="estimatedDispatchDate"
                      value={editedOrder.estimatedDispatchDate}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.estimatedDispatchDate}
                    </div>
                  )}
                </div>
                {/* Expected Delivery Time Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Expected Delivery Time:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="expectedDeliveryTime"
                      value={editedOrder.expectedDeliveryTime}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      placeholder="Enter expected delivery time" // Optional placeholder
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.expectedDeliveryTime
                        ? editedOrder.expectedDeliveryTime
                        : "N/A"}
                    </div>
                  )}
                </div>
                {/* Shadow Free Area Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Shadow Free Area:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="shadowFreeArea"
                      value={editedOrder.shadowFreeArea}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.shadowFreeArea ? editedOrder.shadowFreeArea : "N/A"}
                    </div>
                  )}
                </div>
                {/* Sension Loan Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Sension Loan:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="sensionLoan"
                      value={editedOrder.sensionLoan}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.sensionLoan}
                    </div>
                  )}
                </div>
                {/* Type of Lead Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Type of Lead:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="typeOfLead"
                      value={editedOrder.typeOfLead}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.typeOfLead}
                    </div>
                  )}
                </div>
                {/* Design Conformation Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Design Conformation:
                  </strong>{" "}
                  {isEditing ? (
                    <select
                      name="designConformation"
                      value={editedOrder.designConformation}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                      <option value="">Select Design Conformation</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.designConformation || "Not confirmed"}
                    </div>
                  )}
                </div>
                {/* State Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    State:
                  </strong>
                  <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                    {editedOrder.state || "Not specified"}
                  </div>
                </div>
                {/* Dispatch Date Field */}
                <div className="mb-4">
                  <strong className="text-gray-700 dark:text-gray-300">
                    Dispatch Date:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="date"
                      name="dispatchDate"
                      value={formatDate(editedOrder.dispatchDate)}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {editedOrder.dispatchDate ? formatDate(editedOrder.dispatchDate) : "N/A"}
                    </div>
                  )}
                </div>
                {/* Installer Name Field */}
                <div className="mb-4">
                  <strong className="text-gray-800 dark:text-gray-200">
                    Installer Name:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="installerName"
                      value={editedOrder.installerName}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      placeholder="Enter installer name" // Placeholder for better UX
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {/* Display installer name or a fallback if not available */}
                      {editedOrder.installerName || "N/A"}
                    </div>
                  )}
                </div>
                {/* Installer Price Field */}
                <div className="mb-4">
                  <strong className="text-gray-800 dark:text-gray-200">
                    Installer Price:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="installerPrice"
                      value={editedOrder.installerPrice}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      placeholder="Enter installer price" // Placeholder for better UX
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {/* Display installer price or a fallback if not available */}
                      {editedOrder.installerPrice !== undefined
                        ? `${editedOrder.installerPrice}`
                        : "N/A"}
                    </div>
                  )}
                </div>
                {/* Meter Installation Date Field */}
                <div className="mb-4">
                  <strong className="text-gray-800 dark:text-gray-200">
                    Meter Installation:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="date"
                      name="meterInstallationDate"
                      value={editedOrder.meterInstallationDate}
                      onChange={handleChange}
                      className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      placeholder="Enter meter installation date" // Placeholder for better UX
                    />
                  ) : (
                    <div className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600">
                      {/* Display meter installation date or a fallback if not available */}
                      {editedOrder.meterInstallationDate
                        ? formatDate(editedOrder.meterInstallationDate)
                        : "N/A"}
                    </div>
                  )}
                </div>
                {/* Project Completion Date Field */}
                <div className="mb-4">
                  {" "}
                  {/* Bottom margin to separate fields */}
                  <strong className="text-gray-800 dark:text-gray-200">
                    {" "}
                    {/* Label styles */}
                    Project Completion Date:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="date" // Consider changing to "date" for better user experience
                      name="projectCompletionDate"
                      value={editedOrder.projectCompletionDate}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600" // Smooth transitions for focus states
                      placeholder="Enter project completion date" // Placeholder for better UX
                      aria-label="Project Completion Date" // Accessibility improvement
                    />
                  ) : (
                    <div
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                    dark:bg-gray-800 dark:text-white dark:border-gray-600 
                    flex items-center"
                    >
                      {" "}
                      {/* Center text vertically */}
                      {/* Display project completion date or "Pending" if not available */}
                      {editedOrder.projectCompletionDate
                        ? formatDate(editedOrder.projectCompletionDate)
                        : "Pending"}
                    </div>
                  )}
                </div>
                {/* Bottom margin to separate fields */}
                <div className="mb-4">
                  <strong className="text-gray-800 dark:text-gray-200">
                    {" "}
                    {/* Label styles */}
                    CIG Completed Date:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="date" // Consider changing to "date" for better user experience
                      name="CIGCompleteDate"
                      value={editedOrder.CIGCompleteDate}
                      onChange={handleChange}
                      className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 dark:bg-gray-800 dark:text-white dark:border-gray-600 
                 transition duration-150 ease-in-out" // Smooth transitions for focus states
                      placeholder="Enter CIG completed date" // Placeholder for better UX
                      aria-label="CIG Completed Date" // Accessibility improvement
                    />
                  ) : (
                    <div
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                    dark:bg-gray-800 dark:text-white dark:border-gray-600 
                    flex items-center"
                    >
                      {" "}
                      {/* Center text vertically */}
                      {/* Display CIG completed date or "Pending" if not available */}
                      {editedOrder.CIGCompleteDate
                        ? formatDate(editedOrder.CIGCompleteDate)
                        : "Pending"}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  {/* CIG Registration Date Field */}
                  <strong className="text-gray-800 dark:text-gray-200">
                    CIG Registration Date:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="date" // Consider changing to "date" for better user experience
                      name="CIGRegistrationDate"
                      value={editedOrder.CIGRegistrationDate}
                      onChange={handleChange}
                      className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 dark:bg-gray-800 dark:text-white dark:border-gray-600 
                 transition duration-150 ease-in-out" // Smooth transitions for focus states
                      placeholder="Enter CIG registration date" // Placeholder for better UX
                      aria-label="CIG Registration Date" // Accessibility improvement
                    />
                  ) : (
                    <div
                      className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                    dark:bg-gray-800 dark:text-white dark:border-gray-600 
                    flex items-center"
                    >
                      {" "}
                      {/* Center text vertically */}
                      {/* Display CIG registration date or "Pending" if not available */}
                      {editedOrder.CIGRegistrationDate
                        ? formatDate(editedOrder.CIGRegistrationDate)
                        : "Pending"}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  {/* Inverter Company Name Field */}
                  <strong className="text-gray-800 dark:text-gray-200">
                    Inverter Company Name:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="inverterCompanyName"
                      value={editedOrder.inverterCompanyName}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 dark:bg-gray-800 dark:text-white dark:border-gray-600 
                 transition duration-150 ease-in-out" // Smooth transitions for focus states
                      placeholder="Enter inverter company name" // Placeholder for better UX
                      aria-label="Inverter Company Name" // Accessibility improvement
                    />
                  ) : (
                    <div
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                    dark:bg-gray-800 dark:text-white dark:border-gray-600 
                    flex items-center"
                    >
                      {" "}
                      {/* Center text vertically */}
                      {/* Display inverter company name or "N/A" if not available */}
                      {editedOrder.inverterCompanyName || "N/A"}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  {/* WiFi Configuration Details Field */}
                  <strong className="text-gray-800 dark:text-gray-200">
                    WiFi Configuration Details:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="wifiConfiguration"
                      value={editedOrder.wifiConfiguration}
                      onChange={handleChange}
                      className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 dark:bg-gray-800 dark:text-white dark:border-gray-600 
                 transition duration-150 ease-in-out" // Smooth transitions for focus states
                      placeholder="Enter WiFi configuration details" // Placeholder for better UX
                      aria-label="WiFi Configuration Details" // Accessibility improvement
                    />
                  ) : (
                    <div
                      className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                    dark:bg-gray-800 dark:text-white dark:border-gray-600 
                    flex items-center"
                    >
                      {" "}
                      {/* Center text vertically */}
                      {/* Display WiFi configuration details or "Not configured" if not available */}
                      {editedOrder.wifiConfiguration || "Not configured"}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  {/* Figibility Approve Field */}
                  <strong className="text-gray-800 dark:text-gray-200">
                    Figibility Approve:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="figibilityApprove"
                      value={editedOrder.figibilityApprove}
                      onChange={handleChange}
                      className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 dark:bg-gray-800 dark:text-white dark:border-gray-600 
                 transition duration-150 ease-in-out" // Smooth transitions for focus states
                      placeholder="Enter figibility approve status" // Placeholder for better UX
                      aria-label="Figibility Approve" // Accessibility improvement
                    />
                  ) : (
                    <div
                      className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                    dark:bg-gray-800 dark:text-white dark:border-gray-600 
                    flex items-center"
                    >
                      {" "}
                      {/* Center text vertically */}
                      {/* Display figibility approve status or "Not figibility approved" if not available */}
                      {editedOrder.figibilityApprove || "Not figibility approved"}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  {/* Username Field */}
                  <strong className="text-gray-800 dark:text-gray-200">
                    UserName:
                  </strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={editedOrder.username}
                      onChange={handleChange}
                      className="w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 dark:bg-gray-800 dark:text-white dark:border-gray-600 
                 transition duration-150 ease-in-out" // Smooth transitions for focus states
                      placeholder="Enter username" // Placeholder for better UX
                      aria-label="Username" // Accessibility improvement
                    />
                  ) : (
                    <div
                      className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                    dark:bg-gray-800 dark:text-white dark:border-gray-600 
                    flex items-center"
                    >
                      {" "}
                      {editedOrder.username || "Not provided"}
                    </div>
                  )}
                </div>
                <div className="">
                  {editedOrder.referencefrom.referncename && (
                    <div className="">
                      <strong className="text-gray-800 dark:text-gray-200">
                        Reference From:
                      </strong>{" "}
                      <div
                        className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                    dark:bg-gray-800 dark:text-white dark:border-gray-600 
                    flex items-center"
                      >
                        {" "}
                        {editedOrder.referencefrom.referncename ||
                          "Not Reference From"}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  {editedOrder.assignto.assignname && (
                    <div className="">
                      <strong className="text-gray-800 dark:text-gray-200">
                        Assign To:
                      </strong>{" "}
                      <div
                        className=" w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md 
                    dark:bg-gray-800 dark:text-white dark:border-gray-600 
                    flex items-center"
                      >
                        {" "}
                        {editedOrder.assignto.assignname || "Not Assign To"}
                      </div>
                    </div>
                  )}
                </div>
                <div></div>
                <div className="mb-4">
                  {/* Increased bottom margin for better separation */}
                  <strong className="text-gray-800 dark:text-gray-200 pb-2">
                    Bill Of Materials
                  </strong>{" "}
                  {/* Updated heading */}
                  <div className="flex flex-wrap gap-4">
                    {" "}
                    {/* Flex container for buttons */}
                    <button
                      type="button"
                      onClick={addMaterial}
                      className="flex items-center gap-2 rounded-lg border border-primary bg-primary p-2 text-white shadow-md hover:bg-opacity-90 transition duration-150 ease-in-out w-full sm:w-auto"
                    >
                      {/* <span className="material-icons">add</span> */}
                      <span> + Add Material</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="flex items-center gap-2 rounded-lg border border-primary bg-secondary p-2 text-white shadow-md hover:bg-opacity-90 transition duration-150 ease-in-out w-full sm:w-auto"
                    >
                      {/* <span className="material-icons">visibility</span> */}
                      <span>View Material</span>
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  {/* Increased bottom margin for better separation */}
                  <strong className="text-gray-700">
                    Materials Outward Entry
                  </strong>{" "}
                  {/* Updated heading */}
                  <div className="flex flex-wrap gap-4">
                    {" "}
                    {/* Flex container for buttons */}
                    <button
                      type="button"
                      onClick={addOutward}
                      className="flex items-center gap-2 rounded-lg border border-primary bg-primary p-2 text-white shadow-md hover:bg-opacity-90 transition duration-150 ease-in-out w-full sm:w-auto"
                    >
                      {/* <span className="material-icons">add</span> */}
                      <span>+ Add Outward</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleOutwardListModal}
                      className="flex items-center gap-2 rounded-lg border border-primary bg-secondary p-2 text-white shadow-md hover:bg-opacity-90 transition duration-150 ease-in-out w-full sm:w-auto"
                    >
                      {/* <span className="material-icons">visibility</span> */}
                      <span>View Material</span>
                    </button>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  {" "}
                  {/* Card style with a subtle background */}
                  <strong className="text-gray-800 dark:text-gray-200 text-2xl font-bold border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                    Sales Manager
                  </strong>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Sales Manager Status:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.SalesManager.status || "Not available"}
                    </span>
                  </div>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Sales Manager Message:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.SalesManager.message || "No message"}
                    </span>
                  </div>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Sales Manager Name:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.SalesManager.managerid
                        ? editedOrder.SalesManager.managerid.name
                        : "N/A"}
                    </span>
                  </div>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Sales Manager Email:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.SalesManager.managerid
                        ? editedOrder.SalesManager.managerid.email
                        : "N/A"}
                    </span>
                  </div>
                </div>{" "}
                {/* Space between sections */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  {" "}
                  {/* Card style */}
                  <strong className="text-gray-800 dark:text-gray-200 text-2xl font-bold border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                    License Manager
                  </strong>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      License Manager Status:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.LicenseManager.status || "N/A"}
                    </span>
                  </div>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      License Manager Message:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.LicenseManager.message || "No message"}
                    </span>
                  </div>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      License Manager Name:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.LicenseManager.managerid
                        ? editedOrder.LicenseManager.managerid.name
                        : "N/A"}
                    </span>
                  </div>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      License Manager Email:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.LicenseManager.managerid
                        ? editedOrder.LicenseManager.managerid.email
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <strong className="text-gray-800 dark:text-gray-200 text-2xl font-bold border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                    Project Handler
                  </strong>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Project Handler Status:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.ProjectHandler.status || "N/A"}
                    </span>
                  </div>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Project Handler Message:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.ProjectHandler.message || "No message"}
                    </span>
                  </div>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Project Handler Name:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.ProjectHandler.managerid
                        ? editedOrder.ProjectHandler.managerid.name
                        : "N/A"}
                    </span>
                  </div>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Project Handler Email:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.ProjectHandler.managerid
                        ? editedOrder.ProjectHandler.managerid.email
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <strong className="text-gray-800 dark:text-gray-200 text-2xl font-bold border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                    Maintenance Manager
                  </strong>
                  <div className="mt-4">
                    {" "}
                    {/* Wrap everything in a single div for vertical stacking */}
                    <div className="flex">
                      <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                        Maintenance Manager Status:
                      </strong>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {editedOrder.MaintainaneceManager.status || "N/A"}
                      </span>
                    </div>
                    <div className="flex mt-2">
                      {" "}
                      {/* Add mt-2 for spacing between lines */}
                      <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                        Maintenance Manager Message:
                      </strong>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {editedOrder.MaintainaneceManager.message || "No message"}
                      </span>
                    </div>
                    <div className="flex mt-2">
                      <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                        Maintenance Manager Name:
                      </strong>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {editedOrder.MaintainaneceManager.managerid
                          ? editedOrder.MaintainaneceManager.managerid.name
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex mt-2">
                      <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                        Maintenance Manager Email:
                      </strong>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {editedOrder.MaintainaneceManager.managerid
                          ? editedOrder.MaintainaneceManager.managerid.email
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <strong className="text-gray-800 dark:text-gray-200 text-2xl font-bold border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                    Store Manager
                  </strong>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Store Manager Status:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.StoreManager.status || "N/A"}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Store Manager Message:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.StoreManager.message || "No message"}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Store Manager Name:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.StoreManager.managerid
                        ? editedOrder.StoreManager.managerid.name
                        : "N/A"}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Store Manager Email:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.StoreManager.managerid
                        ? editedOrder.StoreManager.managerid.email
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <strong className="text-gray-800 dark:text-gray-200 text-2xl font-bold border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                    Designer
                  </strong>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Designer Status:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.Designer.status || "N/A"}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Designer Message:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.Designer.message || "No message"}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Designer Name:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.Designer.managerid
                        ? editedOrder.Designer.managerid.name
                        : "N/A"}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      Designer Email:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.Designer.managerid
                        ? editedOrder.Designer.managerid.email
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <strong className="text-gray-800 dark:text-gray-200 text-2xl font-bold border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                    State Manager
                  </strong>
                  <div className="mt-4 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      State Manager Status:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.StateManager.status || "N/A"}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      State Manager Message:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.StateManager.message || "No message"}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      State Manager Name:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.StateManager.managerid
                        ? editedOrder.StateManager.managerid.name
                        : "N/A"}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    <strong className="text-gray-700 dark:text-gray-300 w-1/2">
                      State Manager Email:
                    </strong>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {editedOrder.StateManager.managerid
                        ? editedOrder.StateManager.managerid.email
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div>
                </div>

                <div className="rounded-lg  dark:bg-boxdark transition-all duration-300 mb-4 ">
                  <strong className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Design Plan:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "designPlan")}
                          className={`mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isUploading.designPlan ? 'opacity-50' : ''}`}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                          disabled={isUploading.designPlan} // Disable input while uploading
                        />
                        {isUploading.designPlan && (
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
                        {previewURL10 && (
                          <div className="mt-4">
                            <p className="text-gray-500">Uploaded File Preview:</p>
                            {previewURL10.endsWith('.pdf') ? (
                              <iframe
                                src={previewURL10}
                                title="PDF Preview"
                                className="w-36 h-36 border" // Width and height set to 150px (1 rem = 4px, so 36 is 144px)
                              />
                            ) : (
                              <img
                                src={previewURL10}
                                alt="Uploaded Preview"
                                className="mt-2 w-36 h-36 object-cover rounded" // Width and height set to 150px
                              />
                            )}
                          </div>
                        )}

                      </>
                    ) : (
                      <>
                        {editedOrder?.designPlan ? (
                          <DocumentCarousel
                            documents={[editedOrder.designPlan]}
                            label="Design Plan"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">
                            No Design Plan
                          </p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                <div className="rounded-lg dark:bg-boxdark transition-all duration-300 mb-4">
                  <strong className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Site Survey Form Attachment:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange1(e, "siteSurveyFormAttachment")}
                          className={`mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isUploading.siteSurveyFormAttachment ? 'opacity-50' : ''}`}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                          disabled={isUploading.siteSurveyFormAttachment}
                          multiple // Allow multiple file uploads
                        />
                        {isUploading.siteSurveyFormAttachment && (
                          <div className="mt-2">
                            <p className="text-gray-500">Uploading: {Math.round(uploadProgress.siteSurveyFormAttachment)}%</p>
                            <div className="bg-gray-200 h-2 rounded">
                              <div
                                className="bg-blue-500 h-full rounded"
                                style={{ width: `${uploadProgress.siteSurveyFormAttachment}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {previewURLs11.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            {previewURLs11.map((url, index) => (
                              <div key={index}>
                                {url.endsWith('.pdf') ? (
                                  <iframe
                                    src={url}
                                    title={`PDF Preview ${index}`}
                                    className="w-36 h-36 border"
                                  />
                                ) : (
                                  <img
                                    src={url}
                                    alt={`Uploaded Preview ${index}`}
                                    className="w-36 h-36 object-cover rounded"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {editedOrder?.siteSurveyFormAttachment?.length > 0 ? (
                          <DocumentCarousel
                            documents={editedOrder.siteSurveyFormAttachment}
                            label="Site Survey Form Attachments"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">No Site Survey Form Attachments</p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Application Form:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "applicationForm")}
                          className={`mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isUploading.applicationForm ? 'opacity-50' : ''}`}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                          disabled={isUploading.applicationForm} // Disable input while uploading
                        />
                        {isUploading.applicationForm && (
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
                        {previewURL9 && (
                          <div className="mt-4">
                            <p className="text-gray-500">Uploaded File Preview:</p>
                            {previewURL9.endsWith('.pdf') ? (
                              <iframe
                                src={previewURL9}
                                title="PDF Preview"
                                className="w-36 h-36 border" // Width and height set to 150px (1 rem = 4px, so 36 is 144px)
                              />
                            ) : (
                              <img
                                src={previewURL9}
                                alt="Uploaded Preview"
                                className="mt-2 w-36 h-36 object-cover rounded" // Width and height set to 150px
                              />
                            )}
                          </div>
                        )}

                      </>
                    ) : (
                      <>
                        {editedOrder?.applicationForm ? (
                          <DocumentCarousel
                            documents={[editedOrder.applicationForm]}
                            label="Application Form"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">
                            No Application Form
                          </p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {/* Lightbill Section */}
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Lightbill:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "lightbill")}
                          className={`mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isUploading.lightbill ? 'opacity-50' : ''}`}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                          disabled={isUploading.lightbill} // Disable input while uploading
                        />
                        {isUploading.lightbill && (
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
                        {previewURL11 && (
                          <div className="mt-4">
                            <p className="text-gray-500">Uploaded File Preview:</p>
                            {previewURL11.endsWith('.pdf') ? (
                              <iframe
                                src={previewURL11}
                                title="PDF Preview"
                                className="w-36 h-36 border" // Width and height set to 150px (1 rem = 4px, so 36 is 144px)
                              />
                            ) : (
                              <img
                                src={previewURL11}
                                alt="Uploaded Preview"
                                className="mt-2 w-36 h-36 object-cover rounded" // Width and height set to 150px
                              />
                            )}
                          </div>
                        )}

                      </>
                    ) : (
                      <>
                        {editedOrder?.lightbill ? (
                          <DocumentCarousel
                            documents={[editedOrder.lightbill]}
                            label="Application Form"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">
                            No Lightbill
                          </p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {/*Material Delivery Photos:*/}
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Material Delivery Photos:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "materialDeliveryPhotos")}
                          className={`mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isUploading.materialDeliveryPhotos ? 'opacity-50' : ''}`}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                          disabled={isUploading.materialDeliveryPhotos} // Disable input while uploading
                        />
                        {isUploading.materialDeliveryPhotos && (
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
                        {previewURL8 && (
                          <div className="mt-4">
                            <p className="text-gray-500">Uploaded File Preview:</p>
                            {previewURL8.endsWith('.pdf') ? (
                              <iframe
                                src={previewURL8}
                                title="PDF Preview"
                                className="w-36 h-36 border" // Width and height set to 150px (1 rem = 4px, so 36 is 144px)
                              />
                            ) : (
                              <img
                                src={previewURL8}
                                alt="Uploaded Preview"
                                className="mt-2 w-36 h-36 object-cover rounded" // Width and height set to 150px
                              />
                            )}
                          </div>
                        )}

                      </>
                    ) : (
                      <>
                        {editedOrder?.materialDeliveryPhotos ? (
                          <DocumentCarousel
                            documents={[editedOrder.materialDeliveryPhotos]}
                            label="Material DeliveryPhotos"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">
                            No Material DeliveryPhotos
                          </p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {/* GEDA Documents Section */}
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    GEDA Documents:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange1(e, "GEDADocuments")}
                          className={`mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isUploading.GEDADocuments ? 'opacity-50' : ''}`}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                          disabled={isUploading.GEDADocuments}
                          multiple // Allow multiple file uploads
                        />
                        {isUploading.GEDADocuments && (
                          <div className="mt-2">
                            <p className="text-gray-500">Uploading: {Math.round(uploadProgress.GEDADocuments)}%</p>
                            <div className="bg-gray-200 h-2 rounded">
                              <div
                                className="bg-blue-500 h-full rounded"
                                style={{ width: `${uploadProgress.GEDADocuments}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {previewURLs12.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            {previewURLs12.map((url, index) => (
                              <div key={index}>
                                {url.endsWith('.pdf') ? (
                                  <iframe
                                    src={url}
                                    title={`PDF Preview ${index}`}
                                    className="w-36 h-36 border"
                                  />
                                ) : (
                                  <img
                                    src={url}
                                    alt={`Uploaded Preview ${index}`}
                                    className="w-36 h-36 object-cover rounded"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {editedOrder?.GEDADocuments?.length > 0 ? (
                          <DocumentCarousel
                            documents={editedOrder.GEDADocuments}
                            label="GEDA Documents"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">No GEDA Documents</p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {/*Terrace Images:*/}
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Terrace Images:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <input
                        type="file"
                        id="images"
                        name="images"
                        className="mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        multiple
                        onChange={handleChange}
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                      />
                    ) : (
                      <>
                        {Array.isArray(order?.images) &&
                          editedOrder.images.length > 0 ? (
                          <DocumentCarousel
                            documents={editedOrder.images}
                            label="Terrace Images"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">No Images</p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {/*CIG Letter:*/}
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    CIG Letter:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, "CIGletter")}
                        className="mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                      />
                    ) : (
                      <>
                        {Array.isArray(order?.CIGletter) &&
                          editedOrder.CIGletter.length > 0 ? (
                          <DocumentCarousel
                            documents={editedOrder.CIGletter}
                            label="CIG Letter"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">No CIG Letter</p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {/*Site Documents :*/}
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Site Documents:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange1(e, "SiteDocuments")}
                          className={`mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isUploading.SiteDocuments ? 'opacity-50' : ''}`}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                          disabled={isUploading.SiteDocuments}
                          multiple // Allow multiple file uploads
                        />
                        {isUploading.SiteDocuments && (
                          <div className="mt-2">
                            <p className="text-gray-500">Uploading: {Math.round(uploadProgress.SiteDocuments)}%</p>
                            <div className="bg-gray-200 h-2 rounded">
                              <div
                                className="bg-blue-500 h-full rounded"
                                style={{ width: `${uploadProgress.SiteDocuments}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {previewURLs13.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            {previewURLs13.map((url, index) => (
                              <div key={index}>
                                {url.endsWith('.pdf') ? (
                                  <iframe
                                    src={url}
                                    title={`PDF Preview ${index}`}
                                    className="w-36 h-36 border"
                                  />
                                ) : (
                                  <img
                                    src={url}
                                    alt={`Uploaded Preview ${index}`}
                                    className="w-36 h-36 object-cover rounded"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {editedOrder?.SiteDocuments?.length > 0 ? (
                          <DocumentCarousel
                            documents={editedOrder.SiteDocuments}
                            label="Site Documents"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">No Site Documents</p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {/*Quotation Attachment 1: */}
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Quotation Attachment :
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "quotationAttachment1")}
                          className={`mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isUploading.quotationAttachment1 ? 'opacity-50' : ''}`}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                          disabled={isUploading.quotationAttachment1} // Disable input while uploading
                        />
                        {isUploading.quotationAttachment1 && (
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
                        {previewURL && (
                          <div className="mt-4">
                            <p className="text-gray-500">Uploaded File Preview:</p>
                            {previewURL.endsWith('.pdf') ? (
                              <iframe
                                src={previewURL}
                                title="PDF Preview"
                                className="w-36 h-36 border" // Width and height set to 150px (1 rem = 4px, so 36 is 144px)
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

                      </>
                    ) : (
                      <>
                        {editedOrder?.quotationAttachment1 ? (
                          <DocumentCarousel
                            documents={[editedOrder.quotationAttachment1]}
                            label="Quotation Attachment 1"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">
                            No Quotation Attachments
                          </p>
                        )}
                      </>
                    )}
                  </span>
                </div>

                {/*Delivery Challan: */}
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Delivery Challan:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, "deliveryChallan")}
                        className="mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                      />
                    ) : (
                      <>
                        {Array.isArray(order?.deliveryChallan) &&
                          editedOrder.deliveryChallan.length > 0 ? (
                          <DocumentCarousel
                            documents={editedOrder.deliveryChallan}
                            label="Delivery Challan"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">
                            No Delivery Challan
                          </p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {/* Payment Confirmation Section */}
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Payment Confirmation:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "paymentConfirmation")}
                          className={`mt-2 w-full p-2 dark:bg-boxdark border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isUploading.paymentConfirmation ? 'opacity-50' : ''}`}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                          disabled={isUploading.paymentConfirmation} // Disable input while uploading
                        />
                        {isUploading.paymentConfirmation && (
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
                        {previewURL6 && (
                          <div className="mt-4">
                            <p className="text-gray-500">Uploaded File Preview:</p>
                            {previewURL6.endsWith('.pdf') ? (
                              <iframe
                                src={previewURL6}
                                title="PDF Preview"
                                className="w-36 h-36 border" // Width and height set to 150px (1 rem = 4px, so 36 is 144px)
                              />
                            ) : (
                              <img
                                src={previewURL6}
                                alt="Uploaded Preview"
                                className="mt-2 w-36 h-36 object-cover rounded" // Width and height set to 150px
                              />
                            )}
                          </div>
                        )}

                      </>
                    ) : (
                      <>
                        {editedOrder?.paymentConfirmation ? (
                          <DocumentCarousel
                            documents={[editedOrder.paymentConfirmation]}
                            label="Payment Confirmation"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">
                            No Payment Confirmation
                          </p>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {/* Billing Document Section */}
                <div className="mb-4 dark:bg-boxdark">
                  <strong className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Sign Document:
                  </strong>
                  <span className="block mt-2">
                    {isEditing ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "signDocuments")}
                          className={`mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isUploading.signDocuments ? 'opacity-50' : ''}`}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                          disabled={isUploading.signDocuments} // Disable input while uploading
                        />
                        {isUploading.signDocuments && (
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
                        {previewURL7 && (
                          <div className="mt-4">
                            <p className="text-gray-500">Uploaded File Preview:</p>
                            {previewURL7.endsWith('.pdf') ? (
                              <iframe
                                src={previewURL7}
                                title="PDF Preview"
                                className="w-36 h-36 border" // Width and height set to 150px (1 rem = 4px, so 36 is 144px)
                              />
                            ) : (
                              <img
                                src={previewURL7}
                                alt="Uploaded Preview"
                                className="mt-2 w-36 h-36 object-cover rounded" // Width and height set to 150px
                              />
                            )}
                          </div>
                        )}

                      </>
                    ) : (
                      <>
                        {editedOrder?.signDocuments ? (
                          <DocumentCarousel
                            documents={[editedOrder.signDocuments]}
                            label="Sign Documents"
                          />
                        ) : (
                          <p className="text-gray-500 mt-2">
                            No Sign Documents
                          </p>
                        )}
                      </>
                    )}
                  </span>
                </div>


              </div>
            </div>
          </div>

          {showModal1 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-boxdark p-6 rounded-lg max-w-3xl w-full ml-65 mt-24">
                <h2 className="text-xl font-semibold mb-4">Materials List</h2>

                {/* Table of Materials */}
                <div className="overflow-x-auto">
                  {formdata.billOfMaterials.length === 0 ? (
                    <p>No materials added yet.</p>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-darkinput">
                        <thead>
                          <tr className="bg-gray-200 dark:bg-darksecondary">
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
                              Price Per Unit
                            </th>
                            <th className="border border-gray-300 p-2 text-left dark:border-darkinput">
                              Delete
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formdata.billOfMaterials.map((item, index) => (
                            <tr
                              key={index}
                              className="bg-white dark:bg-boxdark"
                            >
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
                                {item.quantity}
                              </td>
                              <td className="border border-gray-300 p-2 dark:border-darkinput">
                                {item.PricePerUnit}
                              </td>
                              <td className="border border-gray-300 p-2 dark:border-darkinput bg-red-500 text-white">
                                <td>
                                  <button onClick={() => removeMaterial(index)}>
                                    Delete
                                  </button>
                                </td>
                              </td>
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

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-darkinput p-6 rounded-lg max-w-xl w-full mt-24 ml-65">
                <h2 className="text-xl mb-4">Add New Material</h2>

                {/* New Material Input Form */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <input
                    type="text"
                    value={newMaterial.CategoryName}
                    onChange={(e) =>
                      handleNewMaterialChange("CategoryName", e.target.value)
                    }
                    placeholder="Category Name"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                  <input
                    type="text"
                    value={newMaterial.Material}
                    onChange={(e) =>
                      handleNewMaterialChange("Material", e.target.value)
                    }
                    placeholder="Material Name"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                  <input
                    type="text"
                    value={newMaterial.Brand}
                    onChange={(e) =>
                      handleNewMaterialChange("Brand", e.target.value)
                    }
                    placeholder="Brand Name"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                  <input
                    type="text"
                    value={newMaterial.Unit}
                    onChange={(e) =>
                      handleNewMaterialChange("Unit", e.target.value)
                    }
                    placeholder="Enter Unit"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                  <input
                    type="number"
                    value={newMaterial.quantity}
                    onChange={(e) =>
                      handleNewMaterialChange("quantity", e.target.value)
                    }
                    placeholder="Quantity"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                  <input
                    type="number"
                    value={newMaterial.PricePerUnit}
                    onChange={(e) =>
                      handleNewMaterialChange("PricePerUnit", e.target.value)
                    }
                    placeholder="PricePerUnit"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
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

          {showOutwardListModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
              <div className="bg-white dark:bg-darkinput p-6 rounded-lg max-w-3xl w-full dark:bg-boxdark ml-65 mt-24">
                <h2 className="text-xl font-semibold mb-4">Outward List</h2>

                <div className="overflow-x-auto">
                  {FormData1?.materialOutvertEntry.length === 0 ? (
                    <p>No outward items added yet.</p>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-darkinput">
                        <thead>
                          <tr className="bg-gray-200 dark:bg-darksecondary">
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
                              Quantity Outward
                            </th>
                            <th className="border border-gray-300 p-2 text-left dark:border-darkinput">
                              Price Per Unit
                            </th>
                            <th className="border border-gray-300 p-2 text-left dark:border-darkinput">
                              Delete
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {FormData1.materialOutvertEntry.map((item, index) => (
                            <tr
                              key={index}
                              className="bg-white dark:bg-boxdark"
                            >
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
                                {item.PricePerUnit}
                              </td>
                              <td className="border border-gray-300 p-2 dark:border-darkinput bg-red-500 text-white">
                                <td>
                                  <button
                                    onClick={() => removeMaterialout(index)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </td>
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
                  onClick={toggleOutwardListModal}
                  className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {showOutwardModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white dark:bg-darkinput p-6 rounded-lg max-w-xl w-full dark:bg-boxdark ml-65 mt-24">
                <h2 className="text-xl mb-4">Add New Outward</h2>

                {/* New Outward Input Form */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <input
                    type="text"
                    value={newOutward.CategoryName}
                    onChange={(e) =>
                      handleNewOutwardChange("CategoryName", e.target.value)
                    }
                    placeholder="Category Name"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                  <input
                    type="text"
                    value={newOutward.Material}
                    onChange={(e) =>
                      handleNewOutwardChange("Material", e.target.value)
                    }
                    placeholder="Material Name"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                  <input
                    type="text"
                    value={newOutward.Brand}
                    onChange={(e) =>
                      handleNewOutwardChange("Brand", e.target.value)
                    }
                    placeholder="Brand Name"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                  <input
                    type="text"
                    value={newOutward.Unit}
                    onChange={(e) =>
                      handleNewOutwardChange("Unit", e.target.value)
                    }
                    placeholder="Enter Unit"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                  <input
                    type="number"
                    value={newOutward.quantityOutward}
                    onChange={(e) =>
                      handleNewOutwardChange("quantityOutward", e.target.value)
                    }
                    placeholder="Quantity Outward"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                  <input
                    type="number"
                    value={newOutward.PricePerUnit}
                    onChange={(e) =>
                      handleNewOutwardChange("PricePerUnit", e.target.value)
                    }
                    placeholder="Price Per Unit"
                    className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke  p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                  />
                </div>

                {/* Add Outward Button */}
                <button
                  type="button"
                  onClick={saveNewOutward}
                  className="mt-4 w-full bg-green-500 text-white p-2 rounded-lg"
                >
                  Add Outward
                </button>

                {/* Close Modal Button */}
                <button
                  type="button"
                  onClick={closeOutwardModal}
                  className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* <div className=" p-4  dark:bg-boxdark ">
            <strong className="text-gray-700">Client Remarks:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="clientRemarks"
                value={editedOrder.clientRemarks}
                onChange={handleChange}
                className="ml-2 border rounded p-1"
              />
            ) : (
              <span>{editedOrder.clientRemarks || "No remarks"}</span>
            )}
          </div> */}
          {/* Design Plan Section */}

          {/* Site Survey Form Attachment Section */}

          {/* Application Form Section */}

          {isEditing && (
            <button type="submit" className="btn-primary py-2 px-5">
              {orderLoading ? 'Loading...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
      {/* {editedOrder.images && editedOrder.images.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold text-black  mb-3">Customer Order Images</h2>
                    <div className="flex overflow-x-auto gap-4">
                        {editedOrder.images.map((image, index) => (
                            <img key={index} src={image} alt="Order" className="w-64 h-64 object-cover" />
                        ))}
                    </div>
                </div>
            )} */}
    </div>
  );
};

export default OrderDetails;

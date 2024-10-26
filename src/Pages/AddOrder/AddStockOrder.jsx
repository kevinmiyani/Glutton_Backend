/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Stock } from "../../api/call.js";
import FileUpload from "../../components/FileUpload.jsx";
import { ToastContainer, toast } from "react-toastify";
import MaterialStokeOrder from "../Screens/MaterialStockOrder.jsx";
import { storage } from "../../api/firebaseconfig.js";
import logo from "../../images/logo/logo.jpeg";
import "jspdf-autotable";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const AddStockOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfRef = useRef();

  const order = location.state?.order || {};
  const [open, setopen] = useState(false);
  const [catname, setcatname] = useState('');
  const [itemname, setitemname] = useState('');
  const [selectcategory, setselectcategory] = useState('')
  const [formData, setFormData] = useState({
    clientDetails: "",
    remarks: "",
    expectedDeliveryTime: "",
    deliveryDate: "",
    materialDeliveryPhotos: [],
    clientName: "",
    clientEmail: "",
    deliveryChallan: [],
    deliveryChallans: [],
    material: [],
    Status: "",
    query: "",
    contactNumber: "",
    LicenseManagerStatus: "",
    clientAddress: "",
    LicenseManagerMessage: "",
    MaintainaneceManagerStatus: "",
    MaintainaneceManagerMessage: "",
    DesignerStatus: "",
    DesignerMessage: "",
    AccountsStatus: "",
    AccountsMessage: "",
    CustomerStatus: "",
    CustomerMessage: "",
    SalesManagerStatus: "",
    SalesManagerMessage: "",
    ProjectHandlerStatus: "",
    ProjectHandlerMessage: "",
    billOfMaterials: [],
    materialOutvertEntry: [],
    orderNumber: "",
    clientLatitude: "",
    clientLongitude: "",
  });
  const [uploadProgress, setUploadProgress] = useState({
    materialDeliveryPhotos: [],
    deliveryChallan: [],
  });
  const [uploading, setUploading] = useState({});
  const [categories, setCategories] = useState([]);
  const [materials, setNewMaterials] = useState([]);
  const [items, setNewItem] = useState([]);
  const [material, setMaterial] = useState([]);
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const material = await Stock.getAllCategory(); // API call to fetch categories
        console.log("API Response:", material);

        // Check if the response contains the expected structure
        if (material && material.data && Array.isArray(material.data.data)) {
          const categoriesData = material.data.data.map(category => ({
            id: category._id,   // Assuming 'id' exists in the category object
            name: category.name // Assuming 'name' exists in the category object
          }));

          // Set categories state with an array of objects containing id and name
          setCategories(categoriesData);
        } else {
          console.error("Unexpected API response structure:", material);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };


    fetchCategories();
  }, []);
  useEffect(() => {
    if (order) {
      setFormData({
        clientDetails: order.clientDetails ? order.clientDetails : "",
        clientName: order._id
          ? order.orderBy === "Customer"
            ? order.userid.name
            : order.clientName
          : "",
        clientEmail: order._id
          ? order.orderBy === "Customer"
            ? order.userid.email
            : order.clientEmail
          : "",
        remarks: order.remarks ? order.remarks : "",
        expectedDeliveryTime: order.expectedDeliveryTime
          ? order.expectedDeliveryTime
          : "",
        deliveryDate: order.deliveryDate
          ? new Date(order.deliveryDate).toISOString().split("T")[0]
          : "",
        materialDeliveryPhotos: order.materialDeliveryPhotos
          ? order.materialDeliveryPhotos
          : [],
        // materialOutwertEntry: order.materialOutwertEntry ? order.materialOutwertEntry : [{ CategoryName: "", quantity: "", Material: "", Brand: "", Unit: "", PricePerUnit: "" }],
        deliveryChallans: order.deliveryChallan ? order.deliveryChallan : [],
        material: order.material ? order.material : [],
        Status: order.StoreManager.status ? order.StoreManager.status : "",
        query: order.StoreManager.message ? order.StoreManager.message : "",
        contactNumber: order.contactNumber ? order.contactNumber : "",
        clientAddress: order._id
          ? order.orderBy === "Customer"
            ? order.userid.fulladdress
            : order.clientAddress
          : "",
        LicenseManagerStatus: order.LicenseManager.status,
        LicenseManagerMessage: order.LicenseManager.message,
        SalesManagerStatus: order.SalesManager.status,
        SalesManagerMessage: order.SalesManager.message,
        MaintainaneceManagerStatus: order.MaintainaneceManager.status,
        MaintainaneceManagerMessage: order.MaintainaneceManager.message,
        DesignerStatus: order.Designer.status,
        DesignerMessage: order.Designer.message,
        AccountsStatus: order.Accounts.status,
        AccountsMessage: order.Accounts.message,
        CustomerStatus: order.Customer.status,
        CustomerMessage: order.Customer.message,
        ProjectHandlerStatus: order.ProjectHandler.status,
        ProjectHandlerMessage: order.ProjectHandler.message,
        billOfMaterials: order?.billOfMaterials ? order?.billOfMaterials : [],
        materialOutvertEntry: order?.materialOutvertEntry
          ? order?.materialOutvertEntry
          : [],
        orderNumber: order.orderNumber ? order.orderNumber : "",
        clientLongitude: order.clientLongitude ? order.clientLongitude : "",
        clientLatitude: order.clientLatitude ? order.clientLatitude : "",
        deliveryChallan: [],
      });
    }
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await Stock.getAllMaterial();
        const allMaterials = response.data.data;

        console.log("Selected category ID:", catname);  // Log category ID
        const filteredMaterials = filterMaterialsByCategory(allMaterials, catname);

        // Check if the currently selected material exists in the newly filtered list
        const selectedMaterialExists = filteredMaterials.find(
          (mat) => mat.name === newOutward.Material
        );

        // If the previously selected material doesn't exist in the new filtered list, reset the material selection
        if (!selectedMaterialExists) {
          setNewOutward((prevState) => ({ ...prevState, Material: '' }));
          setNewItem((prevState) => ({ ...prevState, itemname: '' }));
        }

        setNewMaterials(filteredMaterials); // Update state with the filtered materials
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    if (catname) {
      setNewMaterials([]); // Clear materials first when selecting a new category
      fetchMaterials(); // Call fetchMaterials only if a category is selected
    }
  }, [catname]);
 
  useEffect(() => {
    const fetchitems = async () => {
      try {
        const response = await Stock.getAllItems();
        const allitems = response.data.data;

        console.log("Selected category ID:", itemname);  // Log category ID (itemname is used as the category ID here)
        const filteredItems = filteritemsByCategory(allitems, itemname);

        // Check if the currently selected item exists in the newly filtered list
        const selectedItemExists = filteredItems.find(
          (item) => item.name === newOutward.Item
        );

        // If the previously selected item doesn't exist in the new filtered list, reset the item selection
        // if (!selectedItemExists) {
        //   setNewOutward((prevState) => ({ ...prevState, Item: '' }));
        // }

        setNewItem(filteredItems); // Update state with the filtered items
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    if (itemname) {
      setNewItem([]); // Clear items first when selecting a new category
      fetchitems(); // Fetch items only if a category is selected
    }
  }, [itemname]);


  const filterMaterialsByCategory = (materials, categoryId) => {
    return materials.filter(material => material.categoryId._id === categoryId)
      .map(material => ({
        id: material._id,
        name: material.name,
        categoryId: material.categoryId._id,
      }));
  };



  const filteritemsByCategory = (items, itemname) => {
    return items
      .filter(item => {
        console.log("Checking item:", item.materialId._id, itemname); // Debug each item
        // console.log("itemname========+++++===", itemname)
        return item.materialId._id === itemname; // Filter by categoryId
      })
  };


  const handleCategoryChange = (e) => {
    const selectedName = e.target.value;
    const selectedCategory = categories.find(category => category.name === selectedName);

    if (selectedCategory) {
      setNewOutward({ ...newOutward, CategoryName: selectedCategory.name });
      setcatname(selectedCategory.id);
    }
  };

  const formatDateForInput = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFileUpload = (file, fieldName, index = null) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (fieldName === "materialDeliveryPhotos") {
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
        } else if (fieldName === "deliveryChallan") {
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
          setUploading((prev) => ({
            ...prev,
            [fieldName]: true,
          }));
        }
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
        if (fieldName === "materialDeliveryPhotos") {
          setFormData((prevFormData) => {
            const newDocuments = [...prevFormData.materialDeliveryPhotos];
            newDocuments[index] = downloadURL;
            return {
              ...prevFormData,
              [fieldName]: newDocuments,
            };
          });
        } else if (fieldName === "deliveryChallan") {
          setFormData((prevFormData) => {
            const newDocuments = [...prevFormData.deliveryChallan];
            newDocuments[index] = downloadURL;
            return {
              ...prevFormData,
              [fieldName]: newDocuments,
            };
          });
          setFormData({
            ...formData,
            deliveryChallans: [...formData.deliveryChallans, downloadURL],
          });
        } else {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: downloadURL,
          }));
        }
        setUploading((prev) => ({
          ...prev,
          [fieldName]: false,
        }));
        if (fieldName === "materialDeliveryPhotos") {
          setUploadProgress((prev) => {
            const newProgress = [...prev[fieldName]];
            newProgress[index] = 0;
            return {
              ...prev,
              [fieldName]: newProgress,
            };
          });
        } else if (fieldName === "deliveryChallan") {
          setUploadProgress((prev) => {
            const newProgress = [...prev[fieldName]];
            newProgress[index] = 0;
            return {
              ...prev,
              [fieldName]: newProgress,
            };
          });
        } else {
          setUploadProgress((prev) => ({
            ...prev,
            [fieldName]: 0,
          }));
        }
        toast.success("File uploaded successfully");
      }
    );
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      if (name === "materialDeliveryPhotos") {
        const filesArray = Array.from(files);
        filesArray.forEach((file, index) => {
          handleFileUpload(file, name, index);
        });
      } else if (name === "deliveryChallan") {
        const filesArray = Array.from(files);
        filesArray.forEach((file, index) => {
          handleFileUpload(file, name, index);
        });
      } else {
        handleFileUpload(files[0], name);
      }
    } else {
      if (name === "expectedDeliveryTime") {
        const timeString = value.toString();
        console.log("Expected Delivery Time:", timeString);

        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: timeString,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const StockManagerdata = {
        orderId: order._id,
        status: formData.Status,
        message: formData.query,
        data: { ...formData, deliveryChallan: formData.deliveryChallans },
      };
      const response = await Stock.verifyStoke(StockManagerdata);
      if (response && (response.status === 201 || response.status === 200)) {
        toast.success("Update Order Successfully");

        setTimeout(() => {
          navigate("/orders");
        }, 1000);
      } else {
        toast.error("Failed to Update Order. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showOutwardModal, setShowOutwardModal] = useState(false);
  const [showOutwardListModal, setShowOutwardListModal] = useState(false);

  const [newMaterial, setNewMaterial] = useState({
    CategoryName: "",
    Material: "",
    Brand: "",
    Unit: "",
    quantity: "",
    PricePerUnit: "",
    itemname: ""
  });

  const [newOutward, setNewOutward] = useState({
    CategoryName: "",
    Material: "",
    Brand: "",
    Unit: "",
    quantityOutward: "",
    PricePerUnit: "",
    itemname: ""
  });

  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // Opens modal on button click
  const addMaterial = () => {
    setShowModal(true);
  };
  const addOutward = () => {
    setShowOutwardModal(true);
  };
  // console.log(c);

  // Closes modal
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
  const toggleModal = () => {
    setShowModal1(!showModal1);
  };
  const toggleOutwardListModal = () => {
    setShowOutwardListModal(!showOutwardListModal);
  };

  // Handles changes in the new material input fields
  const handleNewMaterialChange = (field, value) => {
    setNewMaterial({ ...newMaterial, [field]: value });
  };

  const handleNewOutwardChange = (field, value) => {
    // Update the newOutward state with the field and its value
    setNewOutward({ ...newOutward, [field]: value });

    // Assuming value is an object with an 'id' property and you need to store the id
    if (field === "category") {
      setselectcategory(value);  // Store the category ID in selectcategory state
    }

    // Log the
  };

  console.log(catname);
  console.log(materials);


  // Adds a new material to the list and stores it
  const saveNewMaterial = () => {
    if (newMaterial.CategoryName && newMaterial.Material && newMaterial.Brand) {
      setFormData({
        ...formData,
        billOfMaterials: [...formData.billOfMaterials, newMaterial],
      });
      closeModal(); // Close modal after adding new material
    } else {
      alert("Please fill in all required fields"); // Simple validation
    }
  };

  const saveNewOutward = async () => {
    const { CategoryName, Material, Brand, quantityOutward, itemname } = newOutward;
    console.log("newOutward", newOutward);

    if (CategoryName && Material && Brand && quantityOutward) {
      // Prepare the request body for the API call
      const stockCheckData = {
        materialName: Material,
        brand: Brand,
        quantity: quantityOutward,
        itemname: itemname,
      };

      console.log("stockCheckData++++++++++++", stockCheckData)
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
            setFormData({
              ...formData,
              materialOutvertEntry: [
                ...formData.materialOutvertEntry,
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

  // Remove a material
  const removeMaterial = (index) => {
    const updatedMaterials = formData.billOfMaterials.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, billOfMaterials: updatedMaterials });
  };
  const removeMaterialout = (index) => {
    const updatedMaterialsout = formData.materialOutvertEntry.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, materialOutvertEntry: updatedMaterialsout });
  };

  const [isOpen, setIsOpen] = useState(false);

  // Function to handle button click
  const toggleContent = () => {
    setIsOpen(!isOpen); // Toggle the state
  };
  const currentDate = new Date().toLocaleDateString();
  const [challan, setChallan] = useState("");

  const generateChallan = () => {
    const staticPrefix = "HY";
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Current month (1-12)
    const totalBilled = formData.deliveryChallans.length + 1;
    const challanNumber = String(totalBilled).padStart(4, "0"); // Ensure it's 5 digits

    const newChallan = `${staticPrefix}/${month}/${challanNumber}`;
    return newChallan;
    // setChallan(newChallan);
  };

  const getTotalBilledForMonth = (month) => {
    // Replace this with your logic to get total billed for the month
    // This is just a placeholder function that returns a static number for demonstration
    const monthTotals = {
      "01": 12345,
      "02": 23456,
      "03": 34567,
      "04": 45678,
      "05": 56789,
      "06": 67890,
      "07": 78901,
      "08": 89012,
      "09": 90123,
      10: 12334,
      11: 23445,
      12: 34556,
    };
    return monthTotals[month] || 0;
  };

  const downloadPDF = async (event) => {
    event.preventDefault(); // Prevent form submission
    console.log("adwexs");
    const challanNo = await generateChallan();
    const input = pdfRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("delivery-challan.pdf");
    });
  };
  const toggleSeen = () => {
    console.log("hello");
    console.log(open);

    setopen(!open);
  };
  const timechange = (e) => {
    const { name, value, files } = e.target;

    if (name === "expectedDeliveryTime") {
      // Split the time value into hours and minutes
      const [hours, minutes] = value.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;

      console.log(`Total minutes: ${totalMinutes}`);

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value, // Save the time value
        totalMinutes: totalMinutes, // Save the total minutes in formData (if needed)
      }));
    } else if (files) {
      handleFileUpload(files[0], name);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <ToastContainer />

      <div>
        <div className="flex flex-col gap-5">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b flex justify-between items-center border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Add Stock Order
              </h3>
              <Link to="/orders">
                <button className="flex items-center justify-center gap-1">
                  <FaArrowLeftLong />
                  <span>Go Back</span>
                </button>
              </Link>
            </div>
            <div className="w-full p-3">
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

            <div className="p-3">
              <span className="">
                {" "}
                Material Inward Entry<span className="text-red-500">*</span>
              </span>

              <div className="flex flex-col md:flex-row gap-6 mt-2">
                {/* Add Button */}
                <div>
                  <div className="flex gap-4">
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
                      className="mb-4 w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-secondary bg-secondary p-2 text-white dark:bg-darksecondary dark:border-darksecondary"
                    >
                      View Material
                    </button>
                  </div>

                  {/* Display the Added Materials */}
                  {showModal1 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white dark:bg-darkinput p-6 rounded-lg max-w-3xl w-full dark:bg-boxdark">
                        <h2 className="text-xl font-semibold mb-4 ">
                          Materials List
                        </h2>

                        <div className="overflow-x-auto">
                          {formData.billOfMaterials.length === 0 ? (
                            <p>No materials added yet.</p>
                          ) : (
                            <div className="max-h-64 overflow-y-auto">
                              {" "}
                              {/* Added vertical scroll container */}
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
                                  {formData.billOfMaterials.map(
                                    (item, index) => (
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
                                            <button
                                              onClick={() =>
                                                removeMaterial(index)
                                              }
                                            >
                                              Delete
                                            </button>
                                          </td>
                                        </td>
                                      </tr>
                                    )
                                  )}
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
                  <div className="bg-white  p-6 rounded-lg max-w-xl w-full dark:bg-boxdark ml-65 mt-24">
                    <h2 className="text-xl mb-4">Add New Material</h2>

                    {/* New Material Input Form */}
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                      <input
                        type="text"
                        value={newMaterial.CategoryName}
                        onChange={(e) =>
                          handleNewMaterialChange(
                            "CategoryName",
                            e.target.value
                          )
                        }
                        placeholder="Category Name"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                      <input
                        type="text"
                        value={newMaterial.Material}
                        onChange={(e) =>
                          handleNewMaterialChange("Material", e.target.value)
                        }
                        placeholder="Material Name"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                      <input
                        type="text"
                        value={newMaterial.Brand}
                        onChange={(e) =>
                          handleNewMaterialChange("Brand", e.target.value)
                        }
                        placeholder="Brand Name"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                      <input
                        type="text"
                        value={newMaterial.Unit}
                        onChange={(e) =>
                          handleNewMaterialChange("Unit", e.target.value)
                        }
                        placeholder="Enter Unit"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                      <input
                        type="number"
                        value={newMaterial.quantity}
                        onChange={(e) =>
                          handleNewMaterialChange("quantity", e.target.value)
                        }
                        placeholder="Quantity"
                        className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark"
                      />
                      <input
                        type="number"
                        value={newMaterial.PricePerUnit}
                        onChange={(e) =>
                          handleNewMaterialChange(
                            "PricePerUnit",
                            e.target.value
                          )
                        }
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

            <div className="p-3">
              <span className="mb-">
                Material Outward Entry<span className="text-red-500">*</span>
              </span>

              <div className="flex flex-col md:flex-row gap-6 mt-2">
                {/* Add Button */}
                <div>
                  <div className="flex gap-4">
                    {/* Add Outward Button */}
                    <button
                      type="button"
                      onClick={addOutward}
                      className="mb-4 w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-primary bg-primary p-2 text-white dark:bg-darkprimary dark:border-darkprimary"
                    >
                      + Add Outward
                    </button>

                    {/* View Outward Button */}
                    <button
                      type="button"
                      onClick={toggleOutwardListModal}
                      className="mb-4 w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-secondary bg-secondary p-2 text-white dark:bg-darksecondary dark:border-darksecondary"
                    >
                      View Outward
                    </button>
                  </div>

                  {/* Display the Added Outward Items */}
                  {showOutwardListModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
                      <div className="bg-white dark:bg-darkinput p-6 rounded-lg max-w-3xl w-full dark:bg-boxdark">
                        <h2 className="text-xl font-semibold mb-4">
                          Outward List
                        </h2>

                        <div className="overflow-x-auto">
                          {formData?.materialOutvertEntry.length === 0 ? (
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
                                      Item Name
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
                                      Delete
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {formData.materialOutvertEntry.map(
                                    (item, index) => (
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
                                          {item.itemname}
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
                                       
                                        <td className="border border-gray-300 p-2 dark:border-darkinput bg-red-500 text-white">
                                          <td>
                                            <button
                                              onClick={() =>
                                                removeMaterialout(index)
                                              }
                                            >
                                              Delete
                                            </button>
                                          </td>
                                        </td>
                                      </tr>
                                    )
                                  )}
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
                </div>
              </div>

              {/* Modal */}
              {showOutwardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white dark:bg-darkinput p-6 rounded-lg max-w-3xl w-full shadow-lg mt-12">

                    {/* Modal Header */}
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                      Add New Outward
                    </h2>

                    {/* Form Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                      {/* Category Select */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category
                        </label>
                        <select
                          value={newOutward.CategoryName}
                          onChange={handleCategoryChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-strokedark dark:bg-darkinput dark:text-white p-3 bg-white"
                        >
                          <option value="" disabled>
                            Select Category
                          </option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Material Select */}
                      {/* <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Material
                        </label>
                        <select
                          value={newOutward.Material}
                          onChange={(e) => setNewOutward({ ...newOutward, Material: e.target.value })}
                          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-strokedark dark:bg-darkinput dark:text-white p-3 bg-white"
                        >
                          <option value="" disabled>
                            Select Material
                          </option>
                          {materials.length > 0 ? (
                            materials.map((mat) => (
                              <option key={mat._id} value={mat.name}>
                                {mat.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No materials available
                            </option>
                          )}
                        </select>
                      </div> */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Material
                        </label>
                        <select
                          value={newOutward.Material}
                          onChange={(e) => {
                            const selectedMaterial = materials.find(mat => mat.name === e.target.value);
                            if (selectedMaterial) {
                              setNewOutward({ ...newOutward, Material: selectedMaterial.name });
                              setitemname(selectedMaterial.id); // Set the selected material's ID
                              console.log("Selected Material ID:", selectedMaterial.id); // Log the selected ID for confirmation
                            }
                          }}
                          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-strokedark dark:bg-darkinput dark:text-white p-3 bg-white"
                        >
                          <option value="" disabled>
                            Select Material
                          </option>
                          {materials.length > 0 ? (
                            materials.map((mat) => (
                              <option key={mat._id} value={mat.name}>
                                {mat.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No materials available
                            </option>
                          )}
                        </select>
                      </div>

                      {/* Item Select */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Item Name
                        </label>
                        <select
                          value={newOutward.itemname}
                          onChange={(e) => setNewOutward({ ...newOutward, itemname: e.target.value })}
                          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-strokedark dark:bg-darkinput dark:text-white p-3 bg-white"
                        >
                          <option value="" selected>
                            Select Items
                          </option>
                          {items.length > 0 ? (
                            items.map((mat) => (
                              <option key={mat.id} value={mat.itemname}>
                                {mat.itemname}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No Items available
                            </option>
                          )}
                        </select>
                      </div>
                      {/* Item Name Input */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Brand Name
                        </label>
                        <select
                          value={newOutward.Brand}
                          onChange={(e) => setNewOutward({ ...newOutward, Brand: e.target.value })}
                          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-strokedark dark:bg-darkinput dark:text-white p-3 bg-white"
                        >
                          <option value="" selected>
                            Select Brand
                          </option>
                          {items.length > 0 ? (
                            items.map((mat) => (
                              <option key={mat.id} value={mat.brand}>
                                {mat.brand}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No Brand available
                            </option>
                          )}
                        </select>
                      </div>

                      {/* Unit Input */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Unit
                        </label>
                        <input
                          type="text"
                          value={newOutward.Unit}
                          onChange={(e) => handleNewOutwardChange("Unit", e.target.value)}
                          placeholder="Unit"
                          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-strokedark dark:bg-darkinput dark:text-white p-3 bg-white"
                        />
                      </div>

                      {/* Quantity Outward Input */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quantity Outward
                        </label>
                        <input
                          type="number"
                          value={newOutward.quantityOutward}
                          onChange={(e) => handleNewOutwardChange("quantityOutward", e.target.value)}
                          placeholder="Quantity Outward"
                          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-strokedark dark:bg-darkinput dark:text-white p-3 bg-white"
                        />
                      </div>

                      {/* Price Per Unit Input */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Price Per Unit
                        </label>
                        <input
                          type="number"
                          value={newOutward.PricePerUnit}
                          onChange={(e) => handleNewOutwardChange("PricePerUnit", e.target.value)}
                          placeholder="Price Per Unit"
                          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-strokedark dark:bg-darkinput dark:text-white p-3 bg-white"
                        />
                      </div>
                    </div>

                    {/* Modal Buttons */}
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={saveNewOutward}
                        className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mr-2"
                      >
                        Add Outward
                      </button>
                      <button
                        type="button"
                        onClick={closeOutwardModal}
                        className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg ml-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                {/* Client Details */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Client Details
                  </label>
                  <div className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white">
                    <p>Name: {formData.clientName}</p>
                    <p>Email: {formData.clientEmail}</p>
                    <p>Phone: {formData.contactNumber}</p>
                    <p>Address: {formData.clientAddress}</p>
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

                {/* Remarks and Expected Delivery Time */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  {/* Remarks */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Remarks
                    </label>
                    <textarea
                      id="remarks"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                      placeholder="Enter any remarks"
                    ></textarea>
                  </div>

                  {/* Expected Delivery Time */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Expected Delivery Time
                    </label>
                    <input
                      type="time"
                      id="expectedDeliveryTime"
                      name="expectedDeliveryTime"
                      value={formData.expectedDeliveryTime}
                      onChange={timechange}
                      className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                      placeholder="Enter expected delivery time"
                    />
                  </div>
                </div>

                {/* Delivery Date and Delivery Challan */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  {/* Delivery Challan */}
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Material Delivery Photos
                    </label>

                    {formData.materialDeliveryPhotos.length > 0 ? (
                      <div className="mt-2">
                        {formData.materialDeliveryPhotos.map((item, index) => (
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
                      <div>
                        <input
                          type="file"
                          id="materialDeliveryPhotos"
                          name="materialDeliveryPhotos"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          onChange={handleChange}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                        />
                        {uploading.materialDeliveryPhotos &&
                          uploadProgress.materialDeliveryPhotos.map(
                            (progress, index) => (
                              <div
                                key={index}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              >
                                Uploading file {index + 1}: {progress}%
                              </div>
                            )
                          )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Material Delivery Photos */}

                <div className="mb-4.5">
                  {formData?.deliveryChallans?.length > 0 ? (
                    <div className="mt-2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Uploaded Delivery Challan
                        <span className="text-red-500">*</span>
                      </label>
                      {formData?.deliveryChallans?.map((item, index) => (
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
                  {/* {formData.deliveryChallans.length > 0 ? (
                    <div className="mt-2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Uploaded Delivery Challan (Document)
                      </label>
                      {formData.deliveryChallans.includes(".pdf") ? (
                        <embed
                          src={formData.deliveryChallans}
                          type="application/pdf"
                          width="100%"
                          height="500px"
                        />
                      ) : (
                        <img
                          src={formData.deliveryChallans}
                          alt="Preview"
                          className="max-w-50 h-auto"
                        />
                      )}
                    </div>
                  ) : (
                    <></>
                  )} */}
                </div>
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Delivery Challan
                  </label>
                  <input
                    type="file"
                    id="deliveryChallan"
                    name="deliveryChallan"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  />
                  {uploading.deliveryChallan && (
                    <div>Uploading: {uploadProgress.deliveryChallan}%</div>
                  )}
                </div>
                <button
                  type="button"
                  className="focus:outline-none mt-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={toggleSeen}
                >
                  Delivery Challan
                </button>

                {open && (
                  <div>
                    <div
                      ref={pdfRef}
                      className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 dark:bg-boxdark"
                    >
                      {/* Header Section */}
                      <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <div className="flex items-center space-x-4">
                          {/* Company Logo */}
                          <div>
                            <img
                              src={logo}
                              alt="Company Logo"
                              className="w-24 h-24"
                            />
                          </div>
                          <div>
                            <h1 className="text-lg font-bold">
                              HYSUN SOLAR PRIVATE LIMITED
                            </h1>
                            <p className="text-sm">
                              10, RadheKrishna Ind. Hub, B/H. Hinglaj Mata
                              Mandir, Vill., Ahmedabad, Ta.: Ahmedabad
                            </p>
                            <p className="text-sm mt-2">
                              M/S.: {formData.clientName}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p>
                            Date:{" "}
                            <span className="font-bold">{currentDate}</span>
                          </p>
                          <p>
                            Challan No.:
                            <span className="font-bold">
                              {generateChallan()}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-center text-xl font-semibold mb-4">
                        Delivery Challan
                      </h2>

                      {/* Table */}
                      <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2 text-left">
                              S.No.
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                              Item Name
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                              Qty.
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                              Unit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.materialOutvertEntry.map((item, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">
                                {index + 1}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {item.Material}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {item.quantityOutward}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {item.Unit}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Footer */}
                      <div className="mt-36 flex justify-between">
                        <div className="text-sm">Sign. of Dispatch Dep.</div>
                        <div className="text-sm">Sign. of Receiver</div>
                      </div>
                    </div>

                    {/* Download Button (outside the pdfRef container) */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={(event) => downloadPDF(event)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Download Delivery Challan
                      </button>
                    </div>
                  </div>
                )}

                {/* Download Button */}

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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
                      readOnly
                      className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
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
                      readOnly
                      className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
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
                      // onChange={handleChange}
                      readOnly
                      className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
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
                      onChange={handleChange}
                      className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  className="inline-flex items-center justify-center rounded-md bg-green-500 py-2 px-4 font-semibold text-white transition-all hover:bg-opacity-90"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStockOrder;

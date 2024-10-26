import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { common, Dealer, order } from "../../api/call";
import { ToastContainer, toast } from "react-toastify";
import { storage } from "../../api/firebaseconfig.js";
import { AiOutlineClose } from "react-icons/ai";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FaTimes } from "react-icons/fa";

const CreateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("role");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [otherValue, setOtherValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [socialValue, setSocialValue] = useState("");
  const [dealerValue, setDealerValue] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [dealers, setDealers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cityValue, setCityValue] = useState("");
  const [formData, setFormData] = useState({
    clientName: "",
    contactNumber: "",
    clientAddress: "",
    conformKilowatt: "",
    discomOption: "",
    expectedKilowatt: "",
    typeOfLead: "",
    documentProblem: "",
    clientEmail: "",
    orderBy: "",
    lightbill: "",
    sensionLoan: "",
    remarks: "",
    siteSurveyFormAttachment: [],
    id: "",
    Assignlicensingaddexecutive: "",
    solarSystemType: "",
    userid: uid,
    refernce: "",
    referncename: "",
    assignname: "",
    assignid: "",
    state: "",
    salesManger: "",
    typeOfSolarSystem: ""
  });
  const [uploadingLightbill, setUploadingLightbill] = useState(false);
  const [uploadProgressLightbill, setUploadProgressLightbill] = useState(0);
  const [uploadingSiteSurvey, setUploadingSiteSurvey] = useState(false);
  const [uploadProgressSiteSurvey, setUploadProgressSiteSurvey] = useState([]);
  const [uploadingProgressSiteSurvey, setUploadingProgressSiteSurvey] = useState([]);
  const [orderLoading, setorderLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedTax, setSelectedTax] = useState("");
  const [managerList, setManagerList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [moreAvailable, setMoreAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState({
    siteSurveyFormAttachment: [],
  });
  const [uploading, setUploading] = useState({
    siteSurveyFormAttachment: false,
  });
  const [salesList, setsalesList] = useState([]);
  const [salesAvailable, setsalesAvailable] = useState(true);
  const [salesloading, setsalesloading] = useState(false);
  const [salesactivePage, setsalesactivePage] = useState(1);
  const IndianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const fetchSalesManagers = async (page = salesactivePage) => {
    try {
      setsalesloading(true);
      // Fetch managers from the API
      const response = await common.getsalesmanager(page);
      const { data, totalPages } = response.data;
      setsalesList(data);
      if (page >= totalPages) {
        setsalesAvailable(false);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setsalesloading(false);
    }
  };

  const handleSalesScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight) {
      loadMoreSalesManagers();
    }
  };

  const loadMoreSalesManagers = () => {
    if (salesAvailable && !salesloading) {
      const nextPage = salesactivePage + 1;
      setsalesactivePage(nextPage);
      fetchSalesManagers(nextPage);
    }
  };

  useEffect(() => {
    setsalesactivePage(1);
    setsalesList([]);
    setsalesAvailable(true);
    fetchSalesManagers(1);
  }, []);

  const fetchManagers = async (page = activePage) => {
    try {
      setLoading(true);
      // Fetch managers from the API
      const response = await common.getstateManager(page);
      const { data, count } = response.data;

      setManagerList(data);
      const totalPages = Math.ceil(count / 10);
      if (page >= totalPages) {
        setMoreAvailable(false);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStaetScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight) {
      loadMoreManagers();
    }
  };

  const loadMoreManagers = () => {
    if (moreAvailable && !loading) {
      const nextPage = activePage + 1;
      setActivePage(nextPage);
      fetchManagers(nextPage);
    }
  };

  useEffect(() => {
    setActivePage(1);
    setManagerList([]);
    setMoreAvailable(true);
    fetchManagers(1);

  }, []);

  const applyFilters = async (page = currentPage) => {
    try {
      setIsLoading(true);

      let response;

      const filterParam = `&isVerified=true`;
      const stateParam = `&state=${selectedState}`;

      response = await Dealer.searchDealer(page, `${filterParam}${stateParam}`);

      const { results, total } = response.data;

      setDealers(results);
      const totalPages = Math.ceil(total / 10);
      if (page >= totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreDealers = () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      applyFilters(nextPage);
    }
  };

  // Detect when the user scrolls to the bottom of the select dropdown
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight) {
      loadMoreDealers(); // Load more dealers when reaching the bottom
    }
  };

  useEffect(() => {
    if (selectedState) {
      setCurrentPage(1);
      setDealers([]);
      setHasMore(true);
      applyFilters(1);
    }
  }, [selectedState]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const handleSelection = (option) => {
    setSelectedOption(option);

    if (option === "company") {
      setSocialValue(companyValue);
      setDealerValue(companyValue);
      setOtherValue(companyValue); // Set otherValue if needed
    } else if (option === "social") {
      setCompanyValue(socialValue);
      setDealerValue(socialValue);
      setOtherValue(socialValue); // Set otherValue if needed
    } else if (option === "dealer") {
      setCompanyValue(dealerValue);
      setSocialValue(dealerValue);
      setOtherValue(dealerValue); // Set otherValue if needed
    } else if (option === "other") {
      setCompanyValue(otherValue);
      setSocialValue(otherValue);
      setDealerValue(otherValue);
    }
  };

  const handleSubmit1 = () => {
    let result = {};
    if (selectedOption === "company") {
      result = { type: "Company", value: companyValue };
      setFormData({
        ...formData,
        referncename: "Company",
        refernce: companyValue,
      });
    } else if (selectedOption === "social") {
      result = { type: "Social Media", value: socialValue };
      setFormData({
        ...formData,
        referncename: "Social Media",
        refernce: socialValue,
      });
    } else if (selectedOption === "dealer") {
      result = { type: "Dealer", state: dealerValue, dealar: cityValue };
      setFormData({ ...formData, referncename: "Dealer", refernce: cityValue });
    } else if (selectedOption === "other") {
      result = { type: "Other", value: otherValue };
      setFormData({ ...formData, referncename: "Other", refernce: otherValue });
    }
    console.log(result);
    togglePopup();
  };
  const handleFileUploads = (file, fieldName, index = null) => {
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
        } else {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: downloadURL,
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

  const handleFileUpload = (file, fieldName, isLightbill) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (isLightbill) {
          setUploadProgressLightbill(Math.round(progress));
          setUploadingLightbill(true);
        }
        // else if(fieldName === "siteSurveyFormAttachment") {
        //   setUploadProgress((prev) => {
        //     const newProgress = [...prev[fieldName]];
        //     newProgress[index] = Math.round(progress);
        //     return {
        //       ...prev,
        //       [fieldName]: newProgress,
        //     };
        //   });
        //   } 
        else {
          setUploadProgressSiteSurvey(Math.round(progress));
          setUploadingSiteSurvey(true);
        }
      },
      (error) => {
        console.error("Upload failed:", error);
        toast.error("File upload failed. Please try again.");
        if (isLightbill) {
          setUploadingLightbill(false);
        } else if (fieldName === "siteSurveyFormAttachment") {
          setUploading((prev) => ({ ...prev, [fieldName]: false }));

        } else {
          setUploadingSiteSurvey(false);
        }
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if (fieldName === "siteSurveyFormAttachment") {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: [...(prevFormData[fieldName] || []), downloadURL],
          }));
        } else {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: downloadURL,
          }));
        }

        if (isLightbill) {
          setUploadingLightbill(false);
          setUploadProgressLightbill(0);
        } else if (fieldName === "siteSurveyFormAttachment") {
          setUploadProgress((prev) => {
            const newProgress = [...prev[fieldName]];
            newProgress[index] = 0;
            return {
              ...prev,
              [fieldName]: newProgress,
            };
          });
        } else {
          setUploadingSiteSurvey(false);
          setUploadProgressSiteSurvey(0);
        }
        toast.success("File uploaded successfully");
      }
    );
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "siteSurveyFormAttachment") {
        const filesArray = Array.from(files);
        filesArray.forEach((file, index) => {
          handleFileUploads(file, name, index);
        });
      } else {
        handleFileUpload(files[0], name);
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
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
    setorderLoading(true);
    console.log(formData);
    const role = localStorage.getItem("role");
    var assignRole = "";
    if (role === "ADMIN") {
      assignRole = "Admin";
    } else if (role === "STATEMANAGER") {
      assignRole = "Statemanager";
    } else if (role === "SALESMANAGER") {
      assignRole = "Salesmanager";
    }
    const data = { ...formData, orderBy: assignRole };
    try {
      const response = await order.createOrder(data);

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
      toast.error("There was an error submitting the form. Please try again.");
    } finally {
      setorderLoading(false);
    }
  };

  // Handlers to open and close the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedManager(null); // Reset selection on modal close
    setSelectedTax(""); // Clear selected tax value
  };

  // Handlers for specific actions
  const handleStateManagerClick = () => {
    setSelectedManager("State Manager");
  };

  const handleSalesManagerClick = () => {
    setSelectedManager("Sales Manager");
  };

  // Handle tax dropdown change
  const handleTaxChange = (e) => {
    setSelectedTax(e.target.value);
  };

  // Handle proof button click
  const handleProofClick = () => {
    let result = {};
    if (selectedManager === "State Manager") {
      result = { type: "State Manager", value: selectedTax };
      setFormData({ ...formData, assignid: selectedTax, assignname: 'StateManager' })

    } else if (selectedManager === "Sales Manager") {
      result = { type: "Sales Manager", value: selectedTax };
      setFormData({ ...formData, assignid: selectedTax, assignname: 'SalesManager' })
    } else {
      result = { type: "No Manager Selected", value: "" };
    }
    console.log(result);
    handleCloseModal();
  };
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setFormData({
  //           clientLatitude: position.coords.latitude,
  //           clientLongitude: position.coords.longitude,
  //         });
  //       },
  //       (error) => {
  //         console.error('Error fetching location:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //   }
  // }, []);

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white dark:bg-boxdark p-8 rounded shadow-md w-full max-w-6xl">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Add Order Details</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="clientName"
                >
                  Client Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Client Name"
                  className="border rounded bg-white dark:bg-boxdark  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="contactNumber"
                >
                  Contact Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="ClientAddress"
              >
                Client Address<span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                id="clientAddress"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
                placeholder="Client Address"
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                required
              />
            </div>
            <div className="mt-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="address"
              >
                Client State <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded mt-2 dark:bg-boxdark"
                value={formData.state}
                id="state"
                name="state"
                onChange={handleChange}
                required
              >
                <option value="">Select State</option>
                {IndianStates.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-full mt-3 mb-2">
              <div className="col-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="clientLatitude"
                >
                  Client Latitude<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="clientLatitude"
                  name="clientLatitude"
                  value={formData.clientLatitude}
                  onChange={handleChange}
                  placeholder=" Client Latitude"
                  className="border rounded bg-white dark:bg-boxdark  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="col-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="clientLongitude"
                >

                  Client Longitude<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="clientLongitude"
                  name="clientLongitude"
                  value={formData.clientLongitude}
                  onChange={handleChange}
                  placeholder="Client Longitude"
                  className="border rounded bg-white dark:bg-boxdark  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>


            {/* Second Row - Two Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 "
                  htmlFor="clientEmail"
                >
                  Client Email
                </label>
                <input
                  type="text"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder=" Client Email"
                  className="border rounded bg-white dark:bg-boxdark  w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                />
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
                  value={formData.conformKilowatt}
                  onChange={handleChange}
                  placeholder="conformKilowatt"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  required
                />
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="discomOption"
                >
                  Discom Option <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="discomOption"
                  name="discomOption"
                  value={formData.discomOption}
                  onChange={handleChange}
                  placeholder="Discom Option"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  required
                />
              </div>

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
                  value={formData.expectedKilowatt}
                  onChange={handleChange}
                  placeholder="Exact Kilowatt"
                  required
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
                  >
                    <option value="">Select Solar System Type</option>
                    <option value="Residential">Residential</option>
                    <option value="Residential">Comman Residential</option>
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
                    value={formData.typeOfLead}
                    onChange={handleChange}
                    required
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
            </div>
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
                value={formData?.typeOfSolarSystem}
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

            {/* File Uploads */}
            <div className="mb-4 mt-2">
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
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                    onChange={(e) =>
                      handleFileUpload(e.target.files[0], "lightbill", true)
                    }
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              )}
              {uploadingLightbill && (
                <div className="mt-2">
                  <progress
                    value={uploadProgressLightbill}
                    max="100"
                    className="w-full"
                  />
                  <span>{uploadProgressLightbill}%</span>
                </div>
              )}
            </div>
            <div>
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
                        <progress value={uploadingSiteSurvey} max="100" className="w-full" />
                        <span>Uploading file {index + 1}: {progress}%</span>
                      </div>
                    ))}

                </div>
              </>)}
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 mt-3">
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
                  value={formData.sensionLoan}
                  onChange={handleChange}
                  placeholder="Session Loan"
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
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Remarks"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                />
              </div>
            </div>

            {/* social media and assignto */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="remarks"
                >
                  Reference From
                </label>
                <button
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={togglePopup}
                >
                  Add Reference
                </button>

                {isPopupOpen && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[99999] h-screen">
                    <div className="relative bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
                      {/* Close icon in top-right corner */}
                      <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                        onClick={togglePopup}
                      >
                        <AiOutlineClose size={24} />
                      </button>

                      <h2 className="text-lg font-bold mb-4">
                        Choose Reference From
                      </h2>

                      <div className="flex flex-col space-y-4">
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                          type="button"
                          onClick={() => handleSelection("company")}
                        >
                          Company
                        </button>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                          type="button"
                          onClick={() => handleSelection("social")}
                        >
                          Social Media
                        </button>
                        <button
                          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
                          type="button"
                          onClick={() => handleSelection("dealer")}
                        >
                          Dealer
                        </button>
                        <button
                          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full"
                          type="button"
                          onClick={() => handleSelection("other")}
                        >
                          Others
                        </button>
                      </div>

                      {/* Displaying Content Based on Selection */}
                      {selectedOption === "company" && (
                        <div className="mt-4">
                          <h3 className="font-bold text-lg mb-2">Company</h3>
                          <input
                            type="text"
                            value={companyValue}
                            onChange={(e) => setCompanyValue(e.target.value)}
                            placeholder="Enter company name"
                            className="w-full p-2 border border-gray-300 rounded mt-2 dark:bg-boxdark"
                          />
                          <button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                            type="button"
                            onClick={handleSubmit1}
                          >
                            Submit
                          </button>
                        </div>
                      )}

                      {selectedOption === "social" && (
                        <div className="mt-4">
                          <h3 className="font-bold text-lg mb-2">
                            Social Media
                          </h3>
                          <select
                            className="w-full p-2 border border-gray-300 rounded mt-2 dark:bg-boxdark"
                            value={socialValue}
                            onChange={(e) => setSocialValue(e.target.value)}
                          >
                            <option value="">Select Social Media</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter</option>
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                          </select>
                          <button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                            type="button"
                            onClick={handleSubmit1}
                          >
                            Submit
                          </button>
                        </div>
                      )}

                      {selectedOption === "dealer" && (
                        <div className="mt-4">
                          <h3 className="font-bold text-lg mb-2">Dealer</h3>
                          <select
                            className="w-full p-2 border border-gray-300 rounded mt-2 dark:bg-boxdark"
                            value={dealerValue}
                            onChange={(e) => {
                              setDealerValue(e.target.value);
                              setSelectedState(e.target.value);
                            }}
                          >
                            <option value="">Select State</option>
                            {IndianStates.map((state, index) => (
                              <option key={index} value={state}>
                                {state}
                              </option>
                            ))}
                          </select>

                          {selectedState && (
                            <div className="mt-6">
                              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                Select Dealer
                              </label>
                              <div className="relative w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden dark:bg-gray-800 bg-white dark:bg-bodydark">
                                <div className="w-full p-2 h-48 overflow-y-auto dark:bg-gray-900 bg-white dark:bg-boxdark">
                                  <select
                                    className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-none outline-none focus:ring-0 rounded-lg dark:bg-boxdark"
                                    value={cityValue}
                                    onChange={(e) =>
                                      setCityValue(e.target.value)
                                    }
                                    size="6"
                                  >
                                    <option
                                      value=""
                                      className=" dark:bg-boxdark "
                                    >
                                      Select Dealer
                                    </option>
                                    {dealers.map((dealer) => (
                                      <option
                                        key={dealer._id}
                                        value={dealer._id}
                                        className="dark:bg-boxdar dark:text-white"
                                      >
                                        {dealer.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {isLoading && (
                                  <div className="absolute inset-x-0 bottom-0 bg-gray-50 dark:bg-gray-800 p-2 text-center text-gray-500 dark:text-gray-400">
                                    Loading more dealers...
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                            type="button"
                            onClick={handleSubmit1}
                          >
                            Submit
                          </button>
                        </div>
                      )}

                      {selectedOption === "other" && (
                        <div className="mt-4">
                          <h3 className="font-bold text-lg mb-2">Other</h3>
                          <input
                            type="text"
                            value={otherValue}
                            onChange={(e) => setOtherValue(e.target.value)}
                            placeholder="Others...."
                            className="w-full p-2 border border-gray-300 rounded mt-2 dark:bg-boxdark"
                          />
                          <button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                            type="button"
                            onClick={handleSubmit1}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {role === "SALESMANAGER" && (
                <>
                  <div className="flex justify-center mt-2"><strong>Assign To</strong></div>
                  <div className="relative w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden dark:bg-gray-800 bg-white">

                    <div
                      className="w-full p-2 h-48 overflow-y-auto dark:bg-gray-900 bg-white dark:bg-boxdark"
                      onScroll={handleSalesScroll}
                    >
                      <select
                        className="w-full p-3 bg-white dark:bg-boxdark text-gray-900 dark:text-gray-300 border-none outline-none focus:ring-0 rounded-lg"
                        value={formData.assignid}
                        onChange={(e) => {
                          setFormData({ ...formData, assignname: "SalesManager", assignid: e.target.value })
                        }}
                        size="6"
                      >
                        <option value="" className="text-gray-700 dark:text-gray-400">
                          Select Sales Executive
                        </option>
                        {salesList.map((manager) => (
                          <option key={manager._id} value={manager._id} className="text-gray-700 dark:text-gray-300">
                            {manager.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {salesloading && (
                      <div className="absolute inset-x-0 bottom-0 bg-gray-50 dark:bg-gray-800 p-2 text-center text-gray-500 dark:text-gray-400">
                        Loading more managers...
                      </div>
                    )}
                  </div>
                </>
              )}
              {role === "STATEMANAGER" && (
                //  <div className="w-full xl:w-1/2">
                //     <label
                //         className="block text-gray-700 text-sm font-bold mb-2"
                //         htmlFor="referencefrom"
                //     >
                //         Assign To
                //     </label>
                //     <select
                //         id="assignto"
                //         name="assignto"
                //         className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                //         value={formData.assignto}
                //         onChange={handleChange}
                //         required
                //     >
                //         <option value="">Select Reference From</option>
                //         <option value="Statemanager">State Manager</option>
                //         <option value="Salesmanager">Sales Manager</option>
                //     </select>
                // </div>
                <div className="w-full xl:w-1/2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="remarks"
                  >
                    Assign To
                  </label>
                  <button
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="button"
                    onClick={handleOpenModal} // Opens the modal
                  >
                    Assign To
                  </button>

                  {/* Modal Section */}
                  {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative dark:bg-boxdark">
                        {/* Close Icon */}
                        <button
                          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                          onClick={handleCloseModal}
                        >
                          <FaTimes size={24} />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Assign To</h2>

                        {/* Manager Buttons */}
                        <div className="flex justify-between mb-4">
                          <button
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${selectedManager === "State Manager"
                              ? "opacity-0 cursor-not-allowed"
                              : ""
                              }`}
                            onClick={handleStateManagerClick}
                            disabled={selectedManager === "State Manager"} // Disable if already selected
                          >
                            State Manager
                          </button>
                          <button
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${selectedManager === "Sales Manager"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                              }`}
                            onClick={handleSalesManagerClick}
                            disabled={selectedManager === "Sales Manager"} // Disable if already selected
                          >
                            Sales Manager
                          </button>
                        </div>

                        {/* Conditional Dropdown Field */}
                        {selectedManager === "State Manager" && (
                          <div className="relative w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden dark:bg-gray-800 bg-white">
                            <div
                              className="w-full p-2 h-48 overflow-y-auto dark:bg-gray-900 bg-white"
                              onScroll={handleScroll}
                            >
                              <select
                                className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-none outline-none focus:ring-0 rounded-lg"
                                name="StateManager"
                                value={selectedTax}
                                onChange={handleTaxChange}
                                size="6"
                              >
                                <option
                                  value=""
                                  className="text-gray-700 dark:text-gray-400"
                                >
                                  Select State Executive
                                </option>
                                {managerList.map((manager) => (
                                  <option
                                    key={manager._id}
                                    value={manager._id}
                                    className="text-gray-700 dark:text-gray-300"
                                  >
                                    {manager.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {loading && (
                              <div className="absolute inset-x-0 bottom-0 bg-gray-50 dark:bg-gray-800 p-2 text-center text-gray-500 dark:text-gray-400">
                                Loading more managers...
                              </div>
                            )}
                          </div>
                        )}

                        {selectedManager === "Sales Manager" && (
                          <div className="relative w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden dark:bg-gray-800 bg-white">
                            <div
                              className="w-full p-2 h-48 overflow-y-auto dark:bg-gray-900 bg-white"
                              onScroll={handleSalesScroll}
                            >
                              <select
                                className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-none outline-none focus:ring-0 rounded-lg"
                                value={selectedTax}
                                onChange={handleTaxChange}
                                size="6"
                              >
                                <option value="" className="text-gray-700 dark:text-gray-400">
                                  Select Sales Executive
                                </option>
                                {salesList.map((manager) => (
                                  <option key={manager._id} value={manager._id} className="text-gray-700 dark:text-gray-300">
                                    {manager.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {salesloading && (
                              <div className="absolute inset-x-0 bottom-0 bg-gray-50 dark:bg-gray-800 p-2 text-center text-gray-500 dark:text-gray-400">
                                Loading more managers...
                              </div>
                            )}
                          </div>
                        )}

                        {/* Proof Button */}
                        {selectedManager && (
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                            onClick={handleProofClick} // Log input value on click
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {orderLoading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateOrder;

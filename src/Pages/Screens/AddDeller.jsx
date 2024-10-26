/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./../../api/firebaseconfig.js"; // Adjust the path as needed
import { Dealer } from "../../api/call.js";
import { Link, useNavigate } from "react-router-dom";
import FilUpload from "../../components/FileUpload.jsx";
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
const CreateDealerForm = () => {
  const navigate = useNavigate();
  const statesOfIndia = [
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

  const [uploadProgress, setUploadProgress] = useState({
    passportPhoto: 0,
    adharCard: 0,
    panCard: 0,
    dealerAgreement: 0,
    solarAgreement: 0,
    otherdocs: [],
  });

  const [uploading, setUploading] = useState({});
  const [dealerLoading, setdealerLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    contactNumber: "",
    profession: "",
    address: "",
    state: "",
    remarks: "",
    gstNumber: "",
    password: "",
    otherdocs: [],
    bankDetails: {
      accountNumber: "",
      bankName: "",
      ifscCode: "",
    },
    depositsDetails: {
      amount: 0,
      date: "",
    },
    auction: "online", // Default value
    companyPancard: "",
    businessAddress: "",
    dealerLocation: "",
    docs: {
      passportPhoto: null,
      adharCard: null,
      panCard: null,
      dealerAgreement: null,
      solarAgreement: null,
    },
  });

  const handleAmountChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      depositsDetails: {
        ...prevFormData.depositsDetails,
        [name.split('.')[1]]: value,
      },
    }));
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    
    // Handle nested bankDetails properties
    if (name.startsWith("bankDetails.")) {
      const propertyName = name.split(".")[1]; // Get the nested property name
      setFormData((prevData) => ({
        ...prevData,
        bankDetails: {
          ...prevData.bankDetails,
          [propertyName]: value,
        },
      }));
    } else if (name.startsWith("docs.")) {
      // Handle individual document uploads
      const file = files[0];
      if (file) {
        handleSingleFileUpload(file, name)
          .then((downloadURL) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              [name]: downloadURL,
            }));
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
          });
      }
    } else if (name === "otherdocs") {
      // Handle multiple file uploads
      const selectedFiles = Array.from(files);
      selectedFiles.forEach((file, index) => {
        handleFileUpload(file, name, index);
      });
    } else {
      console.log("name, value,",name, value);

      // Handle other form fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  // Handle multiple file uploads
  const handleFileUpload = (file, fieldName, index = null) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate and set upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (fieldName === "otherdocs") {
          setUploadProgress((prev) => {
            const newProgress = [...prev.otherdocs];
            newProgress[index] = Math.round(progress);
            return {
              ...prev,
              [fieldName]: newProgress,
            };
          });
        } else {
          setUploadProgress((prev) => ({
            ...prev,
            [fieldName]: Math.round(progress),
          }));
        }
  
        setUploading((prev) => ({
          ...prev,
          [fieldName]: true,
        }));
      },
      (error) => {
        // Handle upload failure
        console.error("Upload failed:", error);
        toast.error("File upload failed. Please try again.");
        setUploading((prev) => ({
          ...prev,
          [fieldName]: false,
        }));
      },
      async () => {
        // Handle successful upload
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if (fieldName === "otherdocs") {
          setFormData((prevFormData) => {
            const newDocs = [...prevFormData.otherdocs];
            newDocs[index] = downloadURL;
            return { ...prevFormData, [fieldName]: newDocs };
          });
        } else {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: downloadURL,
          }));
        }
  
        toast.success("File uploaded successfully");
        setUploading((prev) => ({
          ...prev,
          [fieldName]: false,
        }));
      }
    );
  };
  
  // Handle single file uploads
  const handleSingleFileUpload = (file, fieldName) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `documents/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate and set upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({
            ...prev,
            [fieldName]: Math.round(progress),
          }));
          setUploading((prev) => ({
            ...prev,
            [fieldName]: true,
          }));
        },
        (error) => {
          // Handle upload failure
          console.error(`Upload failed: ${error.message}`);
          toast.error("File upload failed. Please try again."); // Add error toast
          reject(error);
        },
        async () => {
          // Handle successful upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading((prev) => ({
            ...prev,
            [fieldName]: false,
          }));
          toast.success("File uploaded successfully"); // Add success toast
          resolve(downloadURL);
        }
      );
    });
  };
  

  const handleDateChange = (e) => {
    let { name, value } = e.target;
    if (
      name.startsWith("bankDetails.") ||
      name.startsWith("depositsDetails.")
    ) {
      const [parentKey, childKey] = name.split(".");

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
      setFormData((prevData) => ({
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          [childKey]: value,
        },
      }));
      if (value.match(regex)) {
        const [day, month, year] = value.split("/");
        const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
        setFormData((prevData) => ({
          ...prevData,
          [`${name}ISO`]: isoDate,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setdealerLoading(true);
    console.log("Form Data:", formData);

    try {
      const response = await Dealer.createDealer(formData);
      if (response.data.data) {
        toast.success("Dealer created successfully!");
      } else {
        toast.error("fail created successfully!");
      }
    } catch (error) {
      console.error("Error creating dealer:", error);
      toast.error("Failed to create dealer.");
    } finally {
      setdealerLoading(false);
    }
    setTimeout(() => {
      navigate("/deller");
    }, 1000);
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <ToastContainer />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b flex justify-between items-center border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create Dealer
            </h3>
            <Link to="/deller">
              <button className="flex items-center justify-center gap-1">
                <FaArrowLeftLong />
                <span>Go Back</span>
              </button>
            </Link>
          </div>
          <form className="p-6.5" onSubmit={handleSubmit}>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row xl:space-x-6">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row xl:space-x-6">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Company Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Contact Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter your contact number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Address<span className="text-red-500">*</span>
              </label>
              <textarea
                rows="2"
                name="address"
                className="w-full rounded border-[1.5px] h-24 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row xl:space-x-6">
              <div className="w-full xl:w-1/2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  State<span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your state</option>
                  {statesOfIndia.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Remarks
                </label>
                <input
                  type="text"
                  name="remarks"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter any remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row xl:space-x-6">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter your GST number"
                  value={formData.gstNumber}
                  onChange={handleChange}
                />
              </div>

              {/* <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div> */}
            </div>

            <fieldset className="mb-4.5">
              <legend className="text-black dark:text-white">
                Bank Details
              </legend>
              <div className="flex flex-col gap-6 xl:flex-row xl:space-x-6">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Account Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankDetails.accountNumber"
                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter your account number"
                    value={formData.bankDetails.accountNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Bank Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankDetails.bankName"
                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter your bank name"
                    value={formData.bankDetails.bankName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    IFSC Code<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankDetails.ifscCode"
                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter your IFSC code"
                    value={formData.bankDetails.ifscCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="mb-4.5">
              <legend className="text-black dark:text-white">
                Deposits Details
              </legend>
              <div className="flex flex-col gap-6 xl:flex-row xl:space-x-6">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Amount<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="depositsDetails.amount"
                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter deposit amount"
                    value={formData.depositsDetails.amount} 
                    onChange={handleAmountChange}
                    required
                  />
                </div>

                {/* <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Date
                </label>
                <input
                  type="date"
                  name="depositsDetails.date"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.depositsDetails.date}
                  onChange={handleChange}
                  required
                />
              </div> */}
                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-2.5 block text-black dark:text-white"
                    // htmlFor="depositsDetails.date"
                  >
                    Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="depositsDetails.date"
                    name="depositsDetails.date"
                    value={formData.depositsDetails.date} // Display the formatted date
                    onChange={handleDateChange}
                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    placeholder="YYYY/MM/DD"
                    maxLength={10}
                  />
                </div>
              </div>
            </fieldset>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Payment Type<span className="text-red-500">*</span>
              </label>
              <select
                name="auction"
                className="mt-1 p-2 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-boxdark"
                value={formData.auction}
                onChange={handleChange}
                required
              >
                <option value="online">Online</option>
                <option value="check">Check</option>
              </select>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row xl:space-x-6">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Company Pancard<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyPancard"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter your company pancard"
                  value={formData.companyPancard}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Business Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="2"
                  name="businessAddress"
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter your business address"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Dealer Location
              </label>
              <input
                type="text"
                name="dealerLocation"
                className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Enter dealer location"
                value={formData.dealerLocation}
                onChange={handleChange}
              />
            </div>
            <fieldset className="mb-4.5">
        <legend className="text-black dark:text-white">Documents</legend>
        <div className="flex flex-col gap-6">
          {['passportPhoto', 'adharCard', 'panCard', 'dealerAgreement', 'solarAgreement'].map((docType) => (
            <div key={docType}>
              <label className="mb-2.5 block text-black dark:text-white">
                {docType === 'passportPhoto' ? 'Passport Size Photo' : docType.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="file"
                name={`docs.${docType}`}
                className="w-full border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition dark:border-strokedark dark:bg-form-input dark:text-white"
                onChange={handleChange}
                accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
              />
              <progress value={uploadProgress[docType]} max="100" />
            </div>
          ))}
        </div>
      </fieldset>

            <div>
              <label
                className="mb-2.5 block text-black dark:text-white"
                htmlFor="otherdocs"
              >
                Other Attachments
              </label>

              {formData.otherdocs.length > 0 ? (
                <div className="mt-2">
                  {formData.otherdocs.map((item, index) => (
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
                    id="otherdocs"
                    name="otherdocs"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    multiple
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  />
                  {uploadProgress.otherdocs.length > 0 &&
                    uploadProgress.otherdocs.map((progress, index) => (
                      <div
                        key={index}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      >
                        Uploading file {index + 1}: {progress}%
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-[#57B34E] py-2 px-6 font-semibold text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {dealerLoading ? "Loading..." : "Create Dealer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateDealerForm;

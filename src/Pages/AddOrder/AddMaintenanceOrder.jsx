import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaTrash } from "react-icons/fa6";
import { Maintenance, Stock, Complain, License } from "../../api/call.js";
import FileUpload from "../../components/FileUpload.jsx";
import { storage } from "../../api/firebaseconfig.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import { CiSquarePlus } from "react-icons/ci";
const ImagePopup = ({ images, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark p-4 rounded-lg max-w-3xl w-full">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        <div className="flex overflow-x-auto gap-4 p-4">
          {images.map((image, index) => (
            <img key={index} src={image} alt={image} className="w-64 h-64 object-cover" />
          ))}
        </div>
      </div>
    </div>
  );
};


const MaterialPopup = ({ materials, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-boxdark p-4 rounded-lg max-w-3xl w-full">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Category Name</th>
                <th className="border px-4 py-2">Material</th>
                <th className="border px-4 py-2">Brand</th>
                <th className="border px-4 py-2">Unit</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price Per Unit</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{material.CategoryName}</td>
                  <td className="border px-4 py-2">{material.Material}</td>
                  <td className="border px-4 py-2">{material.Brand}</td>
                  <td className="border px-4 py-2">{material.Unit}</td>
                  <td className="border px-4 py-2">{material.quantity}</td>
                  <td className="border px-4 py-2">{material.PricePerUnit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const MaterialModal = ({ complain, onClose, onSubmit }) => {
  const [editedProduct, setEditedProduct] = useState(complain);
  const navigate = useNavigate()
  // Sync the editedProduct with the complain prop whenever it changes
  useEffect(() => {
    setEditedProduct(complain);
  }, [complain]);

  // Handle input changes when editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      const response = await Complain.updateComplain(editedProduct._id, {
        queryResolveDate: editedProduct.queryResolveDate,
        inspectionDate: editedProduct.inspectionDate,
        paymentReceived: editedProduct.paymentReceived,
        complainRemark: editedProduct.complainRemark,
      });
      if (response.status) {
        onSubmit(editedProduct); // Pass the edited product back to the parent
        window.location.reload(); // Reloads the page after navigating
      } else {
        console.error("Update failed: ", response.message);
      }
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg mt-5 dark:bg-boxdark">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Material Details</h2>

          {/* Two-column grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <label className="block">
              <span className="text-gray-700 font-medium">Query Resolve Date</span>
              <input
                type="date"
                name="queryResolveDate"
                value={editedProduct.queryResolveDate ? new Date(editedProduct.queryResolveDate).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-boxdark"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Inspection Date</span>
              <input
                type="date"
                name="inspectionDate"
                value={editedProduct.inspectionDate ? new Date(editedProduct.inspectionDate).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-boxdark"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Payment Received</span>
              <input
                type="text"
                name="paymentReceived"
                value={editedProduct.paymentReceived ? 'Yes' : 'No'}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-boxdark"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Complain Remark</span>
              <input
                type="text"
                name="complainRemark"
                value={editedProduct.complainRemark}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-boxdark"
              />
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Close
            </button>

            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



const AddMaintenanceOrder = () => {
  const location = useLocation();
  const order = location.state?.order || {};
  const navigate = useNavigate();
  const [AllMaterial, setAllMaterial] = useState([]);
  const [formData, setFormData] = useState({
    issueDate: "",
    inspectionDate: "",
    queryResolveDate: "",
    queryAttachment: [],
    advanceAmount: "",
    Status: order.Status || "",
    query: order.query || "",
    id: "",
    orderNumber: "",
    clientName: "",
    contactNumber: "",
    clientEmail: "",
    solarSystemType: "",
    clientLocation: "",
    discomOption: "",
    dispatchDate: "",
    password: "",
    wifiConfiguration: "",
    inverterCompanyName: "",
    username: "",
    designConformation: "",
    paymentConfirmation: "",
    GEDADocuments: "",
    installerName: "",
    installerPrice: "",
    projectCompletionDate: "",
    meterInstallation: "",
    applicationForm: null,
    signDocs: null,
    SiteDocuments: [],
    billOfMaterials: [],
    typeOfLead: "",
    complaintType: "",
    inquiryResult: "",
    paymentAttachments: [],
    complaintremark: "",
    PhotoAttachment: [],
    ComplaintAttachment: [],
    materialReplacement: [],
    SalesManagerStatus: "",
    SalesManagerMessage: "",
    ProjectHandlerStatus: "",
    ProjectHandlerMessage: "",
    LicenseManagerStatus: "",
    LicenseManagerMessage: "",
    StoreManagerStatus: "",
    StoreManagerMessage: "",
    DesignerStatus: "",
    DesignerMessage: "",
    AccountsStatus: "",
    AccountsMessage: "",
    CustomerStatus: "",
    CustomerMessage: "",
    paymentreceivedComplan: "",
    AssignProjectManager: "",
    AssignStoreManager: "",
    clientLatitude: "",
    clientLongitude: ""
  });

  const [projectExecutive, setprojectExecutives] = useState([]);
  const [storeExecutives, setstoreExecutives] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({
    applicationForm: 0,
    signDocs: 0,
    SiteDocuments: [],
  });
  const [uploading, setUploading] = useState({
    applicationForm: false,
    signDocs: false,
    SiteDocuments: false,
  });
  const [maintenanceLoading, setmaintenanceLoading] = useState(false);
  useEffect(() => {
    fetchItems();
    if (order) {
      setFormData({
        id: order._id || "",
        clientName: order._id
          ? order.orderBy === "Customer"
            ? order.userid.name
            : order.clientName
          : "",
        contactNumber: order._id
          ? order.orderBy === "Customer"
            ? order.userid.phonenumber
            : order.contactNumber
          : "",
        address: order._id
          ? order.orderBy === "Customer"
            ? order.userid.fulladdress
            : order.clientAddress
          : "",
        clientEmail: order._id
          ? order.orderBy === "Customer"
            ? order.userid.email
            : order.clientEmail
          : "",
        orderNumber: order.orderNumber ? order.orderNumber : "",
        solarSystemType: order?.solarSystemType ? order?.solarSystemType : "",
        clientLocation: order.clientLocation ? order.clientLocation : "",
        discomOption: order.discomOption ? order.discomOption : "",
        applicationForm: order.applicationForm ? order.applicationForm : null,
        signDocs: order.signDocs ? order.signDocs : null,
        SiteDocuments: order?.SiteDocuments ? order?.SiteDocuments : [],
        Assignprojectaddexecutive: order.ProjectHandler?.managerid ? order.ProjectHandler?.managerid : "",
        issueDate: order.issueDate ? order.issueDate : "",
        dispatchDate: order.dispatchDate
          ? new Date(order.dispatchDate).toISOString().split("T")[0]
          : "",
        inspectionDate: order.inspectionDate ? new Date(order.inspectionDate).toISOString().split("T")[0] : "",
        queryResolveDate: order.queryResolveDate ? new Date(order.queryResolveDate).toISOString().split("T")[0] : "",
        advanceAmount: order.advanceAmount ? order.advanceAmount : "",
        Status: order.MaintainaneceManager?.status ? order.MaintainaneceManager?.status : "",
        query: order.MaintainaneceManager?.message ? order.MaintainaneceManager?.message : "",
        paymentConfirmation: order.paymentConfirmation ? order.paymentConfirmation : "",
        wifiConfiguration: order?.wifiConfiguration ? order?.wifiConfiguration : "",
        inverterCompanyName: order.inverterCompanyName ? order.inverterCompanyName : "",
        username: order.username ? order.username : "",
        password: order.password ? order.password : "",
        designConformation: order?.designConformation ? order?.designConformation : "",
        GEDADocuments: order.GEDADocuments ? order.GEDADocuments : [],
        installerName: order.installerName ? order.installerName : "",
        projectCompletionDate: order.projectCompletionDate
          ? new Date(order.projectCompletionDate).toISOString().split("T")[0]
          : "",
        installerPrice: order.installerPrice ? order.installerPrice : "",
        meterInstallation: order.meterInstallation ? order.meterInstallation : "",
        billOfMaterials: order?.billOfMaterials ? order?.billOfMaterials : [],
        typeOfLead: order?.typeOfLead ? order?.typeOfLead : "",
        complaintType: order.complaintType ? order.complaintType : "",
        inquiryResult: order.inquiryResult ? order.inquiryResult : "",
        paymentAttachments: order.paymentAttachments ? order.paymentAttachments : [],
        ComplaintAttachment: order.ComplaintAttachment ? order.ComplaintAttachment : [],
        SalesManagerStatus: order.SalesManager?.status,
        SalesManagerMessage: order.SalesManager?.message,
        ProjectHandlerStatus: order.ProjectHandler?.status,
        ProjectHandlerMessage: order.ProjectHandler?.message,
        LicenseManagerStatus: order.LicenseManager?.status,
        LicenseManagerMessage: order.LicenseManager?.message,
        StoreManagerStatus: order.StoreManager?.status,
        StoreManagerMessage: order.StoreManager?.message,
        DesignerStatus: order.Designer?.status,
        DesignerMessage: order.Designer?.message,
        AccountsStatus: order.Accounts?.status,
        AccountsMessage: order.Accounts?.message,
        CustomerStatus: order.Customer?.status,
        CustomerMessage: order.Customer?.message,
        clientLongitude: order.clientLongitude ? order.clientLongitude : "",
        clientLatitude: order.clientLatitude ? order.clientLatitude : "",

      });
    }
  }, []);

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

  const fetchExecutives = async () => {
    try {

      const project = await License.assignProject();
      const store = await License.assignstore();
      if (project.data.status) {
        setprojectExecutives(project.data.data);
      }
      if (store.data.status) {
        setstoreExecutives(store.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchExecutives()
  }, [])

  // Opens modal on button click
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

  const handleFileUpload = (file, fieldName, index = null) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setUploadProgress((prev) => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            [index]: Math.round(progress),
          },
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

        setFormData((prevFormData) => ({
          ...prevFormData,
          [fieldName]: [...(prevFormData[fieldName] || []), downloadURL],
        }));

        setUploadProgress((prev) => ({
          ...prev,
          [fieldName]: { ...prev[fieldName], [index]: 0 },
        }));

        toast.success("File uploaded successfully");
      }
    );
  };

  const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleChange = (e) => {
    const { name, files, value } = e.target;

    // Check if the input is a file input
    if (files) {
      const filesArray = Array.from(files);

      // Initialize progress for the field
      setUploadProgress((prev) => ({
        ...prev,
        [name]: Array(filesArray.length).fill(0), // Reset progress for all files
      }));

      filesArray.forEach((file, index) => {
        handleFileUpload(file, name, index);
      });
    } else {
      // Handle text input (like query)
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  const initialFormData = {
    queryResolveDate: '',
    inspectionDate: '',
    paymentreceivedComplan: '',
    complainAttachment: [],
    queryAttachment: [],
    complaintremark: '',
    materialReplacement: [],
  };
  const handleAddComplain = async () => {
    // Prepare the data for the API
    const apiData = {
      orderId: formData.id, // Example orderId; replace as needed
      queryResolveDate: formData.queryResolveDate,
      inspectionDate: formData.inspectionDate,
      paymentReceived: formData.paymentreceivedComplan || "not yet",
      complainAttachment: formData.ComplaintAttachment,
      queryAttachment: formData.queryAttachment,
      complainRemark: formData.complaintremark,
      materialReplacement: materialsmat,
      orderNumber: formData.orderNumber, // Example orderNumber; replace as needed
    };
    console.log("apiData", apiData)
    if (formData.queryResolveDate && formData.inspectionDate) {
      try {
        const response = await Complain.Complain(apiData);
        console.log(response)
        // alert(response.data.message);
        toast.success("Complaint added successfully")
        fetchComplaints()
        setFormData({ ...formData, ...initialFormData });
        setMaterials([])
      } catch (error) {
        console.error("Error adding complaint:", error);
        alert("There was an error adding your complaint.");
      }
    } else {
      toast.error("QueryResolve Date and Inspection Date Required")
    }
  };



  const handleImageClick = (images) => {
    setSelectedImages(images);
    setShowPopup(true);
  };
  const handleImageClick1 = (materials) => {
    setSelectedMaterials(materials); // Pass the materialReplacement data
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setShowPopup(false);

  };
  const fetchItems = async () => {
    try {
      const getAllMaterial = await Stock.getAllMaterial();
      console.log(getAllMaterial.data.data);

      if (getAllMaterial.data.data) {
        setAllMaterial(getAllMaterial.data.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const uploadFileToFirebase = async (file) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setmaintenanceLoading(true)
    // Upload attach documents to Firebase
    // const attachdocsUrls = await Promise.all(
    //   Array.from(formData.attachdocs).map(async (file) => {
    //     const url = await uploadFileToFirebase(file);
    //     return { name: file?.name, url };
    //   })
    // );
    try {
      const MultipleManager = []
      if (formData.AssignProjectManager !== undefined && formData.AssignProjectManager !== "") {
        MultipleManager.push({ AssignManagerRole: "ProjectHandler", AssignManagerid: formData.AssignProjectManager })
      }
      if (formData.AssignStoreManager !== undefined && formData.AssignStoreManager !== "") {
        MultipleManager.push({ AssignManagerRole: "StoreManager", AssignManagerid: formData.AssignStoreManager })
      }


      const Managerdata = {
        orderId: order._id,
        status: formData.Status,
        message: formData.query,
        data: { ...formData,paymentConfirmation: formData.paymentConfirmation.length > 0 ? formData.paymentConfirmation :""},
        MultipleManager
      };
      console.log("MaintenanceManagerdata", Managerdata);
      const response = await Maintenance.verifyMaintenance(Managerdata);
      if (response && (response.status === 201 || response.status === 200)) {
        toast.success("Update Order Successfully");

        setTimeout(() => {
          navigate("/orders");
        }, 2000);
      } else {
        toast.error("Failed to Add Category. Ensure the category is unique.");
      }
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setmaintenanceLoading(false)
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
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const fileArray = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      doc: file.name
    }));
    setFormData({ ...formData, [name]: fileArray });
  };

  // const orders = [
  //   {
  //     id: 1,
  //     clientName: 'John Doe',
  //     address: '123 Main St',
  //     panelCount: 5,
  //     categoryCount: 3,
  //     brandName: 'Brand A',
  //     billOfMaterials: 'Steel',
  //     item: 'Panel A',
  //     units: 100
  //   },
  //   {
  //     id: 2,
  //     clientName: 'Jane Smith',
  //     address: '456 Oak St',
  //     panelCount: 8,
  //     categoryCount: 5,
  //     brandName: 'Brand B',
  //     billOfMaterials: 'Aluminum',
  //     item: 'Panel B',
  //     units: 200
  //   },
  //   {
  //     id: 3,
  //     clientName: 'Alice Johnson',
  //     address: '789 Pine St',
  //     panelCount: 6,
  //     categoryCount: 4,
  //     brandName: 'Brand C',
  //     billOfMaterials: 'Plastic',
  //     item: 'Panel C',
  //     units: 150
  //   },
  // ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Function to open the modal
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Function to close the modal
  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedOrder(null);
  // };

  const [showPopup, setShowPopup] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);


  const [showModalmat, setShowModalmat] = useState(false);
  const [showModal1mat, setShowModal1mat] = useState(false);
  const [materialsmat, setMaterials] = useState([
    // { CategoryName: 'Electronics', Material: 'Resistor', Brand: 'Brand A', Unit: 'Piece', quantity: 100, PricePerUnit: 0.1 },
    // { CategoryName: 'Electronics', Material: 'Capacitor', Brand: 'Brand B', Unit: 'Piece', quantity: 50, PricePerUnit: 0.5 },
  ]);

  const [newMaterialmat, setNewMaterialmat] = useState({
    CategoryName: '',
    Material: '',
    Brand: '',
    Unit: '',
    quantity: "",
    PricePerUnit: "",
  });

  const [complaintsmat, setComplaintsmat] = useState([]);
  const [newComplaint, setNewComplaint] = useState('');
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  // Material functions
  const toggleModalmat = () => setShowModal1mat(!showModal1mat);
  const addMaterialmat = () => setShowModalmat(true);
  const saveNewMaterialmat = () => {
    setMaterials([...materialsmat, newMaterialmat]);
    setNewMaterialmat({ CategoryName: '', Material: '', Brand: '', Unit: '', quantity: "", PricePerUnit: "" });
    setShowModalmat(false);
  };
  const removeMaterialmat = (index) => setMaterials(materialsmat.filter((_, i) => i !== index));
  const closeModalmat = () => setShowModalmat(false);
  const handleNewMaterialChangemat = (field, value) => setNewMaterialmat({ ...newMaterialmat, [field]: value });

  // Complaint functions
  const addComplaint = () => {
    if (newComplaint.trim() === '') return; // Prevent adding empty complaints
    setComplaintsmat([...complaintsmat, newComplaintmat]);
    setNewComplaint(''); // Clear input field
    setShowComplaintModal(false); // Close modal after adding
  };

  const removeComplaint = (index) => setComplaintsmat(complaintsmat.filter((_, i) => i !== index));
  const toggleComplaintModal = () => setShowComplaintModal(!showComplaintModal);

  const [getComplaints, setGetComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // To track the current page
  const [totalPages, setTotalPages] = useState(1);   // Total pages from the response

  // Fetch complaints on page load and when the page number changes
  useEffect(() => {
    if (formData.id) {


      fetchComplaints();
    }
  }, [currentPage, formData.id]);
  const fetchComplaints = async () => {
    try {
      setLoading(true); // Start loading
      const response = await Complain.getallComplain(formData.id, currentPage);
      if (response.data.results) {
        setGetComplaints(response.data.results || []);
      } else {
        setGetComplaints([]);
      }
      // console.log(getComplaints?.materialReplacement?.CategoryName)
      console.log(getComplaints)
      setTotalPages(Math.ceil(response.data.total / response.data.limit)); // Calculate total pages
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  };
  const [isEditable, setIsEditable] = useState(false);


  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleModalOpen = (complain) => {
    setSelectedProduct(complain); // Set the clicked product for editing
    setIsModalOpen1(true); // Open modal
  };

  const handleModalClose = () => {
    setIsModalOpen1(false); // Close modal
    setSelectedProduct(null); // Clear selected product
  };
  const handleProductSubmit = (updatedProduct) => {
    setGetComplaints((prevData) =>
      prevData.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    // console.log(ProductData)
  };

  const handleSubmitdelete = async () => {
    console.log(getComplaints.inspectionDate)
    try {
      const response = await Complain.delete(getComplaints[0]._id);

      if (response.status === 200) { // Check if the response status indicates success
        console.log(`Deleted complain with ID: ${getComplaints[0]._id}`);
        window.location.reload(); // Reloads the page after navigating
        // Optionally, you might want to refresh the data or update the UI to reflect the deletion
      } else {
        console.error("Delete failed: ", response.message);
      }
    } catch (error) {
      console.error("Error deleting complain: ", error);
    }
  };

  // const currentDate = new Date();
  // // Parse the inspection date from your complaint object
  // const inspectionDate = new Date(getComplaints[1]?.inspectionDate);
  // console.log(getComplaints[1].inspectionDate)

  // // Determine the status based on the inspection date
  // const status = inspectionDate < currentDate ? 'Complete' : 'Pending';
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b flex justify-between items-center border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add Maintenance Order
            </h3>
            <Link to="/orders">
              <button className="flex items-center justify-center gap-1">
                <FaArrowLeftLong />
                <span>Go Back</span>
              </button>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
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
                    value={formData.orderNumber}
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
                    value={formData.contactNumber}
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
                    value={formData.clientEmail}
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
                      className=""
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



              {/* Dispatch Date */}
              <div className="mb-4.5">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="dispatchDate"
                >
                  Dispatch Date<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dispatchDate"
                  name="dispatchDate"
                  value={formData.dispatchDate} // Display the formatted date
                  onChange={handleDateChange}
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                  placeholder="YYYY/MM/DD" // Ensure proper format
                  maxLength={10} // Max length for DD/MM/YYYY format
                />
              </div>
              {/* bill of Materials and payment confirmation */}
              {/* <div className="mb-4.5">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="billOfMaterials"
                >
                  Bill of Materials
                </label>
                {formData?.billOfMaterials ? (
                  <div className="mt-2">
                    {formData?.billOfMaterials?.includes(".pdf") ? (
                      <embed
                        src={formData?.billOfMaterials}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                      />
                    ) : (
                      <img
                        src={formData?.billOfMaterials}
                        alt="Preview"
                        className="max-w-50 h-auto"
                      />
                    )}
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
                {uploading?.billOfMaterials && (
                  <div>Uploading: {uploadProgress?.billOfMaterials}%</div>
                )}
              </div> */}
              <div className="w-full xl:w-1/2">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="paymentConfirmation"
                >
                  Payment Confirmation
                </label>
                {formData.paymentConfirmation ? (
                  <div className="mt-2">
                    {formData.paymentConfirmation.includes(".pdf") ? (
                      <embed
                        src={formData.paymentConfirmation}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                      />
                    ) : (
                      <img
                        src={formData.paymentConfirmation}
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
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  />
                )}
                {uploading.paymentConfirmation && (
                  <div>Uploading: {uploadProgress.paymentConfirmation}%</div>
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
                  readOnly
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
                  value={formData.inverterCompanyName}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  placeholder="Enter company name"
                  readOnly
                />
              </div>


              {/* Username and Password in One Row */}
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label
                    className="mb-2.5 block text-black dark:text-white"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Enter username"
                    readOnly
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
                    readOnly={!isEditable} // Conditionally make input readonly
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

              {/* GEDA Documents */}
              <div className="w-full">
                <label
                  className="mb-2.5 block text-black dark:text-white"
                  htmlFor="GEDADocuments"
                >
                  GEDA Documents
                </label>
                {/* {formData.GEDADocuments.length > 0 ? ( */}
                {formData.GEDADocuments ? (
                  <div className="mt-2">
                    {
                      formData.GEDADocuments.map((item, index) => (
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

                {/* {uploading.GEDADocuments && uploadProgress.GEDADocuments.length > 0 && */}
                {uploading.GEDADocuments && uploadProgress.GEDADocuments &&
                  uploadProgress.GEDADocuments.map((progress, index) => (
                    <div
                      key={index}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      Uploading file {index + 1}: {progress}%
                    </div>
                  ))}
              </div>

              {/* Project Completion Date */}
              <div className="mb-4.5 mt-2">
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
                  value={formData.projectCompletionDate}
                  onChange={handleDateChange}
                  className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                  placeholder="YYYY/MM/DD"
                  maxLength={10}
                  readOnly
                />
              </div>
              {/* Discom Option */}
              <div className="mb-4.5">
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
                  value={formData.discomOption}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  readOnly
                />
              </div>

              {/* File Uploads */}
              <div className="mb-4.5 flex flex-col gap-4">
                <div className="mb-4.5 flex flex-col gap-4">
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white" htmlFor="SiteDocuments">
                      Site Documents
                    </label>

                    {/* Conditional rendering for uploaded files */}
                    {/* {formData?.SiteDocuments.length > 0 ? ( */}
                    {formData?.SiteDocuments.length > 0 ? (
                      <div className="mt-2">
                        {formData?.SiteDocuments.map((item, index) => (
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
                          id="SiteDocuments"
                          name="SiteDocuments"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          multiple
                          onChange={handleChange}
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                        />
                        {uploading?.SiteDocuments && uploadProgress?.SiteDocuments && (
                          <div>
                            {uploadProgress?.SiteDocuments.map((progress, index) => (
                              <div key={index}>Uploading: {progress}%</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>





              <div className="p-6 border-2 border-gray-300 rounded-lg shadow-sm bg-white dark:bg-boxdark">
                <h2 className="text-lg font-bold text-black dark:text-white mb-4">Complain Details</h2>

                {/* Query Resolve Date and Inspection Date */}
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full xl:w-1/2 px-2 mb-4">
                    <label htmlFor="queryResolveDate" className="block text-black dark:text-white">
                      Query Resolve Date
                      {/* <span className="text-red-500">*</span> */}
                    </label>
                    <input
                      type="date"
                      id="queryResolveDate"
                      name="queryResolveDate"
                      value={formData.queryResolveDate}
                      onChange={handleChange}
                      className="w-full mt-2 rounded border bg-transparent py-2 px-3"
                    // required
                    />
                  </div>
                  <div className="w-full xl:w-1/2 px-2 mb-4">
                    <label htmlFor="inspectionDate" className="block text-black dark:text-white">
                      Inspection Date
                      {/* <span className="text-red-500">*</span> */}
                    </label>
                    <input
                      type="date"
                      id="inspectionDate"
                      name="inspectionDate"
                      value={formData.inspectionDate}
                      onChange={handleChange}
                      className="w-full mt-2 rounded border bg-transparent py-2 px-3"
                    // required
                    />
                  </div>
                </div>

                {/* Payment Received */}
                <div className="mb-4">
                  <label htmlFor="paymentreceivedComplan" className="block text-black dark:text-white">
                    Payment Received
                  </label>
                  <input
                    type="text"
                    id="paymentreceivedComplan"
                    name="paymentreceivedComplan"
                    value={formData.paymentreceivedComplan}
                    onChange={handleChange}
                    className="w-full mt-2 rounded border bg-transparent py-2 px-3"
                    placeholder="Payment Received"
                  />
                </div>

                {/* Complaint Attachments */}
                <div className="mb-4">
                  <label htmlFor="ComplaintAttachment" className="block text-black dark:text-white">
                    Complaint Attachment
                  </label>
                  <input
                    type="file"
                    id="ComplaintAttachment"
                    name="ComplaintAttachment"
                    multiple
                    onChange={handleChange}  // Bind the handleChange function
                    className="w-full mt-2 rounded border bg-transparent py-2 px-3"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="queryAttachment" className="block text-black dark:text-white">
                    Photo Attachment
                  </label>
                  <input
                    type="file"
                    id="queryAttachment"
                    name="queryAttachment"
                    multiple
                    onChange={handleChange}  // Bind the handleChange function
                    className="w-full mt-2 rounded border bg-transparent py-2 px-3"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  />
                </div>


                {/* Complain Remark */}
                <div className="mb-4">
                  <label htmlFor="complaintremark" className="block text-black dark:text-white">
                    Complain Remark
                  </label>
                  <input
                    type="text"
                    id="complaintremark"
                    name="complaintremark"
                    value={formData.complaintremark}
                    onChange={handleChange}
                    className="w-full mt-2 rounded border bg-transparent py-2 px-3"
                    placeholder="Complain Remark"
                  />
                </div>
                <div>
                  {/* Material Management */}
                  {/* Add Material Button and View Material Button */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div>
                      <span className="mb-">Material Replacement Quantity</span>
                      <div className="flex gap-4 mt-2">
                        <button type="button" onClick={addMaterialmat} className="mb-4 w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-primary bg-primary p-2 text-white dark:bg-darkprimary dark:border-darkprimary">+ Add Material</button>
                        <button type="button" onClick={toggleModalmat} className="mb-4 w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-primary bg-primary p-2 text-white dark:bg-darksecondary dark:border-darksecondary">View Material</button>
                      </div>

                      {/* View Materials Modal */}
                      {showModal1mat && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                          <div className="bg-white dark:bg-darkinput p-6 rounded-lg max-w-3xl w-full">
                            <h2 className="text-xl font-semibold mb-4">Materials List</h2>
                            <div className="overflow-x-auto">
                              {materialsmat.length === 0 ? (
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
                                      {materialsmat.map((item, index) => (
                                        <tr key={index} className="bg-white dark:bg-boxdark">
                                          <td className="border border-gray-300 p-2 dark:border-darkinput">{item.CategoryName}</td>
                                          <td className="border border-gray-300 p-2 dark:border-darkinput">{item.Material}</td>
                                          <td className="border border-gray-300 p-2 dark:border-darkinput">{item.Brand}</td>
                                          <td className="border border-gray-300 p-2 dark:border-darkinput">{item.Unit}</td>
                                          <td className="border border-gray-300 p-2 dark:border-darkinput">{item.quantity}</td>
                                          <td className="border border-gray-300 p-2 dark:border-darkinput">{item.PricePerUnit}</td>
                                          <td className="border border-gray-300 p-2 dark:border-darkinput bg-red-500 text-white">
                                            <button onClick={() => removeMaterialmat(index)}>Delete</button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                            <button type="button" onClick={toggleModalmat} className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg">Close</button>
                          </div>
                        </div>
                      )}

                      {/* Add Material Modal */}
                      {showModalmat && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                          <div className="bg-white dark:bg-darkinput p-6 rounded-lg max-w-xl w-full">
                            <h2 className="text-xl mb-4">Add New Material</h2>
                            <div className="mb-4 flex flex-wrap items-center gap-4">
                              <input type="text" value={newMaterialmat.CategoryName} onChange={(e) => handleNewMaterialChangemat('CategoryName', e.target.value)} placeholder="Category Name" className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark" />
                              <input type="text" value={newMaterialmat.Material} onChange={(e) => handleNewMaterialChangemat('Material', e.target.value)} placeholder="Material Name" className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark" />
                              <input type="text" value={newMaterialmat.Brand} onChange={(e) => handleNewMaterialChangemat('Brand', e.target.value)} placeholder="Brand Name" className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark" />
                              <input type="text" value={newMaterialmat.Unit} onChange={(e) => handleNewMaterialChangemat('Unit', e.target.value)} placeholder="Enter Unit" className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark" />
                              <input type="number" value={newMaterialmat.quantity} onChange={(e) => handleNewMaterialChangemat('quantity', e.target.value)} placeholder="Quantity" className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark" />
                              <input type="number" value={newMaterialmat.PricePerUnit} onChange={(e) => handleNewMaterialChangemat('PricePerUnit', e.target.value)} placeholder="Price Per Unit" className="w-full sm:w-1/2 lg:w-auto rounded-lg border border-stroke dark:text-white p-3 text-black dark:border-strokedark dark:bg-darkinput bg-white dark:bg-boxdark" />
                            </div>
                            <button type="button" onClick={saveNewMaterialmat} className="mt-4 w-full bg-green-500 text-white p-2 rounded-lg">Add Material</button>
                            <button type="button" onClick={closeModalmat} className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg">Close</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Add Complain Button */}
              </div>
              <button
                type="button"
                onClick={handleAddComplain}
                className="text-white mt-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                + Add Complain
              </button>

              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full table-auto border-collapse bg-white dark:bg-boxdark shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-800">
                      <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Query Resolve Date</th>
                      <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Inspection Date</th>
                      <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Payment Received</th>
                      <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Complain Remark</th>
                      <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">View Material</th>
                      <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Photo Attachment</th>
                      <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Complain Photos</th>
                      <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Edit</th>
                      <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Delete</th>
                      <th className="border px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 dark:bg-boxdark">
                    {console.log(getComplaints)}
                    {loading ? (
                      <tr>
                        <td colSpan="10" className="text-center py-4 text-gray-500">Loading...</td>
                      </tr>
                    ) : (
                      getComplaints.map((complain, index) => {
                        const queryResolveDate = new Date(complain.queryResolveDate); // Get the current date
                        const inspectionDate = new Date(complain.inspectionDate); // Convert inspectionDate to a Date object

                        // Compare the inspection date with the current date to determine the status
                        let status = '';
                        if (inspectionDate >= queryResolveDate) {
                          status = 'Complete'; // Inspection date is in the past
                        } else if (inspectionDate.toDateString() === queryResolveDate.toDateString()) {
                          status = 'In Progress'; // Inspection date is today
                        } else {
                          status = 'Pending'; // Inspection date is in the future
                        }

                        return (
                          <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                            <td className="border px-4 py-2">{formatDate(complain.queryResolveDate)}</td>
                            <td className="border px-4 py-2">{formatDate(complain.inspectionDate)}</td>
                            <td className="border px-4 py-2">{complain.paymentReceived ? 'Yes' : 'No'}</td>
                            <td className="border px-4 py-2">{complain.complainRemark || 'N/A'}</td>
                            <td className="border px-4 py-2">
                              <button
                                type="button"
                                onClick={() => handleImageClick1(complain.materialReplacement)}
                                className="w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border border-primary bg-primary p-2 text-white hover:bg-primary-dark transition duration-150"
                              >
                                View Material
                              </button>
                            </td>
                            <td className="border px-4 py-2">
                              {complain.queryAttachment.length > 0 ? (
                                <button
                                  type="button"
                                  onClick={() => handleImageClick(complain.queryAttachment)}
                                  className="px-2 py-1 bg-green-600 text-white hover:bg-green-700 rounded transition duration-150"
                                >
                                  View
                                </button>
                              ) : (
                                <span className="text-gray-500">No Attachment</span>
                              )}
                            </td>
                            <td className="border px-4 py-2">
                              {complain.complainAttachment.length > 0 ? (
                                <button
                                  type="button"
                                  onClick={() => handleImageClick(complain.complainAttachment)}
                                  className="px-2 py-1 bg-green-600 text-white hover:bg-green-700 rounded transition duration-150"
                                >
                                  View
                                </button>
                              ) : (
                                <span className="text-gray-500">No Photos</span>
                              )}
                            </td>
                            <td className="border px-4 py-2">
                              <button
                                className="px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded transition duration-150"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent page refresh
                                  handleModalOpen(complain);
                                }}
                              >
                                Edit
                              </button>
                            </td>
                            {isModalOpen1 && selectedProduct && (
                              <MaterialModal
                                complain={selectedProduct} // Pass the selected product to the modal
                                onClose={handleModalClose} // Handle product submit to update the data
                                onSubmit={handleProductSubmit}
                              />
                            )}
                            <td className="border px-4 py-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleSubmitdelete();
                                }}
                                className="px-2 py-1 bg-red-500 text-white hover:bg-red-600 rounded transition duration-150">
                                Delete
                              </button>
                            </td>
                            <td className="border px-4 py-2">
                              <span className={`font-semibold ${status === 'Complete' ? 'text-green-500' : status === 'In Progress' ? 'text-yellow-500' : 'text-red-500'}`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}

                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousPage}
                  className={`px-4 py-2 bg-gray-300 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={handleNextPage}
                  className={`px-4 py-2 bg-gray-300 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>


              <div className="flex mt-4">
                <div className="mb-4 col-6">
                  <label
                    htmlFor="firstDropdown"
                    className="block text-gray-700"
                  >
                    Assign StoreManager
                  </label>
                  <select
                    id="firstDropdown"
                    name="AssignStoreManager"
                    value={formData.AssignStoreManager}
                    onChange={handleAssignChange}
                    className="mt-1 p-2 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-boxdark"

                  >
                    <option value="" selected>
                      Select an option
                    </option>
                    {
                      storeExecutives.map((manger, index) => (
                        <option value={manger._id} key={index}>{manger.name}</option>
                      ))
                    }

                  </select>
                </div>
                <div className="mb-4 col-6">
                  <label
                    htmlFor="firstDropdown"
                    className="block text-gray-700"
                  >
                    Assign ProjectManager
                  </label>
                  <select
                    id="firstDropdown"
                    name="AssignProjectManager"
                    value={formData.AssignProjectManager}
                    onChange={handleAssignChange}
                    className="mt-1 p-2 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-boxdark"

                  >
                    <option value="" selected>
                      Select an option
                    </option>
                    {
                      projectExecutive.map((manger, index) => (
                        <option value={manger._id} key={index}>{manger.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>


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
                    readOnly
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
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
                    readOnly
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
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
                    readOnly
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="LicenseManagerStatus"
                  >
                    License Executive Status
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
                    License Executive Message
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


              <div className="flex mt-2">
                <div className="mb-4 col-6">
                  <label
                    htmlFor="firstDropdown"
                    className="block text-gray-700"
                  >
                    Status<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="firstDropdown"
                    name="Status"
                    value={formData.Status}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-boxdark"
                    required
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
                  <label htmlFor="textInput" className="block text-gray-700">
                    Query
                  </label>
                  <input
                    type="text"
                    id="textInput"
                    name="query"
                    value={formData.query}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-boxdark"
                    placeholder="Enter Query"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4.5">
                <button
                  type="submit"
                  className="w-full rounded-md bg-primary p-3 text-white"
                >
                  {maintenanceLoading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center mt-20 items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh]  overflow-y-auto relative dark:bg-boxdark">
            {/* Square Close Button in the Top Right */}
            <button
              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 flex items-center justify-center"
              onClick={closeModal}
            >
              &#x2715; {/* Close icon */}
            </button>

            <h2 className="text-xl font-semibold mb-4">Order Material Details</h2>

            {/* Company Details */}
            <div className="mb-4">
              <p>Client Name: Ashok Patel</p>
              <p>OrderId: 123456</p>
              <p>Address: 123 Ground Floor, XYZ Building, Mumbai</p>
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1">SR. NO.</th>
                  <th className="border px-2 py-1">ITEM</th>
                  <th className="border px-2 py-1">QUANTITY</th>
                  <th className="border px-2 py-1">Unit</th>
                </tr>
              </thead>
              <tbody>
                {/* Add enough rows to mirror the image */}
                {Array(10).fill().map((_, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">{index + 1}</td>
                    <td className="border px-2 py-1">Item {index + 1}</td>
                    <td className="border px-2 py-1">-</td>
                    <td className="border px-2 py-1">-</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature Section */}
            <div className="mt-8 flex justify-between">
              <div>
                <p className="font-semibold">Receiver Signature:</p>
                <p>_____________________</p>
              </div>
              <div>
                <p className="font-semibold">Authorized Signatory:</p>
                <p>_____________________</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPopup && <ImagePopup images={selectedImages} onClose={handleClosePopup} />}
      {isPopupOpen && (
        <MaterialPopup
          materials={selectedMaterials}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
};

export default AddMaintenanceOrder;

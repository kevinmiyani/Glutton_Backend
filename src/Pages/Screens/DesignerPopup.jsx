import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Designer } from "../../api/call";
import { ToastContainer, toast } from "react-toastify";
import { storage } from '../../api/firebaseconfig.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const DesignerPopup = ({ onClose, orderId }) => {
  const location = useLocation();
  // const order = olocation.state?.order || {};

  const navigate = useNavigate();

  // const [designPlanName, setDesignPlanName] = useState('');
  // const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    designPlan: "",
    status: "",
    query: ""
  })
  const [executives, setExecutives] = useState([]);
  const [uploadesign, setUploadesign] = useState(false);
  const [uploadProgressLightbill, setUploadProgressLightbill] = useState(0);
  const [uploadingSiteSurvey, setUploadingSiteSurvey] = useState(false);
  const [uploadProgressSiteSurvey, setUploadProgressSiteSurvey] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchExecutives();
  }, []);


  useEffect(() => {
    if (orderId) {
      console.log("Order ID:", orderId);  // Ensure orderId is available
      setFormData({
        designPlan: orderId.designPlan || "",
        query: Designer.message || "",
        status: Designer.status || ""
      });
    }
  }, [orderId]);

  const fetchExecutives = async () => {
    try {
      const data = {
        orderId:  orderId, 
        data:{ 
        designPlan: formData.designPlan,
        query: formData.query,
        status: formData.status
        }
      };

      const response = await Designer.verifyDesign(data);

      console.log(response.data.status);

      if (response.data.status) {
        setExecutives(response.data.data);
      } else {
        console.log(response.data.message); // Log the error message from API
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileUpload = (file, fieldName) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadesign(true);
        setUploadProgressLightbill(progress)
      },
      (error) => {
        console.error("Upload failed:", error);
        toast.error("File upload failed. Please try again.");
        setUploadesign(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prevFormData) => ({
          ...prevFormData,
          [fieldName]: downloadURL,
        }));
        setUploadesign(false);
        setUploadProgressLightbill(0);
        toast.success("File uploaded successfully");
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const Designerdata = {
        orderId: orderId,
        status: formData.status,
        message: formData.query,
        data:{
        designPlan: formData.designPlan
        },
      
      };
      console.log("Designerdata", Designerdata);
      const response = await Designer.verifyDesign(Designerdata);
      console.log(response)

      if (response && (response.status === 201 || response.status === 200)) {
        toast.success('Update Order Successfully');
        // window.location.reload();
        setFormData(response.data);

        // setTimeout(() => {
        //   navigate('/orders');
        //   onClose()
        // }, 500);
      }
      console.log('Form submitted successfully:', response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };
console.log(formData)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <ToastContainer />
      <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Design Plan Name</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {formData.file ?
              <div className="mt-2">
                {formData.file.includes(".pdf") ? (
                  <embed src={formData.file} type="application/pdf" width="100%" height="500px" />
                ) : (
                  <img src={formData.file} alt="Preview" className="max-w-50 h-auto" />
                )}
              </div> :
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Design Attachment
                </label>
                <input
                  type="file"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                  onChange={(e) => handleFileUpload(e.target.files[0], "designPlan", true)}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            }
            {uploadesign && (
              <div className="mt-2">
                <progress value={uploadesign} max="100" className="w-full" />
                <span>{uploadesign}%</span>
              </div>
            )}
          </div>


          {/* status and Query Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="mb-4 ">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 "
                htmlFor="status"
              >
                Status<span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
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
                placeholder='Query'
                value={formData.query}
                onChange={handleChange}
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-boxdark"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none"
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DesignerPopup;

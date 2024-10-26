import React, { useEffect, useState } from 'react';
import { MdKeyboardBackspace } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Stock } from '../../api/call';
import { ToastContainer, toast } from "react-toastify";

const AddAccountOrder = () => {
  const location = useLocation();
  const manager = location.state?.manager;
  const role = localStorage.getItem('role');

  const [formData, setFormData] = useState({
    payment: [],
    Status: "",
    query: "",
  });
  const [accountLoading, setaccountLoading] = useState(false);
  useEffect(() => {
    if (manager) {
      setFormData({
        payment: manager.payment ? manager.payment : [],
        Status: manager?.Accounts ? manager?.Accounts.status : "",
        query: manager?.Accounts ? manager?.Accounts.message : "",
      });
    }
    console.log("manager.payment", manager.payment);

  }, []);
  if (!manager) {
    return <div className="text-center text-xl text-gray-600 dark:text-gray-400 mt-10">No manager data available</div>;
  }

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name.startsWith("payment")) {
      const updatedPayments = [...formData.payment];
      updatedPayments[index].value = value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        payment: updatedPayments,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // Add a new payment to the payment array
  const handleAddPayment = () => {
    const newPaymentName = `payment${formData.payment.length + 1}`;
    setFormData((prevFormData) => ({
      ...prevFormData,
      payment: [...prevFormData.payment, { name: newPaymentName, value: "" }],
    }));
  };

  // Remove a payment from the payment array
  const handleRemovePayment = (index) => {
    const updatedPayments = formData.payment.filter((_, i) => i !== index);
    setFormData((prevFormData) => ({
      ...prevFormData,
      payment: updatedPayments,
    }));
  };


  const handleSubmit = async (e) => {
    setaccountLoading(true);
    try {
      const StockManagerdata = {
        orderId: manager._id,
        status: formData.Status,
        message: formData.query,
        data: {
          payment: formData.payment,
        }
      };
      // console.log("Form data:", StockManagerdata);
      const response = await Stock.verifyStoke(StockManagerdata);
      if (response && (response.status === 201 || response.status === 200)) {
        toast.success('Order Updated Successfully');

        setTimeout(() => {
          navigate('/orders'); // Redirect to the orders page after 1 second
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setaccountLoading(false)
    }
  };
  console.log(manager)

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-boxdark ">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleGoBack} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
          <MdKeyboardBackspace size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Account Order Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Name */}
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.clientName || "N/A"}</h3>
            <p className="text-gray-500 dark:text-gray-400">Client Name</p>
          </div>
        </div>

        {/* Contact Number */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.contactNumber || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">Contact Number</p>
        </div>


        {/* Order Number */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.orderNumber || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">Order Number</p>
        </div>

        {/* Dispatch Date */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager?.dispatchDate ? format(manager?.dispatchDate, "yyyy-MM-dd HH:mm") : "Pending"}</h3>
          <p className="text-gray-500 dark:text-gray-400">Dispatch Date</p>
        </div>
        {/* Email */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">   {manager.orderBy !== "Customer"
            ? manager.clientEmail
            : manager.userid?.email}</h3>
          <p className="text-gray-500 dark:text-gray-400">Email</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.clientLatitude|| "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">Client Latitude</p>
        </div><div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.clientLongitude || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">Client Longitude</p>
        </div>
        {/* Meter Date */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager?.meterInstallationDate ? format(manager?.meterInstallationDate, "yyyy-MM-dd HH:mm") : "Pending"}</h3>
          <p className="text-gray-500 dark:text-gray-400">Meter Date</p>
        </div>

        {/* Payment Confirmation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {manager.paymentConfirmation ? (
              manager.paymentConfirmation.includes(".pdf") ? (
                <embed
                  src={manager.paymentConfirmation}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                />
              ) : (
                <img
                  src={manager.paymentConfirmation}
                  alt="Preview"
                  className="max-w-50 h-auto"
                />
              )
            ) : (
              "No Attachment"
            )}
          </h3>

          <p className="text-gray-500 dark:text-gray-400">Payment Confirmation</p>
        </div>
        {/*GEDA Letter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {manager.GEDADocuments ? (
              manager.GEDADocuments.includes(".pdf") ? (
                <embed
                  src={manager.GEDADocuments}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                />
              ) : (
                <img
                  src={manager.GEDADocuments}
                  alt="Preview"
                  className="max-w-50 h-auto"
                />
              )
            ) : (
              "No Attachment"
            )}
          </h3>

          <p className="text-gray-500 dark:text-gray-400">GEDA Letter</p>
        </div>

        {/* Project Completion Date */}
        <div>
  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
    {manager?.projectCompletionDate 
      ? format(new Date(manager.projectCompletionDate), "yyyy-MM-dd") 
      : "Pending"}
  </h3>
  <p className="text-gray-500 dark:text-gray-400">Project Completion Date</p>
</div>

        {/* Advance Payment */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager?.advanceAmount ? manager?.advanceAmount : "Pending"}</h3>

          <p className="text-gray-500 dark:text-gray-400">Advance Payment</p>
        </div>
        {/* final Payment */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager?.finalAmount ? manager?.finalAmount : "Pending"}</h3>

          <p className="text-gray-500 dark:text-gray-400">Final Payment</p>
        </div>

        {/* Issue Date */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager?.issueDate ? format(manager?.issueDate, "yyyy-MM-dd HH:mm") : "Pending"}</h3>

          <p className="text-gray-500 dark:text-gray-400">Issue Date</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.SalesManager.status || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">SalesManager Status</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.SalesManager.SalesManager || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">SalesManager Message</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.LicenseManager.status || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">LicenseManager Status</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.LicenseManager.SalesManager || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">LicenseManager Message</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.ProjectHandler.status || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">ProjectHandler Status</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.ProjectHandler.SalesManager || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">ProjectHandler Message</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.MaintainaneceManager.status || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">MaintainaneceManager Status</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.MaintainaneceManager.SalesManager || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">MaintainaneceManager Message</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.Customer.status || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">Customer Status</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{manager.Customer.SalesManager || "N/A"}</h3>
          <p className="text-gray-500 dark:text-gray-400">Customer Message</p>
        </div>
        <div className="flex flex-col">
          {/* Payment Fields */}
          {formData.payment.map((payment, index) => (
            <div key={index} className="flex items-center space-x-4 bg-gray-50 dark:bg-boxdark p-4 rounded-md shadow-sm">
              <div className="flex-1 ">
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  {payment.name}
                </label>
                <input
                  type="number"
                  name={`payment${index + 1}`}
                  value={payment.value}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full mt-1 rounded-md border border-gray-300 dark:border-strokedark bg-white dark:bg-form-input py-2 px-3 text-gray-700 dark:text-white focus:border-primary focus:outline-none focus:ring-primary"
                  placeholder={`Enter ${payment.name}`}
                  required
                />
              </div>
              <button
                onClick={() => handleRemovePayment(index)}
                className="text-red-600 mt-4 bg-red-100 hover:bg-red-200 dark:bg-red-500 dark:hover:bg-red-600 p-2 rounded-md transition-colors dark:text-white"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add Payment Button */}
          <button
            onClick={handleAddPayment}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-500 py-2 px-4 font-semibold text-white transition-all hover:bg-blue-600"
          >
            + Add Payment
          </button>
        </div>


        {/* Status and Query Fields */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
        <div className="mb-4 ">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="Status"
          >
            Status
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
        onClick={() => handleSubmit()}
      >
        {accountLoading ? 'Loading...' : 'Submit'}
      </button>
    </div>
  );
};

export default AddAccountOrder;

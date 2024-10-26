/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { customer } from "../../api/call";

const OrderTable = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [copiedText, setCopiedText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedState, setSelectedState] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customer.getAllCustomer();
        setCustomers(response.data);
        setFilteredCustomers(response.data); 
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedState === "") {
      setFilteredCustomers(customers); 
    } else {
      const filtered = customers.filter((customer) =>
        customer.state === selectedState
      );
      setFilteredCustomers(filtered);
    }
  }, [selectedState, customers]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  
  const uniqueStates = [...new Set(customers.map((customer) => customer.state))];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Details</h2>

      <div className="mb-6">
        <label htmlFor="stateFilter" className="mr-2 font-semibold">
          Filter by State:
        </label>
        <select
          id="stateFilter"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="">All States</option> 
          {uniqueStates.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 bg-green-600 text-white border">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-left">District</th>
              <th className="p-3 text-left">Pincode</th>
              <th className="p-3 text-left">Coins</th>
              <th className="p-3 text-left">Referral Code</th>
              <th className="p-3 text-left">Number of Referral</th>
              <th className="p-3 text-left">Latitude</th>
              <th className="p-3 text-left">Longitude</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredCustomers.map((customer, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">{customer.phonenumber}</td>
                <td className="p-3">{customer.state}</td>
                <td className="p-3">{customer.district}</td>
                <td className="p-3">{customer.pincode}</td>
                <td className="p-3">{customer.coins}</td>
                <td className="p-3">{customer.referralCode}</td>
                <td className="p-3">{customer.referredUsers?.length || 0}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleCopy(customer.cords?.latitude || "N/A")}
                    className="text-blue-600"
                  >
                    {customer.cords?.latitude || "N/A"}
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleCopy(customer.cords?.longitude || "N/A")}
                    className="text-blue-600"
                  >
                    {customer.cords?.longitude || "N/A"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white p-3 rounded-md shadow-md">
          {copiedText} copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default OrderTable;

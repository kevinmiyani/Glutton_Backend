/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React,{useState,useEffect} from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaFlag,
} from "react-icons/fa";
import { FaCompactDisc } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import user from "../../../src/images/icon/user.png";
import { Bar } from "react-chartjs-2";
import { common } from "../../api/call";


const DealerProfile = () => {
  const location = useLocation();
  const manager = location.state?.manager;
  const role = localStorage.getItem("role");
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); 
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const uid = localStorage.getItem("uid");
  const initialBarData = {
    labels: [],
    datasets: [{
      label: 'Kilowatt Sales',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };
  // State to hold the bar chart data
  const [barData, setBarData] = useState(initialBarData);
  
  const [barData2, setBarData2] = useState(initialBarData);


  useEffect(() => {
    if (manager?._id) {
      fetchKilowattSalesData();
    }
  }, [manager?._id]);

  const fetchKilowattSalesData = async () => {
    try {
      const currentYear = new Date().getFullYear();
  
      const response = await common.getConfirmedKWmanagerid({ managerId: manager?._id, year: currentYear });
      const { yearlyTotals, monthlyTotals } = response.data;
  
      console.log("Yearly Totals:", yearlyTotals, "Monthly Totals:", monthlyTotals);
  
      // Prepare yearly data for the bar chart
      const yearlyData = yearlyTotals.map(item => item.totalConfirmedKilowatt);
      const years = yearlyTotals.map(item => item.year);
  
      // Prepare monthly data for the bar chart
      const monthlyData = Object.values(monthlyTotals);
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
  
      // Update yearly chart data
      setBarData((prevData) => ({
        ...prevData,
        labels: years, // Set the labels to years
        datasets: [{ ...prevData.datasets[0], data: yearlyData }]
      }));
  
      // Update monthly chart data
      setBarData2((prevData) => ({
        ...prevData,
        labels: months, // Set the labels to months
        datasets: [{ ...prevData.datasets[0], data: monthlyData }]
      }));
    } catch (error) {
      console.error("Error fetching kilowatt sales data:", error);
    }
  };

  if (!manager) {
    return (
      <div className="text-center text-xl text-gray-600 dark:text-gray-400 mt-10">
        No manager data available
      </div>
    );
  }

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="bg-gradient-to-r to-indigo-50 bg-white dark:bg-boxdark dark:to-gray-900">
      <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-gradient-to-br p-8 flex items-center justify-center">
            {manager?.profilephoto ? (
              <>
                <img
                  className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
                  src={manager?.profilephoto}
                  alt={manager?.name || "Manager"}
                />
              </>
            ) : (
              <>
                <img
                  className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
                  src={user}
                  alt={manager?.name || "Manager"}
                />
              </>
            )}
          </div>
          <div className="p-8 flex-grow">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {manager?.role}
                </div>
                <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  {manager?.name || manager?.clientName || "No Name"}
                </h1>
              </div>
              <MdKeyboardBackspace
                onClick={handleGoBack}
                className="text-indigo-500 text-2xl cursor-pointer ml-4"
              />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                icon={<FaEnvelope className="text-indigo-500" />}
                label="Email"
                value={manager?.email}
              />
              <InfoItem
                icon={<FaPhone className="text-indigo-500" />}
                label="Phone"
                value={manager?.contactNumber}
              />
              <InfoItem
                icon={<FaMapMarkerAlt className="text-indigo-500" />}
                label="Address"
                value={manager?.address}
              />
              <InfoItem
                icon={<FaCity className="text-indigo-500" />}
                label="City"
                value={manager?.dealerLocation}
              />
              <InfoItem
                icon={<FaFlag className="text-indigo-500" />}
                label="State"
                value={manager?.state}
              />
              <InfoItem
                icon={<FaCompactDisc className="text-indigo-500" />}
                label="Company Name"
                value={manager?.companyName}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            <p className="font-semibold">Profession:</p>
            <p>{manager?.profession}</p>
          </div>
          <div>
            <p className="font-semibold">Remarks:</p>
            <p>{manager?.remarks}</p>
          </div>
          <div>
            <p className="font-semibold">GST Number:</p>
            <p>{manager?.gstNumber}</p>
          </div>
          <div>
            <p className="font-semibold">Bank Details:</p>
            <p>Bank Name: {manager?.bankDetails?.bankName}</p>
            <p>Account Number: {manager?.bankDetails?.accountNumber}</p>
            <p>IFSC Code: {manager?.bankDetails?.ifscCode}</p>
          </div>
          <div>
            <p className="font-semibold">Deposits Details:</p>
            <p>Amount: {manager?.depositsDetails?.amount}</p>
            <p>Date: {formatDate(manager?.depositsDetails?.date)}</p>
          </div>
          <div>
            <p className="font-semibold">Auction:</p>
            <p>{manager?.auction}</p>
          </div>
          <div className="w-full">
            <p className="font-semibold">Business Address:</p>
            <p>{manager?.businessAddress}</p>
          </div>
          <div>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"> */}
          <div className="bg-gray-800 rounded-lg p-4 relative">
        <Bar data={barData2} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-300 opacity-30 rounded-lg"></div>
        <h1 className="mt-3 items-center flex mx-auto w-full">Graph By Months</h1>
      </div>

      {/* Yearly Sales Graph */}
      <div className="bg-gray-800 rounded-lg p-4 relative">
        <Bar data={barData} />
        <div className="absolute inset-0 bg-gradient-to-br from-green-300 via-green-400 to-green-300 opacity-30 rounded-lg"></div>
        <h1 className="mt-3 items-center flex mx-auto w-full">Graph By Years</h1>
      </div>
          {/* </div> */}
        </div>
        <div className="p-4 flex flex-wrap gap-5">
          {/* PassportPhoto Section */}
          <div className="w-full md:w-1/2 lg:w-1/4">
            <p className="mb-2 text-sm md:text-base">Passport Photo</p>
            {manager?.docs?.passportPhoto ? (
              <div className="relative">
                {manager?.docs?.passportPhoto.includes(".pdf") ? (
                  <embed
                    src={manager?.docs?.passportPhoto}
                    type="application/pdf"
                    className="w-full h-[500px] object-cover"
                  />
                ) : (
                  <img
                    src={manager?.docs?.passportPhoto}
                    alt="Preview"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            ) : (
              <p className="text-gray-500">No Passport Photo Uploaded</p>
            )}
          </div>

          {/* AdharCard Section */}
          <div className="w-full md:w-1/2 lg:w-1/4">
            <p className="mb-2 text-sm md:text-base">Aadhar Card</p>
            {manager?.docs?.adharCard ? (
              <div className="relative">
                {manager?.docs?.adharCard.includes(".pdf") ? (
                  <embed
                    src={manager?.docs?.adharCard}
                    type="application/pdf"
                    className="w-full h-[500px] object-cover"
                  />
                ) : (
                  <img
                    src={manager?.docs?.adharCard}
                    alt="Preview"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            ) : (
              <p className="text-gray-500">No Aadhar Card Uploaded</p>
            )}
          </div>

          {/* PanCard Section */}
          <div className="w-full md:w-1/2 lg:w-1/4">
            <p className="mb-2 text-sm md:text-base">PAN Card</p>
            {manager?.docs?.panCard ? (
              <div className="relative">
                {manager?.docs?.panCard.includes(".pdf") ? (
                  <embed
                    src={manager?.docs?.panCard}
                    type="application/pdf"
                    className="w-full h-[500px] object-cover"
                  />
                ) : (
                  <img
                    src={manager?.docs?.panCard}
                    alt="Preview"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            ) : (
              <p className="text-gray-500">No PAN Card Uploaded</p>
            )}
          </div>

          {/* DealerAgreement Section */}
          <div className="w-full md:w-1/2 lg:w-1/4">
            <p className="mb-2 text-sm md:text-base">Dealer Agreement</p>
            {manager?.docs?.dealerAgreement ? (
              <div className="relative">
                {manager?.docs?.dealerAgreement.includes(".pdf") ? (
                  <embed
                    src={manager?.docs?.dealerAgreement}
                    type="application/pdf"
                    className="w-full h-[500px] object-cover"
                  />
                ) : (
                  <img
                    src={manager?.docs?.dealerAgreement}
                    alt="Preview"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            ) : (
              <p className="text-gray-500">No Dealer Agreement Uploaded</p>
            )}
          </div>

          {/* SolarAgreement Section */}
          <div className="w-full md:w-1/2 lg:w-1/4">
            <p className="mb-2 text-sm md:text-base">Solar Agreement</p>
            {manager?.docs?.solarAgreement ? (
              <div className="relative">
                {manager?.docs?.solarAgreement.includes(".pdf") ? (
                  <embed
                    src={manager?.docs?.solarAgreement}
                    type="application/pdf"
                    className="w-full h-[500px] object-cover"
                  />
                ) : (
                  <img
                    src={manager?.docs?.solarAgreement}
                    alt="Preview"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            ) : (
              <p className="text-gray-500">No Solar Agreement Uploaded</p>
            )}
          </div>

          {/* Other Attachments Section */}
          <div className="w-full">
            <label
              className="mb-2.5 block text-black dark:text-white"
              htmlFor="siteDocuments"
            >
              Other Attachments
            </label>
            <div className="mt-2">
              {manager?.otherdocs?.length > 0 ? (
                manager?.otherdocs.map((item, index) => (
                  <div className="mt-1" key={index}>
                    {item.includes(".pdf") ? (
                      <embed
                        src={item}
                        type="application/pdf"
                        className="w-full h-[500px] object-cover"
                      />
                    ) : (
                      <img
                        src={item}
                        alt="Preview"
                        className="w-full h-auto object-cover"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No Other Attachments Uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-300 truncate">
        {label}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export default DealerProfile;

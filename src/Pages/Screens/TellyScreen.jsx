import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FaSearch } from "react-icons/fa";
import { Telly } from "../../api/call";
import { format } from 'date-fns';
import { FaTimes, FaTrash } from "react-icons/fa";

const TellyScreen = () => {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState([]);
  const [entryTotal, setEntryTotal] = useState(0);
  const [exitTotal, setExitTotal] = useState(0);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchVisible, setSearchVisible] = useState(false); // State to manage search visibility
  const userid = localStorage.getItem("uid")
  const fetchAllEntery = async () => {
    try {
      const getAllTelly = await Telly.getall()
      
      if (getAllTelly.data.data.length > 0) {
        setEntries(getAllTelly.data.data);
        setEntryTotal(getAllTelly.data.data.reduce((acc, entry) => acc + entry.enter, 0))
        setExitTotal(getAllTelly.data.data.reduce((acc, entry) => acc + entry.exit, 0))
      } 
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  useEffect(() => {
    fetchAllEntery()
  }, []);



  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearchTerm(""); // Clear search term when toggling
  };

  const handleEntry = async() => {
  
    if (item && amount) {

      const newEntry = {
        itemName:item,
        enter: parseFloat(amount),
        exit: 0,
        total: parseFloat(amount),
        accountantId:userid
      };
      console.log("newEntry",newEntry);
      
      const ResponseData = await Telly.addtelly(newEntry)
      if (ResponseData.data.data) {
        
        fetchAllEntery()
      }
      setItem("");
      setAmount("");
    }
  };

  const handleExit = async () => {
    if (item && amount) {

      const newEntry = {
        itemName:item,
        enter: 0,
        exit: parseFloat(amount),
        total: parseFloat(amount),
        accountantId:userid,

      };
      const ResponseData = await Telly.addtelly(newEntry)
      if (ResponseData.data.data) {
        
        fetchAllEntery()
      }

      setItem("");
      setAmount("");


    }
  };
  const handleDeleteClick = async (index) => {
    const entryToDelete = entries[index]; 
  
    try {
     const Responsedata =  await Telly.deletetelly(entryToDelete._id);
  if (Responsedata) {
    console.log("Responsedata",Responsedata);
    
  }
      const updatedEntries = entries.filter((_, i) => i !== index);
      setEntries(updatedEntries);
  
      const newEntryTotal = updatedEntries.reduce((acc, entry) => acc + entry.enter, 0);
      const newExitTotal = updatedEntries.reduce((acc, entry) => acc + entry.exit, 0);
  
      setEntryTotal(newEntryTotal);
      setExitTotal(newExitTotal);
  
  
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };
  
  const calculateTotal = () => {
    return entries.reduce((acc, entry) => acc + entry.enter - entry.exit, 0);
  };
  const handleExportData = () => {
    const filteredEntries = entries.filter((entry) => {
      const entryDateTime = new Date(entry.createdAt); // Use createdAt for filtering
      const startDateTime = rangeStart
        ? new Date(`${rangeStart}T00:00:00`)
        : null;
      const endDateTime = rangeEnd
        ? new Date(`${rangeEnd}T23:59:59`)
        : null;
  
      return (
        (!startDateTime || entryDateTime >= startDateTime) &&
        (!endDateTime || entryDateTime <= endDateTime)
      );
    });
  
    const data = filteredEntries.map((entry, index) => ({
      SrNo: index + 1,
      ItemName: entry.itemName,
      Amount: entry.enter + entry.exit,
      Entry: entry.enter,
      Exit: entry.exit,
      Date: new Date(entry.createdAt).toISOString().replace("T", " ").split(".")[0], // Format date
      Total: entry.enter - entry.exit,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");
  
    // Generate and download the Excel file
    XLSX.writeFile(workbook, "entries.xlsx");
    setShowExportModal(false); 
  };
  

  // Function to filter entries based on the search term
  const filteredEntries = entries.filter((entry) =>
    entry.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        Accountant Manager
      </h1>


      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"></div>
      <div className="flex items-center space-x-2">
        {searchVisible ? (
          <div className="relative flex-grow">
            <input
              type="text"
              style={{ width: "100%", marginBottom: "10px" }}
              placeholder="Search by item name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full sm:w-auto "
            />
            <button
              onClick={toggleSearch}
              className="absolute top-6 transform -translate-y-1/2 right-2 text-gray-600 hover:text-gray-900 mb-12"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>

      {!searchVisible && (
        <div className="flex flex-col md:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-6 gap-5 justify-between">
          <button
            onClick={toggleSearch}
            className="text-gray-600 hover:text-gray-900"
          >
            <FaSearch size="1.5em" />
          </button>
          <div className="space-x-3">
            <input
              type="text"
              placeholder="Enter item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full sm:w-auto bg-white dark:bg-boxdark"
            />
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full sm:w-auto bg-white dark:bg-boxdark"
            />
          </div>

          <div className="space-x-3">
            <button
              style={{ width: "90px" }}
              onClick={handleEntry}
              className="bg-green-500 text-white p-2 rounded w-full sm:w-auto"
            >
              Entry
            </button>
            <button
              style={{ width: "90px" }}
              onClick={handleExit}
              className="bg-red-500 text-white p-2 rounded w-full sm:w-auto"
            >
              Exit
            </button>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto"
          >
            Export to Excel
          </button>
        </div>
      )}

      <div className="flex-grow overflow-auto">
        <table className="w-full border-collapse border border-gray-200 mb-4 sm:mb-6">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Sr. No.</th>
              <th className="border border-gray-300 p-2 text-left">Date</th>
              <th className="border border-gray-300 p-2 text-left">
                Item Name
              </th>
              <th className="border border-gray-300 p-2 text-left bg-green-400 dark:text-gray">
                Enter
              </th>
              <th className="border border-gray-300 p-2 text-left bg-red-400 dark:text-gray ">
                Exit
              </th>
              <th className="border border-gray-300 p-2 text-left">Total</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>

            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{format(entry.createdAt, "yyyy-MM-dd HH:mm:ss")}</td>
                <td className="border border-gray-300 p-2">{entry.itemName}</td>
                <td
                  className={`border border-gray-300 p-2 dark:text-black ${
                    index % 2 === 0 ? "bg-green-300" : "bg-green-200"
                  }`}
                >
                  {entry.enter}
                </td>
                <td
                  className={`border border-gray-300 p-2 dark:text-black ${
                    index % 2 === 0 ? "bg-red-200" : "bg-red-300"
                  }`}
                >
                  {entry.exit}
                </td>
                <td
                  className={`border border-gray-300 p-2 ${
                    entry.enter - entry.exit < 0 ? "bg-red-500 text-white" : ""
                  }`}
                >
                  {entry.enter - entry.exit}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeleteClick(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sticky Footer for Totals */}
      <div className="border-t border-gray-300 p-4 bg-white dark:bg-boxdark sticky bottom-0">
        <div className="flex justify-between">
          <span className="font-bold">Total Entry:</span>
          <span>{entryTotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Total Exit:</span>
          <span>{exitTotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Overall Total:</span>
          <span>{calculateTotal()}</span>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <FaTimes size="1.5em" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Select Date Range
            </h2>
           
            <input
              type="date"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-2"
            />
            <input
              type="date"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleExportData}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Export Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TellyScreen;

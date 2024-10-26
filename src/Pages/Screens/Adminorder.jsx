/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { common } from "../../api/call.js";
import { SlCalender } from "react-icons/sl";
import { GrStatusGood } from "react-icons/gr";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTag,
  FaDollarSign,
  FaCalendarAlt,
  FaInfoCircle,
  FaHome,
  FaShoppingCart,
} from "react-icons/fa";
import { FaSolarPanel } from "react-icons/fa";
import { GiElectric } from "react-icons/gi";
import { MdPeopleOutline } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Adminorder = ({
  orderData,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const [stateFilter, setStateFilter] = useState("");
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Function to update the column value
  const updateColumn = (id, newColumn) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, column: newColumn } : card
      )
    );
  };

  useEffect(() => {


    fetchOrders();
  }, [orderData]); 

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found in local storage");
      setIsLoading(false);
      return;
    }

    try {
      const data = orderData;
      console.log("orderData",orderData);
      
      // Use the orderData prop/state or fetched data

      if (Array.isArray(data)) {
        // Filter based on state
        const filteredData = data.filter((item) => {
          // Check if the selected state filter matches the item's state
          return stateFilter
            ? item.clientLocation?.state === stateFilter
            : true;
        });
        console.log("stateFilter",stateFilter);


        const extractedData = filteredData.map((item) => {
          const typeOfLead = item.typeOfLead;
          let column = "backlog";

          if (typeOfLead === "Quotation") column = "todo";
          else if (typeOfLead === "HotPipeline") column = "doing";
          else if (typeOfLead === "OrderCount") column = "done";
          else if (typeOfLead === "Lead") column = "backlog";
          else if (typeOfLead === "Lost") column = "lost";

          return {
            id: item._id,
            name:
              item.orderBy !== "Customer"
                ? item.clientName
                : item.userid?.name,
            orderid: item.orderNumber,
            phonenumber:
              item.orderBy !== "Customer"
                ? item.contactNumber
                : item.userid?.phonenumber,
            bill: item.lightbill,
            email:
              item.orderBy !== "Customer"
                ? item.clientEmail
                : item.userid?.email,
            address:
              item.orderBy !== "Customer"
                ? item.clientAddress
                : item.userid?.villageorcity,
            column: column, // Assign the dynamic column
            discomOption: item.discomOption,
            documentProblem: item.documentProblem,
            conformKilowatt: item.conformKilowatt,
            lightbillAttachment: item.lightbillAttachment,
            monthlyBills: item.monthlyBills,
            remarks: item.remarks,
            sensionLoan: item.sensionLoan,
            shadowFreeArea: item.shadowFreeArea,
            typeOfLead: typeOfLead,
            solarSystemType: item.solarSystemType,
            orderBy: item.orderBy,
            applicationForm: item.applicationForm,
            clientLocation: item.clientLocation,
            orderNumber: item.orderNumber,
            typeOfSolarSystem: item.typeOfSolarSystem,
            inverterCompanyName: item.inverterCompanyName,
            dispatchDate: item.dispatchDate,
            installerName: item.installerName,
            installerPrice: item.installerPrice,
            projectCompletionDate: item.projectCompletionDate,
            username: item.username,
            wifiConfiguration: item.wifiConfiguration,
            designConformation: item.designConformation,
            followupStatus: item.followupStatus,
            advanceAmount: item.advanceAmount,
            expectedKilowatt: item.expectedKilowatt,
            followupComment: item.followupComment,
            followupDate:item.followupDate,
            estimatedDispatchDate:item.estimatedDispatchDate,
          };
        });
        console.log("extractedData",extractedData);


        setCards(extractedData); // Update the cards state
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-h-screen w-full bg-graydark text-neutral-50 overflow-auto">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {cards.length <= 0 && <p>Order Not Found</p>}
      {!isLoading && !error && (
        <Board
          cards={cards}
          setCards={setCards}
          updateColumn={updateColumn} // Pass the updateColumn function to Board
          stateFilter={stateFilter}
          navigate={navigate}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

const Board = ({
  cards,
  setCards,
  stateFilter,
  navigate,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  // State for pagination
  const cardsPerPage = 10; // You can adjust this number

  // Filter cards based on the stateFilter
  const filteredCards = cards;

  // Paginate the filtered cards
  const paginatedCards = cards

  const calculatePercentage = () => {
    if (filteredCards.length === 0) return { overdue: 0, onTime: 0 };

    const currentDate = new Date();
    const totalCards = filteredCards.length;

    const overdue = filteredCards.filter(
      (card) =>
        new Date(card.followupDate) < currentDate &&
        card.followupStatus === "No"
    ).length;
    const onTime = totalCards - overdue;

    return {
      overdue: ((overdue / totalCards) * 100).toFixed(2),
      onTime: ((onTime / totalCards) * 100).toFixed(2),
    };
  };

  const { overdue, onTime } = calculatePercentage();

  const calculatePercentageByColumn = (column) => {
    const columnCards = filteredCards.filter((card) => card.column === column);
    if (columnCards.length === 0) return { overdue: 0, onTime: 0 };

    const currentDate = new Date();
    const totalCards = columnCards.length;

    const overdue = columnCards.filter(
      (card) =>
        new Date(card.followupDate) < currentDate &&
        card.followupStatus === "No"
    ).length;
    const onTime = totalCards - overdue;

    return {
      overdue: ((overdue / totalCards) * 100).toFixed(2),
      onTime: ((onTime / totalCards) * 100).toFixed(2),
    };
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchOrders()
  };


  return (
    <div className="flex h-full w-full flex-col">
      {/* Display overall percentages at the top */}
      <div className="flex justify-between p-4 bg-gray-800 text-white">
        <div className="flex items-center">
          <span className="text-lg font-bold">Overall Progress:</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <span className="text-red-500 font-semibold">
              {overdue}% Overdue
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 font-semibold">
              {onTime}% On-Time
            </span>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="flex h-full w-full overflow-auto p-12 justify-between">
        <ToastContainer />
        <Column
          title="Lead"
          column="backlog"
          headingColor="text-white"
          cards={paginatedCards.filter((card) => card.column === "backlog")}
          setCards={setCards}
          percentages={calculatePercentageByColumn("backlog")}
          navigate={navigate}
        />
        <Column
          title="Quotation"
          column="todo"
          headingColor="text-white"
          cards={paginatedCards.filter((card) => card.column === "todo")}
          setCards={setCards}
          percentages={calculatePercentageByColumn("todo")}
          navigate={navigate}
        />
        <Column
          title="Hot Pipeline"
          column="doing"
          headingColor="text-white"
          cards={paginatedCards.filter((card) => card.column === "doing")}
          setCards={setCards}
          percentages={calculatePercentageByColumn("doing")}
          navigate={navigate}
        />
        <Column
          title="Order Count"
          column="done"
          headingColor="text-white"
          cards={paginatedCards.filter((card) => card.column === "done")}
          setCards={setCards}
          percentages={calculatePercentageByColumn("done")}
          navigate={navigate}
        />
        <Column
          title="Lost"
          column="lost"
          headingColor="text-white"
          cards={paginatedCards.filter((card) => card.column === "lost")}
          setCards={setCards}
          percentages={calculatePercentageByColumn("lost")}
          navigate={navigate}
        />
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center my-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg font-bold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
  percentages,
  navigate,
}) => {
  const [active, setActive] = useState(false);
  // const [active, setActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [complaint, setComplaint] = useState("");

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = async (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const targetColumn = element.closest("[data-column]")?.dataset.column;
    if (targetColumn === "lost") {
      setSelectedCard(cardId);
      setIsModalOpen(true);
      // return; // Stop further processing
    }

    if (!targetColumn) return;

    // Optimistic UI update: Change column locally
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, column: targetColumn } : card
      )
    );

    let typeOfLead = "";
    if (targetColumn === "backlog") typeOfLead = "Lead";
    else if (targetColumn === "todo") typeOfLead = "Quotation";
    else if (targetColumn === "doing") typeOfLead = "HotPipeline";
    else if (targetColumn === "done") typeOfLead = "OrderCount";
    else if (targetColumn === "lost") typeOfLead = "Lost";

    const data = {
      orderId: cardId,
      data: { typeOfLead },
    };

    try {
      // Backend update
      const response = await common.verifyStoke(data);
      if (response.data.data) {
        console.log("Updated successfully", response.data.data);
        toast.success("Updated order successfully!");
      } else {
        throw new Error("Failed to update order.");
      }
    } catch (error) {
      // Revert the UI on error
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, column: card.previousColumn } : card
        )
      );
      toast.error("Failed to update order.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = () => {
    const indicators = getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  const handleSubmit = async () => {
    if (selectedCard) {
      const data = {
        orderId: selectedCard, // Use selectedCard instead of cardId
        data: { lostReason: complaint },
      };

      try {
        // Backend update
        const response = await common.verifyStoke(data);
        if (response.data.data) {
          console.log("Updated successfully", response.data.data);
          toast.success("Updated order successfully!");

          // Update the card's column to "lost" after a successful backend update
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === selectedCard
                ? { ...card, column: "lost", typeOfLead: "Lost" }
                : card
            )
          );
        } else {
          throw new Error("Failed to update order.");
        }
      } catch (error) {
        // Handle any error that occurred during the backend update
        toast.error("Failed to update order.");
      } finally {
        // Close modal and reset state
        setIsModalOpen(false);
        setComplaint(""); // Reset complaint text
        setSelectedCard(null); // Reset selected card
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setComplaint("");
    // Reset complaint text
    // No need to reset selectedCard or change column state here
    // selectedCard remains as is, and so does the column state
  };

  // Inside your return statement
  return (
    <div className="w-60 gap-2 shrink-0">
      <div className="flex items-center justify-evenly mb-2">
        <span className="text-sm text-red-500">{percentages.overdue}%</span>
        <span className="text-sm text-green-400">{percentages.onTime}%</span>
      </div>
      <div className="mb-2 flex items-center justify-center">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm ml-2 text-white">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"
          }`}
      >
        {filteredCards.map((c) => (
          <Card
            key={c.id}
            {...c}
            handleDragStart={handleDragStart}
            navigate={navigate}
          />
        ))}
        <DropIndicator beforeId={null} column={column} />
      </div>

      {/* Modal for complaint logging */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Log Complaint
            </h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Enter your complaint"
              rows="4"
            />
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={handleCloseModal} // This will not change the card's column
              >
                &times; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-1 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const Card = ({
  id,
  bill,
  name,
  email,
  phonenumber,
  address,
  orderid,
  salesManager,
  conformKilowatt,
  solarSystemType,
  typeOfSolarSystem,
  discomOption,
  documentProblem,
  lightbillAttachment, // Ensure this is a URL or image path
  monthlyBills, // Ensure this is a URL or image path
  remarks,
  sensionLoan,
  shadowFreeArea,
  typeOfLead,
  applicationForm,
  clientLocation,
  orderNumber,
  inverterCompanyName,
  dispatchDate,
  installerName,
  installerPrice,
  projectCompletionDate,
  username,
  wifiConfiguration,
  designConformation,
  imageUrl, // Ensure this is a URL or image path
  handleDragStart,
  followupDate,
  followupStatus,
  navigate,
  expectedKilowatt,
  followupComment,
  advanceAmount,
  estimatedDispatchDate
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {
    const intervalId = setInterval(5000); // 5000 ms = 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [typeOfLead]);

  return (
    <>
      <DropIndicator beforeId={id} column="backlog" />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { id })}
        onClick={openModal}
        className="cursor-pointer rounded border border-neutral-700 bg-neutral-800 p-4 shadow-md transition-transform transform hover:scale-105 mr-2"
      >
        {/* Display image if available */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="mb-2 w-full h-32 object-cover rounded"
          />
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          <div className="flex items-center">
            <FaUser className="text-blue-500 mr-2" />
            <p className="text-[12px] text-neutral-100 font-medium">{name}</p>
          </div>
          <div className="flex items-center">
            <FaShoppingCart className="text-yellow-500 mr-2" />
            <p className="text-sm text-neutral-300">{orderNumber}</p>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <p className="text-sm text-neutral-300">{address}</p>
          </div>

          <div className="flex items-center">
            <GiElectric className="text-purple-500 mr-2" />
            <p className="text-sm text-neutral-300">
              {formatKilowatt(conformKilowatt)}
            </p>
          </div>
          <div className="flex items-center">
            <FaSolarPanel className="text-purple-500 mr-2" />
            <p className="text-sm text-neutral-300">{solarSystemType}</p>
          </div>
          <div className="flex items-center">
            <SlCalender className="text-green-500 mr-2" />
            <p className="text-sm text-neutral-300">
              {followupDate ? formatDate(followupDate) : "Pending"}
            </p>
          </div>
          <div className="flex items-center">
            <GrStatusGood className="text-amber-600 mr-2" />
            <p className="text-sm text-neutral-300">{followupStatus}</p>
          </div>
        </div>
      </motion.div>
      {isModalOpen && (
        <Modal
          name={name}
          email={email}
          phonenumber={phonenumber}
          address={address}
          orderid={orderid}
          salesManager={salesManager}
          conformKilowatt={conformKilowatt}
          solarSystemType={solarSystemType}
          typeOfSolarSystem={typeOfSolarSystem}
          discomOption={discomOption}
          documentProblem={documentProblem}
          lightbillAttachment={lightbillAttachment} // Pass the image URL
          monthlyBills={monthlyBills} // Pass the image URL
          remarks={remarks}
          sensionLoan={sensionLoan}
          shadowFreeArea={shadowFreeArea}
          typeOfLead={typeOfLead}
          applicationForm={applicationForm}
          clientLocation={clientLocation}
          orderNumber={orderNumber}
          inverterCompanyName={inverterCompanyName}
          dispatchDate={dispatchDate}
          installerName={installerName}
          installerPrice={installerPrice}
          projectCompletionDate={projectCompletionDate}
          username={username}
          wifiConfiguration={wifiConfiguration}
          designConformation={designConformation}
          closeModal={closeModal}
          navigate={navigate}
          followupDate={followupDate}
          followupStatus={followupStatus}
          advanceAmount={advanceAmount}
          expectedKilowatt={expectedKilowatt}
          followupComment={followupComment}
          estimatedDispatchDate={estimatedDispatchDate}
        />
      )}
    </>
  );
};

const Modal = ({
  closeModal,
  name,
  email,
  phonenumber,
  address,
  orderid,
  salesManager,
  conformKilowatt,
  solarSystemType,
  typeOfSolarSystem,
  discomOption,
  documentProblem,
  lightbillAttachment,
  monthlyBills,
  remarks,
  sensionLoan,
  shadowFreeArea,
  typeOfLead,
  applicationForm,
  clientLocation,
  orderNumber,
  inverterCompanyName,
  dispatchDate,
  installerName,
  installerPrice,
  projectCompletionDate,
  username,
  wifiConfiguration,
  designConformation,
  navigate,
  followupDate,
  followupStatus,
  advanceAmount, expectedKilowatt, followupComment,
  estimatedDispatchDate
}) => {
  const [role, setRole] = useState("");
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  console.log(role);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={closeModal}
      ></div>
      <div className="relative bg-black text-white rounded-lg p-3 lg:mt-25 lg:ml-50 sm:ml-0 sm:mt-72 shadow-lg w-full md:w-11/12 lg:w-9/12 xl:w-full max-w-4xl">
        {(role === "SALESMANAGER" || role === "STATEMANAGER") && (
          <div className="flex justify-end mt-[-15px] mr-2 cursor-pointer">
            {role === "SALESMANAGER" ? (
              <span
                className="bg-graydark px-3 py-1.5"
                onClick={() =>
                  navigate("/addsalesorder", {
                    state: {
                      name,
                      email,
                      phonenumber,
                      address,
                      orderid,
                      salesManager,
                      conformKilowatt,
                      solarSystemType,
                      typeOfSolarSystem,
                      discomOption,
                      documentProblem,
                      lightbillAttachment,
                      monthlyBills,
                      remarks,
                      sensionLoan,
                      shadowFreeArea,
                      typeOfLead,
                      applicationForm,
                      clientLocation,
                      orderNumber,
                      inverterCompanyName,
                      dispatchDate,
                      installerName,
                      installerPrice,
                      projectCompletionDate,
                      username,
                      wifiConfiguration,
                      designConformation,
                      followupDate,
                      followupStatus,
                      advanceAmount, expectedKilowatt, followupComment,
                      estimatedDispatchDate
                    },
                  })
                }
              >
                Edit
              </span>
            )  : (
              <span
                className="bg-graydark px-3 py-1.5"
                onClick={() =>
                  navigate("/addstateorder", {
                    state: {
                      name,
                      email,
                      phonenumber,
                      address,
                      orderid,
                      salesManager,
                      conformKilowatt,
                      solarSystemType,
                      typeOfSolarSystem,
                      discomOption,
                      documentProblem,
                      lightbillAttachment,
                      monthlyBills,
                      remarks,
                      sensionLoan,
                      shadowFreeArea,
                      typeOfLead,
                      applicationForm,
                      clientLocation,
                      orderNumber,
                      inverterCompanyName,
                      dispatchDate,
                      installerName,
                      installerPrice,
                      projectCompletionDate,
                      username,
                      wifiConfiguration,
                      designConformation,
                      followupDate, followupComment,
                      followupStatus, advanceAmount, expectedKilowatt,
                      estimatedDispatchDate
                    },
                  })
                }
              >
                Edit
              </span>
            )}
          </div>
        )}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-200"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center">
            <FaUser className="text-blue-500 mr-2" />
            <p className="text-sm font-medium">{name}</p>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="text-gray-500 mr-2" />
            <p className="text-sm">{email}</p>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-green-500 mr-2" />
            <p className="text-sm">{phonenumber}</p>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <p className="text-sm">{address}</p>
          </div>
          <div className="flex items-center">
            <FaTag className="text-purple-500 mr-2" />
            <p className="text-sm">Order ID: {orderid}</p>
          </div>
          <div className="flex items-center">
            <FaTag className="text-teal-500 mr-2" />
            <p className="text-sm">Conform Kilowatt: {conformKilowatt} kW</p>
          </div>
          <div className="flex items-center">
            <FaTag className="text-blue-500 mr-2" />
            <p className="text-sm">Type of Project: {solarSystemType}</p>
          </div>
          <div className="flex items-center">
            <FaTag className="text-cyan-500 mr-2" />
            <p className="text-sm">Type of Solar System: {typeOfSolarSystem}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Discom Option: {discomOption}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Remarks: {remarks}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Sension Loan: {sensionLoan}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Shadow Free Area: {shadowFreeArea}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Type of Lead: {typeOfLead}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Order Number: {orderNumber}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Inverter Company Name: {inverterCompanyName}</p>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-blue-500 mr-2" />
            <p className="text-sm">Dispatch Date: {dispatchDate}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Installer Name: {installerName}</p>
          </div>
          <div className="flex items-center">
            <FaDollarSign className="text-green-500 mr-2" />
            <p className="text-sm">Installer Price: {installerPrice}</p>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-red-500 mr-2" />
            <p className="text-sm">Project Completion Date: {projectCompletionDate}</p>
          </div>
          <div className="flex items-center">
            <FaUser className="text-gray-500 mr-2" />
            <p className="text-sm">Username: {username}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Wifi Configuration: {wifiConfiguration}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Design Conformation: {designConformation}</p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">
              Follow up date: {formatDate(followupDate)}
            </p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="text-gray-500 mr-2" />
            <p className="text-sm">Follow up Status : {followupStatus}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export const formatKilowatt = (kilowatt) => {
  if (typeof kilowatt !== "number" || isNaN(kilowatt)) {
    return "N/A";
  }
  if (kilowatt >= 1000) {
    return `${(kilowatt / 1000).toPrecision(2)} KW`;
  }
  return `${kilowatt.toPrecision(3)} kW`;
};

export default Modal;

const formatDate = (date) => {
  const jsDate = new Date(date);

  const day = jsDate.getDate().toString().padStart(2, "0");
  const month = (jsDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = jsDate.getFullYear();

  return `${day}-${month}-${year}`;
};

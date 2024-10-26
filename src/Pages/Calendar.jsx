import { useEffect, useState } from "react";
import {
  format,
  parseISO,
  getDaysInMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
} from "date-fns";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { order, Sales } from "../api/call";

const Calendar = () => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [loading, setLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [followupData, setFollowupData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFollowup, setSelectedFollowup] = useState(null);
  const role = localStorage.getItem("role");
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    if (role === "ADMIN") {
      fetchManagers();
    }
    if (role === "SALESMANAGER") {
      fetchSalesmanagerorder(uid);
    }
  }, [role]);

  const fetchSalesmanagerorder = async (uid) => {
    try {
      setCalendarLoading(true);
      const response = await order.salesorderbyid(uid);
      const followupData = response.data.data ? response.data.data : [];
      setFollowupData(followupData);
    } catch (error) {
      console.error("Error fetching sales order:", error);
    } finally {
      setCalendarLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await Sales.allmanager();
      if (response.data.data) {
        setManagers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedManager) {
      alert("Please select a manager");
      return;
    }
    try {
      setCalendarLoading(true);
      const response = await order.salesorderbyid(selectedManager);
      const followupData = response.data.data ? response.data.data : [];
      console.log("followupData", response.data.data);

      setFollowupData(followupData);
    } catch (error) {
      console.error("Error fetching sales order:", error);
    } finally {
      setCalendarLoading(false);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );
  };

  // Function to handle click on followup date
  const handleDateClick = (followup) => {
    setSelectedFollowup(followup);
  };

  // Function to close the popup
  const closePopup = () => {
    setSelectedFollowup(null);
  };

  return (
    <>
      <Breadcrumb pageName="Calendar" />
      {role === "ADMIN" && (
        <form
          onSubmit={handleSubmit}
          className="flex gap-4 justify-around items-center"
        >
          <div className="flex w-[350px]">
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              className="rounded-md border-2 border-gray-300 p-2 w-full dark:bg-boxdark"
              required
            >
              <option value="" disabled>
                Select a manager
              </option>
              {managers.map((manager, index) => (
                <option key={index} value={manager._id}>
                  {manager.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex">
            <button
              type="submit"
              className="bg-[#57B33E] text-white py-2 px-4 w-29 rounded-md hover:bg-[#4a9f33]"
            >
              {calendarLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      )}
      <div className="my-4 flex justify-between">
        <button onClick={handlePrevMonth} className="p-2 bg-gray-200 rounded">
          Previous Month
        </button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={handleNextMonth} className="p-2 bg-gray-200 rounded">
          Next Month
        </button>
      </div>

      {/* Calendar Table */}
      <div className="w-full max-w-full my-3 rounded-sm border border-stroke bg-white dark:bg-boxdark shadow-default">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 bg-green-600 text-white">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <th key={day} className="p-2 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="grid grid-cols-7 ">
              {daysInMonth.map((day, index) => {
                // Use optional chaining to safely access followupDate and check if it's valid
                const followup = followupData.length
                  ? followupData.find((f) => {
                    const followupDate = f?.followupDate;
                    // Check if followupDate exists before formatting
                    return followupDate
                      ? format(parseISO(followupDate), "yyyy-MM-dd") ===
                      format(day, "yyyy-MM-dd")
                      : false;
                  })
                  : null;

                const isPastDate = isBefore(day, new Date());
                const isRed =
                  followup && isPastDate && followup?.followupStatus === "No";
                const isGreen =
                  followup &&
                  (!isPastDate || followup?.followupStatus !== "No");

                return (
                  <td
                    key={index}
                    className={`border p-2 text-center relative ${isRed ? "bg-red-300" : isGreen ? "bg-green-300" : ""
                      }`}
                    onClick={() => followup && handleDateClick(followup)}
                    style={{ cursor: followup ? "pointer" : "default" }}
                  >
                    {format(day, "d")}
                    {followup && (
                      <div
                        className={`absolute top-0 right-0 p-1 text-xs rounded-full ${isRed ? "bg-red-500" : "bg-green-500"
                          } text-white`}
                      >
                        •
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Popup for followup details */}
      {selectedFollowup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Followup Details</h3>
            <p>
              <strong>Date:</strong>{" "}
              {format(parseISO(selectedFollowup.followupDate), "PPP")}
            </p>
            <p>
              <strong>Comment:</strong> {selectedFollowup.followupComment}
            </p>
            <p>
              <strong>Status:</strong> {selectedFollowup.followupStatus}
            </p>
            <button
              onClick={closePopup}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;

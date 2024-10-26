import React, { useState, useEffect, useCallback } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaFlag,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaCompactDisc } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  Polyline,
  InfoWindowF,
} from "@react-google-maps/api";
import { MdKeyboardBackspace } from "react-icons/md";
import { common, Maintenance } from "../../api/call";
import user from "../../../src/images/icon/user.png";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import { RiFileExcel2Fill } from "react-icons/ri";
import * as XLSX from 'xlsx';

const MaintainaneceProfile = () => {
  const location = useLocation();
  const manager = location.state?.manager;
  const role = localStorage.getItem("role");
  const [editPosition, setEditPosition] = useState(manager?.position || "");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const center = {
    lat: 23.069319571994537,
    lng: 72.6736779148723,
  };

  const [mapCenter, setMapCenter] = useState(center);
  const [loading, setLoading] = useState(false); // New loader state

  const navigate = useNavigate();
  useEffect(() => {
    if (manager) {
      fetchAttendance(selectedDate);
    }
  }, [manager]);

  const fetchAttendance = async (date) => {
    setLoading(true); // Show loader before fetching data
    try {
      const data = {
        userId: manager._id,
        startDate: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        endDate: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
      };
      const response = await common.attendance(data);
      if (response.status && response.data.data.length > 0) {
        setAttendanceData(response.data.data[0].coordinates || []);
        if (response.data.data[0]?.coordinates.length > 0) {
          setMapCenter({
            lat: response.data.data[0]?.coordinates[0]?.latitude || center.lat,
            lng: response.data.data[0]?.coordinates[0]?.longitude || center.lng,
          });
          toast.success("Attendance data Found");
        }
      } else {
        toast.error("NO Attendance data Found");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
    setLoading(false); // Hide loader after fetching data
  };

  if (!manager) {
    return (
      <div className="text-center text-xl text-gray-600 dark:text-gray-400 mt-10">
        No manager data available
      </div>
    );
  }

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);
    },
    [center]
  );

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmitDate = () => {
    fetchAttendance(selectedDate);

    setIsDatePickerOpen(false);
  };

  const handleMarkerClick = (markerIndex) => {
    setActiveMarker(markerIndex);
  };

  const handlePopupClose = () => {
    setActiveMarker(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        position: editPosition,
      };

      const response = await Maintenance.updateManager(manager._id, data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to update position", error);
    }
    setIsEditing(false);
  };
  const barData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: "Kilowatt Sales",
        data: [1065, 1259, 1080, 981, 1156],
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const barData2 = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Kilowatt Sales",
        data: [65, 59, 80, 81, 56, 55, 35, 40, 90, 21, 22, 36],
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const handleExportAttendance = () => {
    if (attendanceData.length === 0) {
      toast.error("No attendance data to export");
      return;
    }

    const attendanceExportData = attendanceData.map((entry, index) => ({
      'S.No': index + 1,
      Date: new Date(entry.timestamp).toLocaleDateString(),
      Time: new Date(entry.timestamp).toLocaleTimeString(),
      Latitude: entry.latitude,
      Longitude: entry.longitude,
    }));

    const worksheet = XLSX.utils.json_to_sheet(attendanceExportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Data');

    XLSX.writeFile(workbook, `Attendance_${manager.name || 'Manager'}.xlsx`);
    toast.success("Attendance data exported successfully");
  };

  return (
    <div className="bg-gradient-to-r  to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <ToastContainer />

      <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-gradient-to-br p-8 flex items-center justify-center">
            {manager.profilephoto ? (
              <>
                <img
                  className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
                  src={manager.profilephoto}
                  alt={manager.name || "Manager"}
                />
              </>
            ) : (
              <>
                <img
                  className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
                  src={user}
                  alt={manager.name || "Manager"}
                />
              </>
            )}
          </div>
          <div className="p-8 flex-grow">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {manager.role}
                </div>
                <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  {manager.name || manager.clientName || "No Name"}
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
                value={manager.email}
              />
              <InfoItem
                icon={<FaPhone className="text-indigo-500" />}
                label="Phone"
                value={manager.phonenumber}
              />
              <InfoItem
                icon={<FaPhone className="text-indigo-500" />}
                label="Aternatephonenumber"
                value={manager.alternatephonenumber}
              />
              <InfoItem
                icon={<FaMapMarkerAlt className="text-indigo-500" />}
                label="Address"
                value={manager.fulladdress}
              />
              <InfoItem
                icon={<FaCity className="text-indigo-500" />}
                label="State"
                value={manager.state}
              />
              <InfoItem
                icon={<FaFlag className="text-indigo-500" />}
                label="District"
                value={manager.district}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            <p className="font-semibold">Subdistrict:</p>
            <p>{manager.subdistrict}</p>
          </div>
          <div>
            <p className="font-semibold">Pincode:</p>
            <p>{manager.pincode}</p>
          </div>
          <div className="flex items-center">
            <p className="font-semibold">Position:</p>
            <p className="ml-2">{editPosition}</p>
            <FaEdit
              className="ml-2 text-indigo-500 cursor-pointer"
              onClick={() => setIsEditing(!isEditing)}
            />
          </div>
          {isEditing && (
            <div className="mt-2">
              <select
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="Junior">Junior </option>
                <option value="Senior">Senior </option>
                <option value="Block">Block </option>
              </select>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                {maintainaneceLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          )}
        </div>
        <div className="p-4">
          <p>Documents :</p>
          <div className="flex w-full">
            {manager.attachdocs.map((doc, index) => (
              <img src={doc.url} alt={doc.name} key={index} className="w-30" />
            ))}
          </div>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="bg-gray-800 rounded-lg p-4 relative">
            <Bar data={barData2} />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-300 opacity-30 rounded-lg"></div>
            <h1 className="mt-3 items-center flex mx-auto w-full">
              Graph By Months
            </h1>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 relative">
            <Bar data={barData} />
            <div className="absolute inset-0 bg-gradient-to-br from-green-300 via-green-400 to-green-300 opacity-30 rounded-lg"></div>
            <h1 className="mt-3 items-center flex mx-auto w-full">
              Graph By Years
            </h1>
          </div>
        </div> */}
      </div>

      <div className="p-8">
        <div className="flex items-center mb-4">
          <FaCalendarAlt
            className="text-indigo-500 mr-2 cursor-pointer"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          />
          <span
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="cursor-pointer"
          >
            {selectedDate.toDateString()}
          </span>
        </div>
        {isDatePickerOpen && (
          <div className="bg-white p-4 rounded-lg shadow-lg mb-4 w-max">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              className="border-none outline-none"
            />
            <button
              onClick={handleSubmitDate}
              className="mt-2 w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-200"
            >
              Submit Date
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-end">
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-3.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center gap-2"
            onClick={handleExportAttendance}
          ><RiFileExcel2Fill />Export Attendance</button>
        </div>
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>{" "}
        </div>
      ) : isLoaded ? (
        <div className="p-4">
          <div className="w-full h-80">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {attendanceData.map((location, index) => (
                <MarkerF
                  key={index}
                  position={{
                    lat: location.latitude + index * 0.0001, // Adjust slightly to avoid overlapping
                    lng: location.longitude + index * 0.0001,
                  }}
                  onClick={() => handleMarkerClick(index)}
                  label={`(${index + 1})`}
                >
                  {activeMarker && activeMarker === index && (
                    <InfoWindowF
                      onCloseClick={handlePopupClose}
                      options={{
                        pixelOffset: new window.google.maps.Size(0, 0), // Adjust the InfoWindow's position above the marker
                        zIndex: 1000, // Ensure that the InfoWindow is always on top
                      }}
                    >
                      <div>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(
                            attendanceData[activeMarker].timestamp
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {new Date(
                            attendanceData[activeMarker].timestamp
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              ))}
              <Polyline
                path={attendanceData.map((location) => ({
                  lat: location.latitude,
                  lng: location.longitude,
                }))}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 1.0,
                  strokeWeight: 2,
                }}
              />
            </GoogleMap>
          </div>
        </div>
      ) : (
        <div className="text-center text-xl text-gray-600 dark:text-gray-400 mt-10">
          Map is not loaded
        </div>
      )}
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

export default MaintainaneceProfile;

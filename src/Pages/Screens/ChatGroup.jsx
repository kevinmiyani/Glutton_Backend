import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Chat.css";
import { Chat } from "../../api/call";
import socketServices from "../../api/Socket"; // Adjust this import path as needed
import { MdPushPin, MdOutlinePushPin, MdHeight } from "react-icons/md";
import Modal from 'react-modal';
import { common } from "../../api/call";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement('#root');
const ChatGroup = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("team");
  const [customerChatRooms, setCustomerChatRooms] = useState([]);
  const [teamsChatRooms, setTeamsChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("uid");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    fetchTeamsChatRooms();
    const userArry = ["SALESMANAGER", "ADMIN"];
    userArry.includes(userRole) && fetchCustomerChatRooms();
    socketServices.on("lastMessageUpdate", fetchTeamsChatRooms);
    socketServices.on("orderUpdated", fetchTeamsChatRooms);
    socketServices.on("lastUserMessageUpdate", fetchCustomerChatRooms);
    socketServices.on("messagesRead", () => {
      fetchCustomerChatRooms();
      fetchTeamsChatRooms();
    });
    socketServices.on("roomPinned", fetchCustomerChatRooms);
    socketServices.on("roomUnpinned", fetchCustomerChatRooms);

    return () => {
      socketServices.removeListener("lastMessageUpdate");
      socketServices.removeListener("orderUpdated");
      socketServices.removeListener("registerUser");
      socketServices.removeListener("lastUserMessageUpdate");
      socketServices.removeListener("roomPinned");
      socketServices.removeListener("roomUnpinned");
    };
  }, []);

  const fetchTeamsChatRooms = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found in local storage");
      setIsLoading(false);
      return;
    }

    try {
      const response = await Chat.getAllTeamsChat();
      if (response.data.data) {
        const chatRooms = response.data.data;

        if (chatRooms && chatRooms.length > 0) {
          console.log("chatRooms", chatRooms);

          setTeamsChatRooms(chatRooms);
        }
      } else {
        setError("Failed to fetch chat rooms");
      }
    } catch (error) {
      setError("Error fetching chat rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerChatRooms = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found in local storage");
      setIsLoading(false);
      return;
    }

    try {
      const response = await Chat.getAllCustomerChat();
      if (response.data.data) {
        const chatRooms = response.data.data;
        if (chatRooms && chatRooms.length > 0) {
          setCustomerChatRooms(chatRooms);
          console.log("chatRooms===>", chatRooms);
        }
      }
    } catch (error) {
      setError("Error fetching chat rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinToggle = (roomId, isPinned) => {
    // Emit pin/unpin event
    if (isPinned) {
      socketServices.emit("unpinRoom", { roomId, userId });
    } else {
      socketServices.emit("pinRoom", { roomId, userId });
    }

    // Update local chat rooms state
    const updateChatRooms = (chatRooms) => {
      return chatRooms
        .map((room) => {
          if (room._id === roomId) {
            return {
              ...room,
              pinnedBy: isPinned
                ? room.pinnedBy.filter((id) => id !== userId)
                : [...room.pinnedBy, userId],
            };
          }
          return room;
        })
        .sort((a, b) => {
          // Sort by pinned status (pinned rooms first)
          const pinnedDiff =
            b.pinnedBy.includes(userId) - a.pinnedBy.includes(userId);
          if (pinnedDiff !== 0) return pinnedDiff;

          // Then sort by last message date
          return (
            (b.lastMessage?.createdAt || 0) - (a.lastMessage?.createdAt || 0)
          );
        });
    };

    if (activeTab === "customer") {
      setCustomerChatRooms((prevRooms) => updateChatRooms(prevRooms));
    } else {
      setTeamsChatRooms((prevRooms) => updateChatRooms(prevRooms));
    }
  };
  const chatRooms = activeTab === "customer" ? customerChatRooms : teamsChatRooms;


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedorderid, setselectedorderid] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]); // Store orders fetched from the API
  const [filteredOptions, setFilteredOptions] = useState([])
  const [ordertotalPages, setorderTotalPages] = useState(1);
  const [ordercurrentPage, setorderCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");



  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const toggleDropdown1 = () => setIsOpen1(!isOpen1);

  useEffect(() => {
    fetchOrders();
  }, [ordercurrentPage, searchQuery]);


  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (
        searchQuery
      ) {
        // Build query params for search
        let queryParams = "";
        if (searchQuery) queryParams += `&query=${searchQuery}`;

        // Use search API when filters/search query are applied
        response = await common.searchOrder(ordercurrentPage, queryParams);
        // Update state with fetched data
        console.log("response.data.results", response.data.results);

        setOrders(response.data.results);
        setorderTotalPages(response.data.totalPages);
      } else {
        // Use getorders API when no filters/search query
        response = await common.getorders(ordercurrentPage, 10); // Assuming limit is 10
        // Update state with fetched data
        setOrders(response.data.orders);
        setorderTotalPages(response.data.totalPages);
      }


    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight && ordercurrentPage < ordertotalPages) {
      setorderCurrentPage((prevPage) => prevPage + 1); // Fetch next page
    }
  };


  const handleOptionClick = (option) => {
    setSelectedOption(option?.orderNumber);
    setselectedorderid(option?._id)
    setIsOpen1(false); // Close dropdown after selection
  };

  const handleSubmit = async () => {
    if (selectedorderid) {
      console.log("Selected Order Number:", selectedorderid);

      const payload = {
        orderid: selectedorderid,
      };

      try {
        const response = await Chat.createChatRoom(payload);
        console.log("response.rooms.length", response.data.rooms.length);

        if (response.data.rooms.length > 0) {
          toast.success("Successully Rooms created at chat room" + response.data.message);
        } else {
          toast.error("Failed to create chat room" + response.data.message);
          console.log("Failed to create chat room" + response.data.message);
        }
      } catch (error) {
        console.error("Error creating chat room", error);
      } finally {
        setselectedorderid("")
        setSelectedOption("")
        fetchCustomerChatRooms()
        fetchTeamsChatRooms()
      }

    } else {
      console.log("No order selected");
    }
    closeModal();
  };

  const options = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
  ]; // Your options
  return (
    <>
      <ToastContainer />

      {role === "ADMIN" && <div className="flex justify-end">
        <button onClick={openModal} className="p-2 bg-white border-2  dark:bg-boxdark">
          Create Group Chat
        </button>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "400px",
              overflow: "hidden",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              background: "#ffffff",
            },
          }}
        >
          <div className="flex flex-col justify-center items-center p-1 dark:bg-boxdark">
            <h2 className="text-lg font-semibold mb-4">Select Order Number</h2>

            {/* Dropdown Button */}
            <div className="relative w-full mb-4">
              <button
                type="button"
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-boxdark text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={toggleDropdown1}
              >
                {selectedOption || "Select Order Number"}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06 0L10 10.94l3.71-3.73a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isOpen1 && (
                <div className="absolute right-0 mt-1 w-full rounded-md shadow-lg bg-white dark:bg-boxdark ring-black ring-opacity-5 focus:outline-none z-10 h-96"
                  onScroll={handleScroll}
                >
                  <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300">
                    <span className="text-sm font-medium">Orders</span>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={toggleDropdown1}
                    >
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.293 4.293a1 1 0 011.414 0L10 5.586l2.293-2.293a1 1 1 111.414 1.414L11.414 7l2.293 2.293a1 1 1 01-1.414 1.414L10 8.414l-2.293 2.293a1 1 1 01-1.414-1.414L8.586 7 6.293 4.707a1 1 1 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="py-1 max-h-40 overflow-y-auto">
                    <input
                      type="text"
                      className="block w-full px-4 py-2 text-sm border-b border-gray-300 focus:outline-none dark:bg-boxdark"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {orders.length > 0 ? (
                      orders.map((option, index) => (
                        <button
                          key={index}
                          className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => handleOptionClick(option)}
                        >
                          {option?.orderNumber}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500 block px-4 py-2 text-sm">
                        No results found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-around w-full">
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={closeModal}
              >
                Close Modal
              </button>
            </div>
          </div>
        </Modal>
      </div>}



      <div className="toggle-buttons p-1 flex justify-center">
        <div className="bg-gray-200 rounded-full p-1 flex items-center w-full">
          <button
            className={`py-2 w-full rounded-full transition-all duration-300 text-center ${activeTab === "team" ? "bg-[#57B33E] text-white" : "text-gray-700"
              }`}
            onClick={() => setActiveTab("team")}
          >
            Team
          </button>
          {role === "ADMIN" || role === "SALESMANAGER" ?
            <button
              className={`py-2 w-full rounded-full transition-all duration-300 text-center ${activeTab === "customer"
                ? "bg-[#57B33E] text-white"
                : "text-gray-700"
                }`}
              onClick={() => setActiveTab("customer")}
            >
              Customer
            </button>
            : (
              <></>
            )}
        </div>
      </div>

      <div className="tab-pane active h-100" id="chats-content">
        <div className="d-flex flex-column h-100 bg-slate-600">
          <div className="hide-scrollbar h-100" id="chatContactsList">
            {/* Chat Contact List Start */}
            {isLoading ? (
              <p>Loading...</p> // Display a loading message while fetching
            ) : error ? (
              <p className="text-red-500">{error}</p> // Display an error message if there's an error
            ) : (
              <ul
                className="contacts-list"
                id="chatContactTab"
                data-chat-list=""
              >
                {
                  chatRooms.length > 0 ? <> {chatRooms.map((room) => {
                    const lastMessage = room.lastMessage;
                    const isUnread =
                      lastMessage && !lastMessage.readBy.includes(userId);
                    const isPinned = room.pinnedBy.includes(userId);

                    return (
                      <li
                        key={room._id}
                        className={`contacts-item groups bg-white dark:bg-boxdark ${isUnread ? "font-bold" : ""
                          }`}
                        onClick={() =>
                          navigate(`/chat/${room._id}`, {
                            state: { roomName: room.name },
                          })
                        }
                      >
                        <div className="contacts-link flex items-center">
                          <div className="avatar bg-success text-light">
                            <span>
                              <svg
                                className="hw-24 w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            </span>
                          </div>
                          <div className="contacts-content flex-1">
                            <div className="contacts-info flex justify-between items-center">
                              <h6 className="chat-name text-base">{room.name}</h6>
                              {isUnread && (
                                <span className="unread-dot bg-blue-500 w-2 h-2 rounded-full inline-block ml-2"></span>
                              )}
                              <button
                                className={`pin-button ${isPinned ? "pinned" : ""
                                  }`}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent click from triggering the li's onClick
                                  handlePinToggle(room._id, isPinned);
                                }}
                              >
                                {isPinned ? (
                                  <MdPushPin className="w-5 h-5 text-yellow-500" />
                                ) : (
                                  <MdOutlinePushPin className="w-5 h-5 text-gray-500" />
                                )}
                              </button>
                            </div>
                            <div className="contacts-texts text-sm text-gray-600 ">
                              <p className="text-truncate">
                                <span>
                                  {lastMessage?.userId !== null && lastMessage
                                    ? `${lastMessage.userId.name}: `
                                    : ""}
                                </span>
                                {lastMessage
                                  ? lastMessage.contentType?.startsWith(
                                    "image/"
                                  ) && lastMessage.contentLink
                                    ? "Attached Image"
                                    : lastMessage.contentLink
                                      ? "Attached Document"
                                      : lastMessage.message
                                  : "No messages yet"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}</> : <p>NO Chat Found</p>
                }



              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatGroup;

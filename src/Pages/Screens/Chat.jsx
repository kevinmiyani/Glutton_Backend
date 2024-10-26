import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import socketServices from '../../api/Socket';
import { Chat } from '../../api/call';
import { getCollection } from '../../api/helper';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaArrowLeft, FaFileAlt, FaDownload, FaTimes } from 'react-icons/fa'; // Import FaDownload and FaTimes
import { storage } from "../../api/firebaseconfig.js";

function ChatScreen() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachmentType, setAttachmentType] = useState('');
  const [uploadingStatus, setUploadingStatus] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const roomName = location.state?.roomName || 'Chat Room';
  const navigate = useNavigate()

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded._id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    socketServices.emit("joinRoom", roomId);
    socketServices.on("message", handleNewMessage);
    fetchMessages();
    return () => {
      socketServices.emit("exitRoom", roomId);
      socketServices.off('message', handleNewMessage);
    };
  }, [roomId]);

  const handleNewMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const fetchMessages = async () => {
    try {
      const response = await Chat.getMessaged(roomId);
      if (response.data.status) {
        const sortedMessages = response.data.data.sort((a, b) =>
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sortedMessages);
      } else {
        throw new Error(response.data.message || 'Failed to load messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    const Role = await localStorage.getItem("role");
    const AddRole = getCollection(Role);
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();

    if (!token || !userId) {
      alert('Please log in again.');
      return;
    }

    try {
      let attachmentUrl = null;
      const contentType = attachmentType || 'text';
      let contentName = null;

      if (attachment) {
        setUploadingStatus('Uploading...');
        const storageRef = ref(storage, `chat-attachments/${roomId}/${attachment.name}`);
        await uploadBytes(storageRef, attachment);
        attachmentUrl = await getDownloadURL(storageRef);
        contentName = attachment.name; //
        setUploadingStatus('Upload complete');
      }

      socketServices.emit('chatMessage', {
        roomId,
        userId,
        message: newMessage,
        contentType,
        contentName,
        contentLink: attachmentUrl,
        userModel: AddRole
      });

      setNewMessage('');
      setAttachment(null);
      setAttachmentType('');
      setUploadingStatus(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      alert(err.message || 'Failed to send message. Please try logging in again.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachment(file);
      setAttachmentType(file.type);
    }
  };

  const handleDocumentAttachment = () => {
    document.getElementById('document-input').click();
  };

  const handleClearAttachment = () => {
    setAttachment(null);
    setAttachmentType('');
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <header className='flex justify-between p-2 fixed bg-green-600 w-[70%] text-white'>
        <div className="flex">
          {roomName}
        </div>
        <div className="flex cursor-pointer" onClick={() => navigate(-1)}>
          Go Back
        </div>

      </header>

      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-grow overflow-y-auto p-4 mt-20 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg?.userId?._id === getUserIdFromToken() ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-xs md:max-w-md">
                <div className={`p-4 rounded-lg shadow ${msg?.userId?._id === getUserIdFromToken() ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-green-500 text-white rounded-tl-none'}`}>
                  <p className="text-sm font-semibold">{msg?.userId?.name}</p>
                  <p className="mt-2 break-words">{msg.message}</p>
                  {msg.contentLink && (
                    <div className="mt-2 flex items-center space-x-2">
                      {msg.contentType.startsWith('image/') ? (
                        <img src={msg.contentLink} alt="attachment" className="w-64 h-auto object-cover" />
                      ) : msg.contentType.startsWith('application/pdf') ? (
                        <a href={msg.contentLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">View PDF</a>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <FaFileAlt className="w-6 h-6 text-gray-500" />
                          <a href={msg.contentLink} download className="text-blue-400 underline flex items-center space-x-1">
                            <FaDownload className="w-4 h-4" />
                            <span>Download</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-200 mt-2 text-right">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {uploadingStatus && (
          <div className="fixed bottom-12 right-20 p-2 bg-gray-800 text-white rounded-lg bg-blue-400">
            {uploadingStatus}
          </div>
        )}
        <form onSubmit={handleSendMessage} className="fixed bottom-0 p-1 w-full flex items-center justify-between space-x-4 shadow-lg max-w-screen-lg mx-auto">
          <input
            id="document-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
          />

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          {attachment ? (
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">{attachment.name}</span>
              <button
                type="button"
                onClick={handleClearAttachment}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDocumentAttachment}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Attach Document
            </button>
          )}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300">
            Send
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatScreen;

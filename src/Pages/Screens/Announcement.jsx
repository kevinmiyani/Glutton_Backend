import React, { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../api/firebaseconfig";
import { announcement } from "../../api/call";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loadingStates, setLoadingStates] = useState({}); // Track loading states
  const [progressStates, setProgressStates] = useState({}); // Track upload progress

  const fetchTopSales = async () => {
    try {
      const response = await announcement.getannouncement();
      setAnnouncements(response.data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchTopSales();
  }, []);

  const handleFileChange = (event, announcementId) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoadingStates((prev) => ({ ...prev, [announcementId]: true }));
    setProgressStates((prev) => ({ ...prev, [announcementId]: 0 }));

    // Create a Firebase Storage reference
    const storageRef = ref(storage, `announcements/${announcementId}/${file.name}`);

    // Upload file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate the upload progress
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgressStates((prev) => ({ ...prev, [announcementId]: progress }));
      },
      (error) => {
        console.error("Error uploading file:", error);
        setLoadingStates((prev) => ({ ...prev, [announcementId]: false }));
      },
      async () => {
        // Handle successful uploads
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        updateAnnouncementUrl(announcementId, downloadURL);
      }
    );
  };

  const updateAnnouncementUrl = async (announcementId, downloadURL) => {
    try {
      // Hit your API to update the announcement's URL
      await announcement.updateannouncement(announcementId, { url: downloadURL });

      // Update the local state to reflect the new URL
      const updatedAnnouncements = announcements.map((announcement) =>
        announcement._id === announcementId ? { ...announcement, url: downloadURL } : announcement
      );
      setAnnouncements(updatedAnnouncements);
      setLoadingStates((prev) => ({ ...prev, [announcementId]: false }));
    } catch (error) {
      console.error("Error updating announcement URL:", error);
      setLoadingStates((prev) => ({ ...prev, [announcementId]: false }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.map((announcement) => (
          <div key={announcement._id} className="bg-white dark:bg-boxdark rounded-lg shadow p-4 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">{announcement.name}</h3>
            <img
              src={announcement.url}
              alt={announcement.name}
              className="w-48 h-32 object-cover mb-4 rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, announcement._id)}
              className="border rounded p-2 mb-2 w-full"
              disabled={loadingStates[announcement._id] || false} // Disable based on individual loading state
            />
            {loadingStates[announcement._id] && (
              <div className="flex flex-col items-center">
                <p className="text-gray-500">Uploading... {progressStates[announcement._id]}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${progressStates[announcement._id]}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementList;

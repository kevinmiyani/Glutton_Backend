import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { auth } from '../../api/call';

const fetchUserData = async (id) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await auth.getuserById(id)
      if (response.data) {
       return response.data
      } else {
        console.error('Failed to fetch user data');
        return null;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  return null;
};

const Pro = () => {
  const { id } = useParams(); // Retrieve the ID from the URL
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await fetchUserData(id); // Fetch data using the ID
      setUserData(data);
    };
    loadUserData();
  }, [id]);

  if (!userData) {
    return <div>Loading...</div>;
  }
  return (
    <>
     
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={userData.data.profilephoto || 'gg'}
                alt="profile"
                className="object-cover rounded-full w-full h-full"
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {userData.data.name || 'User Name'}
            </h3>
            <p className="font-medium">{userData.data.role || 'Role'}</p>
          </div>
        </div>
        <div>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.2274515640233!2d72.67879267491291!3d23.052121379152982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e873e1e4eb011%3A0x62b9d0f844bfe8bd!2sBhakti%20Circle%2C%20Ankur%20Chokadi%2C%20New%20India%20Colony%2C%20Ankur%20Tenament%2C%20Nikol%2C%20Ahmedabad%2C%20Gujarat%20382410!5e0!3m2!1sen!2sin!4v1722057230107!5m2!1sen!2sin" width="100%" height="450" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </>
  );
};

export default Pro;

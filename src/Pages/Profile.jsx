import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CoverOne from '../images/cover/cover-01.png';
import user from '../images/icon/user.png';
import userSix from '../images/user/user-06.png';
import { auth } from '../api/call';

const fetchUserData = async () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken = jwtDecode(token);

      const response = await auth.getuser();

      if (response?.status === 200) {
        const data = response.data;

        return { ...decodedToken, ...data };
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }
  }
  return null;
};


const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await fetchUserData();
      setUserData(data);
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const role = localStorage.getItem('role')
    setRole(role);
  }, []);


  if (!userData) {
    return <div>Loading...</div>;
  }
  console.log(userData.data)
  console.log(role)
  return (
    <>
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>

        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* {
            userData.data.profilephoto ? (<img
              className="h-30 w-30 rounded-full object-cover border-4 border-white shadow-lg"
              src={userData.data.profilephoto}
              alt={userData.data.name || 'Manager'}
            />) : (<img
              className="h-10 w-10 rounded-full object-cover border-4 border-white shadow-lg"
              src={user}
              alt={userData.data.name || 'Manager'}
            />)
          } */}
              {userData.data.profilephoto ? (
                userData.data.profilephoto.includes(".pdf") ? (
                  <embed
                    src={userData.data.profilephoto}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                  />
                ) : (
                  <img
                    src={user}
                    alt="Preview"
                    className="h-30 w-30"
                  />
                )
              ) : (
                "No Attachment"
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-4">
            <p className="font-medium">{userData.role || 'Role'}</p>
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {userData.data.name || 'User Name'}
            </h3>

            {/* Additional Fields */}
            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap -mx-2">
                {/* Email and Phone Number in one row */}
                <div className="w-full sm:w-1/2 px-2 py-3">
                  <div className="flex flex-col">
                    <p className="text-gray-500 dark:text-gray-400">Email</p>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {userData.data.email || 'No Email'}
                    </h3>
                  </div>
                </div>

                
                {role === "STOCKMANAGER" || role === "ACCOUNTS" || role === "DESIGNER" || role === "STATEMANAGER" ?
                  (<><div className="w-full sm:w-1/2 px-2 py-3">
                    <div className="flex flex-col">
                      <p className="text-gray-500 dark:text-gray-400">Phone Number</p>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {userData.data.phoneNumber || 'No Phone Number'}
                      </h3>
                    </div>
                  </div></>) : (<><div className="w-full sm:w-1/2 px-2 py-3">
                    <div className="flex flex-col">
                      <p className="text-gray-500 dark:text-gray-400">Phone Number</p>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {userData.data.phonenumber || 'No Phone Number'}
                      </h3>
                    </div>
                  </div></>)}

                {role === "STOCKMANAGER" || role === "ACCOUNTS" || role === "DESIGNER" || role === "STATEMANAGER" ?
                  (<></>) : (<>
                    {/* State and District in one row */}
                    <div className="w-full sm:w-1/2 px-2">
                      <div className="flex flex-col">
                        <p className="text-gray-500 dark:text-gray-400">State</p>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {userData.data.state || 'No State'}
                        </h3>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 px-2">
                      <div className="flex flex-col">
                        <p className="text-gray-500 dark:text-gray-400">District</p>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {userData.data.district || 'No District'}
                        </h3>
                      </div>
                    </div>

                    {/* Village/City and Pincode in one row */}
                    <div className="w-full sm:w-1/2 px-2 py-3">
                      <div className="flex flex-col">
                        <p className="text-gray-500 dark:text-gray-400">Village/City</p>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {userData.data.villageorcity || 'No Village/City'}
                        </h3>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 px-2 py-3">
                      <div className="flex flex-col">
                        <p className="text-gray-500 dark:text-gray-400">Pincode</p>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {userData.data.pincode || 'No Pincode'}
                        </h3>
                      </div>
                    </div>
                  </>)}





              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;

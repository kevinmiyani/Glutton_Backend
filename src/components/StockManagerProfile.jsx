import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCity, FaFlag, FaMapPin } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import user from "../../src/images/icon/user.png"
const StockManagerProfile = () => {
  const location = useLocation();
  const manager = location.state?.manager;
  const role = localStorage.getItem('role')
  console.log(role);

  if (!manager) {
    return <div className="text-center text-xl text-gray-600 dark:text-gray-400 mt-10">No manager data available</div>;
  }

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: 23.069319571994537,
    lng: 72.6736779148723
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    setMap(map);
  }, [center]);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  console.log(manager.images[0]);
  console.log(manager.profilephoto);



  return (
    <div className="bg-gradient-to-r  to-indigo-50 dark:from-gray-800 dark:to-gray-900  ">
      <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-gradient-to-br p-8 flex items-center justify-center">
            {
              manager.profilephoto ? (<><img
                className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
                src={manager.profilephoto}
                alt={manager.name || 'Manager'}
              /></>) : (<><img
                className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg"
                src={user}
                alt={manager.name || 'Manager'}
              /></>)
            }

          </div>
          <div className="p-8 flex-grow">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{manager.orderBy}</div>
                <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  {manager.name || manager.clientName || 'No Name'}
                </h1>
              </div>

              <MdKeyboardBackspace onClick={handleGoBack} className="text-indigo-500 text-2xl cursor-pointer ml-4" />

            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem icon={<FaPhone className="text-indigo-500" />} label="Phone" value={manager.orderBy !== "Customer"? manager.contactNumber : manager.userid?.phonenumber || manager.contactNumber} />
              {/* <InfoItem icon={<FaEnvelope className="text-indigo-500" />} label="Email" value={manager.email || manager.clientEmail} /> */}
              <InfoItem icon={<FaEnvelope className="text-indigo-500" />} label="Email" value={manager.orderBy !== "Customer" ? manager.clientEmail : manager.userid?.email || manager.email} />
              {/* <InfoItem icon={<FaMapMarkerAlt className="text-indigo-500" />} label="Address" value={manager.fulladdress} /> */}                    
              <InfoItem icon={<FaMapMarkerAlt className="text-indigo-500" />} label="Address" value={manager.orderBy !== "Customer" ? manager.clientAddress : manager.userid?.fulladdress || manager.clientAddress} />
              {/* <InfoItem icon={<FaCity className="text-indigo-500" />} label="City" value={manager.villageorcity} /> */}
              <InfoItem icon={<FaCity className="text-indigo-500" />} label="City" value={manager.orderBy !== "Customer" ? manager.villageorcity : manager.userid?.villageorcity || manager.villageorcity} />
              {/* <InfoItem icon={<FaFlag className="text-indigo-500" />} label="State" value={manager.state} /> */}
              <InfoItem icon={<FaFlag className="text-indigo-500" />} label="State" value={manager.orderBy !== "Customer" ? manager.state : manager.userid?.state} />
              {/* <InfoItem icon={<FaMapPin className="text-indigo-500" />} label="Pincode" value={manager.pincode} /> */}
              <InfoItem icon={<FaMapPin className="text-indigo-500" />} label="Pincode" value={manager.orderBy !== "Customer" ? manager.pincode : manager.userid?.pincode} />

            </div>
          </div>
        </div>

        <div className="flex mt-5">
          {role !== 'ADMIN' && manager.images.map((item, index) => (
            <div key={index} className="image-item mx-auto">
              <img src={item} alt={item} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-300 truncate">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{value || 'N/A'}</p>
    </div>
  </div>
);

export default StockManagerProfile;
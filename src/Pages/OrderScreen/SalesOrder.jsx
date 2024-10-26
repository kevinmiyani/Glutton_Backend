import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { common } from '../../api/call';
import { useNavigate } from 'react-router-dom';
import { CiSquarePlus } from 'react-icons/ci';
import user from "../../../src/images/icon/user.png";
const ImagePopup = ({ images, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-xl font-bold">&times;</button>
                </div>
                <div className="flex overflow-x-auto gap-4 p-4">
                    {images.map((image, index) => (
                        <img key={index} src={image} alt="images" className="w-64 h-64 object-cover" />
                    ))}
                </div>
            </div>
        </div>
    );
};
const SalesOrder = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState("");
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showStockManagerPopup, setShowStockManagerPopup] = useState(false);
    const [showDesignerPopup, setDesignerPopup] = useState(false);

    const navigate = useNavigate();
    const [role, setRole] = useState('');

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
          setRole(storedRole);
        }
      }, []);

      useEffect(() => {
        const fetchOrders = async () => {
          const token = localStorage.getItem('token');
    
          if (!token) {
            setError('No token found in local storage');
            setIsLoading(false);
            return;
          }
          try {
            const response = await common.getorders();
            const data = response.data;
            if (Array.isArray(data)) {
              setOrders(data);
            } else if (data && typeof data === 'object') {
              const arrayData = Object.values(data).find((value) => Array.isArray(value));
              if (arrayData) {
                setOrders(arrayData);
              } else {
                throw new Error('Unexpected data structure');
              }
            } else {
              throw new Error('Unexpected data structure');
            }
          } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error.message);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchOrders();
      }, []);

      const handleImageClick = (images) => {
        setSelectedImages(images);
        setShowPopup(true);
      };

      const handleClosePopup = () => {
        setShowPopup(false);
      };
    
      const checkPendingStatus = (data) => {
        const managers = [
          'SalesManager',
          'LicenseManager',
          'ProjectHandler',
          'MaintainaneceManager',
          'StoreManager'
        ];
    
        const isPending = managers.some(manager => data[manager]?.status === 'Pending');
        return isPending ? "Pending" : "Complete";
      };
    
      const getAddOrderLink = () => {
        const role = localStorage.getItem('role');
        switch (role) {
          case 'ADMIN': return '/addorders';
          case 'SALESMANAGER': return '/addsalesorder';
          case 'MAINTAINANECEMANAGER': return '/addmaintenanceorder';
          case 'LICENSEMANAGER': return '/addlicesingorder';
          case 'STOREMANAGER': return '/addstockorder';
          case 'PROJECTHANDLER': return '/addprojectorder';
          case 'STATEMANAGER': return '/addstatemanger';
          case 'STOCKMANAGER': return '';
          case 'DESIGNER': return '';
          // case 'ACCOUNT' : return '/account' // Do nothing for STOCKMANAGER
        }
      };

      const handleOrderClick = (order) => {
        setOrderId(order)
        if (!order) {
          console.error('Order object is null or undefined');
          return;
        }
        const link = getAddOrderLink();
        if (link) {
          navigate(link, { state: { order } });
        } else if (localStorage.getItem('role') === 'STOCKMANAGER') {
          setShowStockManagerPopup(true);
        } else if (localStorage.getItem('role') === 'DESIGNER') {
          setDesignerPopup(true);
        }
      };
    
      const handleUserClick = (manager) => {
        if (!manager) {
          console.error('Manager object is null or undefined');
          return;
        }
        navigate('/manager-profile', { state: { manager: { ...manager, role: role } } });
      };
    return (
        <div>SalesOrder</div>
    )
}

export default SalesOrder
import React, { useState } from 'react';
import { common } from '../../api/call';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../api/firebaseconfig.js';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';

const AddExecutive = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [formData, setFormData] = useState({
    profilephoto: "",
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    fulladdress: '',
    state: '',
    district: '',
    subdistrict: '',
    villageorcity: '',
    pincode: '',
    attachdocs: [],
    alternatephonenumber: '',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachdocs') {
      setFormData((prevState) => ({
        ...prevState,
        attachdocs: files ? Array.from(files) : [],
      }));
    } else if (name === 'profilephoto') {
      setFormData((prevState) => ({
        ...prevState,
        profilephoto: files ? files[0] : null,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };



  const apiEndpoints = {
    Sales: common.Sales,
    Licensing: common.Licensing,
    Project: common.project,
    Maintenance: common.Maintenance,
    Store: common.Store
  };

  const uploadFileToFirebase = async (file) => {
    const fileRef = ref(storage, `attachments/${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const pincodeRegex = /^\d{6}$/;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authorization token not found');
      setLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      setLoading(false);
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!phoneRegex.test(formData.phonenumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!pincodeRegex.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      setLoading(false);
      return;
    }

    let profilePhotoUrl = '';
    if (formData.profilephoto) {
      profilePhotoUrl = await uploadFileToFirebase(formData.profilephoto);
    }

    const attachdocsUrls = await Promise.all(
      Array.from(formData.attachdocs).map(async (file) => {
        const url = await uploadFileToFirebase(file);
        return { name: file?.name, url };
      })
    );

    const jsonData = {
      name: formData.name,
      email: formData.email,
      phonenumber: formData.phonenumber,
      password: formData.password,
      fulladdress: formData.fulladdress,
      state: formData.state,
      district: formData.district,
      subdistrict: formData.subdistrict,
      villageorcity: formData.villageorcity,
      pincode: formData.pincode,
      alternatephonenumber: formData.alternatephonenumber,
      profilephoto: profilePhotoUrl,
      attachdocs: attachdocsUrls,
      cords: {
        latitude: 1234,
        longitude: -12343,
      },
    };

    try {
      const apiUrlFunction = apiEndpoints[selectedOption];
      if (!apiUrlFunction) {
        throw new Error('Invalid option selected');
      }

      const response = await apiUrlFunction(jsonData);
      console.log("response", response)
      console.log(response.data.status);
      if (response.data.status === false) {
        toast.error('Email is already in use');
      }

      else if (response.status === 200) {
        setFormData({
          profilephoto: "",
          name: '',
          email: '',
          phonenumber: '',
          password: '',
          fulladdress: '',
          state: '',
          district: '',
          subdistrict: '',
          villageorcity: '',
          pincode: '',
          attachdocs: [],
          alternatephonenumber: '',
        });
        setSelectedOption('');
        toast.success('Successfully added Executive');
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const errorResult = await response.json();
        toast.error(`Error: ${response.status} - ${errorResult.message}`);
      }
    } catch (error) {
      toast.error(error.messageadd);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>

      <Breadcrumb pageName="Form Layout" />
      <div>
        <div className="flex flex-col gap-5">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b flex justify-between items-center border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Add Executive
              </h3>
              <Link to="/">
                <button className="flex items-center justify-center gap-1">
                  <FaArrowLeftLong />
                  <span>Go Back</span>
                </button>
              </Link>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex flex-col gap-5.5 p-6.5">
                    <label className="mb-3 block h-1 text-black dark:text-white">
                      Profile photo<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="profilephoto"
                      onChange={handleChange}
                      required
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                      className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-green-600 file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mt-3">
                  <div className="w-full xl:w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Phone number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="phonenumber"
                      placeholder="Enter your number"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      // maxLength={5}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Full address<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fulladdress"
                      placeholder="Enter full address"
                      value={formData.fulladdress}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      State<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Enter State"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      District<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="district"
                      placeholder="Enter District"
                      value={formData.district}
                      required
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Sub-district<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subdistrict"
                      placeholder="Enter Sub-District"
                      value={formData.subdistrict}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Village or City<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="villageorcity"
                      placeholder="Enter Village or City"
                      value={formData.villageorcity}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <ToastContainer />
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Pincode<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Enter Pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Alternate phone number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="alternatephonenumber"
                      placeholder="Enter Alternate number"
                      value={formData.alternatephonenumber}
                      onChange={handleChange}
                      maxLength={10}
                      minLength={10}
                      required
                      className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div>


                  <label className="mb-2.5 block text-black dark:text-white">
                    Add Executive<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedOption}
                    required
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                      changeTextColor();
                    }}
                    // className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? 'text-black dark:text-white' : ''
                    //   }`}
                    className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-boxdark dark:text-white'
                  >
                    <option
                      value=""
                      disabled
                      className="text-body dark:text-white "
                    >
                      Select Executive
                    </option>
                    <option
                      value="Sales"
                      className="text-body dark:text-white"
                    >
                      Sales
                    </option>
                    <option
                      value="Licensing"
                      className="text-body dark:text-white"
                    >
                      Licensing
                    </option>
                    <option
                      value="Project"
                      className="text-body dark:text-white"
                    >
                      Project
                    </option>
                    <option
                      value="Maintenance"
                      className="text-body dark:text-white"
                    >
                      Maintenance
                    </option>
                    <option
                      value="Store"
                      className="text-body dark:text-white"
                    >
                      Store
                    </option>

                  </select>

                </div>

                <div className="mb-4.5 mt-2 flex flex-col   gap-6 xl:flex-row">
                  <div className="w-full xl:w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Attach documents
                    </label>
                    <input
                      type="file"
                      name="attachdocs"
                      onChange={handleChange}
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.dxf,.svg"
                      multiple
                      className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-green-600 file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                    />
                  </div>
                </div>



                <button
                  className="inline-flex items-center justify-center rounded-md bg-green-500 py-2 px-4 font-semibold text-white transition-all hover:bg-opacity-90"
                  type="submit"
                >
                  {loading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddExecutive;

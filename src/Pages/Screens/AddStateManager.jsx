import React, { useState } from 'react';
import axios from 'axios';
import { common } from '../../api/call';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddStateManager = () => {
    // State variables for form fields
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        state: '',
        country: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [stateLoading, setstateLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setstateLoading(true);

        // const token = localStorage.getItem('token'); // Retrieve the token from localStorage

        try {
            const response = await common.stateManager(formData);
            if (response && (response.status === 201 || response.status === 200)) {
                toast.success("Update Order Successfully");

                setTimeout(() => {
                    navigate("/statemanger"); // Redirect to the orders page after 0.5 second
                }, 1000); // 500 milliseconds = 0.5 second
            } else {
                toast.error("Failed to Add Category. Ensure the category is unique.");
            }
            console.log("Form submitted successfully:", response.data);
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., show an error message)
        } finally {
            setstateLoading(false);
        }
    };


    return (
        <>
            <ToastContainer />
            <div className="flex flex-col gap-5">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b flex justify-between items-center border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            State Manager
                        </h3>
                    </div>
                    <form className="p-6.5" onSubmit={handleSubmit}>
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row xl:space-x-6">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name='phoneNumber'
                                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    placeholder="Enter your phone number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-2.5 block text-black dark:text-white">
                                Address
                            </label>
                            <textarea
                                rows="2"
                                id="address"
                                name='address'
                                className="w-full rounded border-[1.5px] h-24 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                placeholder="Enter your address"
                                value={formData.address}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row xl:space-x-6">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    State
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name='state'
                                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    placeholder="Enter your state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name='country'
                                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    placeholder="Enter your country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row xl:space-x-6">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name='email'
                                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="w-full xl:w-1/2">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name='password'
                                    className="w-full rounded border-[1.5px] h-10 border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md bg-[#57B34E] py-2 px-96 font-semibold text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {stateLoading ? 'Loading...' : 'Submit'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};

export default AddStateManager;

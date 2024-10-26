import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from './../../images/logo/log.png'; // Update the path to your logo image

const HeaderComponent = () => {
  // Get current date and time
  const now = new Date();
  const location = useLocation();
  const formData = location.state || {};
  const date = now.toLocaleDateString(); // Format date as MM/DD/YYYY
  const time = now.toLocaleTimeString(); // Format time as HH:MM:SS AM/PM

  return (
    <div className="p-6 bg-gray-50 max-w-3/4">
      <article className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className='flex justify-between'>
        <div className="flex items-center mb-6">
          <img src={logo} alt="Company Logo" className="w-32 h-auto mr-4" />
          <div>
            <p className="text-2xl font-bold">Infosys LTD</p>
            <p className="text-gray-600">1234 Business Ave, Suite 100</p>
            <p className="text-gray-600">Business City, BC 12345</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xl font-semibold">Bill To:</p>
          <p className="text-gray-700">John Doe</p>
          <p className="text-gray-700">5678 Client Rd</p>
          <p className="text-gray-700">Client City, CC 67890</p>
        </div>
        </div>
       

        <table className="min-w-full bg-white border border-gray-300 mb-6">
          <tbody>
            <tr className="border-b">
              <th className="text-left px-4 py-2 font-medium text-gray-700">Invoice #</th>
              <td className="px-4 py-2 text-gray-900">101138</td>
            </tr>
            <tr className="border-b">
              <th className="text-left px-4 py-2 font-medium text-gray-700">Date</th>
              <td className="px-4 py-2 text-gray-900">{date}</td>
            </tr>
            <tr className="border-b">
              <th className="text-left px-4 py-2 font-medium text-gray-700">Time</th>
              <td className="px-4 py-2 text-gray-900">{time}</td>
            </tr>
            <tr className="border-b">
              <th className="text-left px-4 py-2 font-medium text-gray-700">Amount Due</th>
              <td className="px-4 py-2 text-gray-900">
                <span className="font-semibold">$</span><span>600.00</span>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="min-w-full bg-white border border-gray-300 mb-6">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 font-medium text-gray-700 text-left">Item</th>
              <th className="border-b px-4 py-2 font-medium text-gray-700 text-left">Description</th>
              <th className="border-b px-4 py-2 font-medium text-gray-700 text-left">Rate</th>
              <th className="border-b px-4 py-2 font-medium text-gray-700 text-left">Quantity</th>
              <th className="border-b px-4 py-2 font-medium text-gray-700 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b px-4 py-2 text-gray-900">
                <span>{formData.itemName || 'Front End Consultation'}</span>
              </td>
              <td className="border-b px-4 py-2 text-gray-900">Experience Review</td>
              <td className="border-b px-4 py-2 text-gray-900">
                <span className="font-semibold">$</span><span>150.00</span>
              </td>
              <td className="border-b px-4 py-2 text-gray-900">4</td>
              <td className="border-b px-4 py-2 text-gray-900">
                <span className="font-semibold">$</span><span>600.00</span>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="min-w-full bg-gray-100 border border-gray-300">
          <tbody>
            <tr className="border-b">
              <th className="text-left px-4 py-2 font-medium text-gray-700">Total</th>
              <td className="px-4 py-2 text-gray-900">
                <span className="font-semibold">$</span><span>600.00</span>
              </td>
            </tr>
            <tr className="border-b">
              <th className="text-left px-4 py-2 font-medium text-gray-700">Amount Paid</th>
              <td className="px-4 py-2 text-gray-900">
                <span className="font-semibold">$</span><span>0.00</span>
              </td>
            </tr>
            <tr className="border-b">
              <th className="text-left px-4 py-2 font-medium text-gray-700">Balance Due</th>
              <td className="px-4 py-2 text-gray-900">
                <span className="font-semibold">$</span><span>600.00</span>
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <aside className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4" id="notes">Additional Notes</h1>
        <p className="text-gray-700">A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
      </aside>

      <footer className="mt-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700">Signature: ___________________________</p>
        </div>
      </footer>
    </div>
  );
};

export default HeaderComponent;

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GenerateInvoice = () => {
  const input = document.getElementById('invoiceCapture');
  
  html2canvas(input, { scrollY: -window.scrollY }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    // Define padding values
    const paddingTop = 40;
    const paddingLeft = 40;
    const paddingRight = 40;
    const paddingBottom = 40; // Add bottom padding if needed

    const pdfWidth = pdf.internal.pageSize.getWidth() - paddingLeft - paddingRight;
    const pdfHeight = pdf.internal.pageSize.getHeight() - paddingTop - paddingBottom;

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;

    // Calculate the scaling factor to fit the image within the PDF page minus padding
    const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    // Center the image on the PDF page with padding
    const x = paddingLeft;
    const y = paddingTop;

    // Adjust the position and size of the image to fit within the PDF page
    if (scaledHeight > pdfHeight) {
      // If the image is too tall, split it into multiple pages
      const pages = Math.ceil(scaledHeight / pdfHeight);
      for (let i = 0; i < pages; i++) {
        const startY = i * pdfHeight;
        const endY = startY + pdfHeight;

        pdf.addImage(imgData, 'PNG', x, y - startY, scaledWidth, scaledHeight);
        if (i < pages - 1) {
          pdf.addPage();
        }
      }
    } else {
      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    }

    // Save the PDF
    pdf.save('invoice.pdf');
  });
};



const InvoiceModal = ({
  showModal,
  closeModal,
  info,
  currency,
  total,
  items,
  taxAmount,
  discountAmount,
  subTotal,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full relative p-16 h-[90vh] overflow-y-auto ">
        <div id="invoiceCapture">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">{info.billFrom || "Your Company Name"}</h2>
              <p>{info.billFromAddress || "Your Address"}</p>
              <p>{info.billFromEmail || "your@email.com"}</p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
              <p className="font-bold">Invoice Number: {info.invoiceNumber || "INV-001"}</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">Bill To:</h3>
            <p>{info.billTo || "Client Name"}</p>
            <p>{info.billToAddress || "Client Address"}</p>
            <p>{info.billToEmail || "client@email.com"}</p>
          </div>

          {/* Invoice Items */}
          <table className="w-full mb-8">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Quantity</th>
                <th className="py-2 px-4 text-right">Price</th>
                <th className="py-2 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.name} - {item.description}</td>
                  <td className="py-2 px-4 text-right">{item.quantity}</td>
                  <td className="py-2 px-4 text-right">{currency} {item.price}</td>
                  <td className="py-2 px-4 text-right">{currency} {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Invoice Summary */}
          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>{currency} {subTotal}</span>
              </div>
              {taxAmount !== "0.00" && (
                <div className="flex justify-between mb-2">
                  <span>Tax:</span>
                  <span>{currency} {taxAmount}</span>
                </div>
              )}
              {discountAmount !== "0.00" && (
                <div className="flex justify-between mb-2">
                  <span>Discount:</span>
                  <span>{currency} {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl mt-4">
                <span>Total:</span>
                <span>{currency} {total}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {info.notes && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-2">Notes:</h3>
              <p>{info.notes}</p>
            </div>
          )}
          {info.notes && (
            <div className="mt-6">
              <h1>.</h1>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-8">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            onClick={GenerateInvoice}
          >
            <BiCloudDownload className="w-5 h-5 mr-2" />
            Download Invoice PDF
          </button>
        </div>

        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={closeModal}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default InvoiceModal;
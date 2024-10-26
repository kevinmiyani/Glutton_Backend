/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";

const InvoiceForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("$");
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [billTo, setBillTo] = useState("");
  const [billToEmail, setBillToEmail] = useState("");
  const [billToAddress, setBillToAddress] = useState("");
  const [billFrom, setBillFrom] = useState("");
  const [billFromEmail, setBillFromEmail] = useState("");
  const [billFromAddress, setBillFromAddress] = useState("");
  const [notes, setNotes] = useState(
    "Thank you for doing business with us. Have a great day!"
  );
  const [total, setTotal] = useState("0.00");
  const [subTotal, setSubTotal] = useState("0.00");
  const [taxRate, setTaxRate] = useState("");
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0.00");

  const [items, setItems] = useState([
    {
      id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
      name: "",
      description: "",
      price: "1.00",
      quantity: 1,
    },
  ]);

  const handleCalculateTotal = useCallback(() => {
    let newSubTotal = items
      .reduce((acc, item) => {
        return acc + parseFloat(item.price) * parseInt(item.quantity);
      }, 0)
      .toFixed(2);

    let newtaxAmount = (newSubTotal * (taxRate / 100)).toFixed(2);
    let newdiscountAmount = (newSubTotal * (discountRate / 100)).toFixed(2);
    let newTotal = (
      parseFloat(newSubTotal) -
      parseFloat(newdiscountAmount) +
      parseFloat(newtaxAmount)
    ).toFixed(2);

    setSubTotal(newSubTotal);
    setTaxAmount(newtaxAmount);
    setDiscountAmount(newdiscountAmount);
    setTotal(newTotal);
  }, [items, taxRate, discountRate]);

  useEffect(() => {
    handleCalculateTotal();
  }, [handleCalculateTotal]);

  const handleRowDel = (item) => {
    const updatedItems = items.filter((i) => i.id !== item.id);
    setItems(updatedItems);
  };

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id,
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
    };
    setItems([...items, newItem]);
  };

  const onItemizedItemEdit = (evt) => {
    const { id, name, value } = evt.target;

    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setItems(updatedItems);
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    handleCalculateTotal();
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <form onSubmit={openModal} className="space-y-8">
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex-1">
          <div className="bg-white p-6 shadow-md rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between mb-6">
              <div className="flex flex-col">
                <div className="flex flex-col mb-2">
                  <span className="font-semibold">Current Date:&nbsp;</span>
                  <span className="">{currentDate}</span>
                </div>
                <div className="flex flex-row items-center">
                  <span className="font-semibold mr-2">Due Date:</span>
                  <input
                    type="date"
                    value={dateOfIssue}
                    name="dateOfIssue"
                    onChange={handleChange(setDateOfIssue)}
                    className="border p-2 rounded w-36"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-row items-center">
                <span className="font-semibold mr-2">Invoice Number:&nbsp;</span>
                <input
                  type="number"
                  value={invoiceNumber}
                  name="invoiceNumber"
                  onChange={handleChange(setInvoiceNumber)}
                  min="1"
                  className="border p-2 rounded w-20"
                  required
                />
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 mb-6">
              <div className="flex-1">
                <label className="font-semibold">Bill from:</label>
                <input
                  placeholder="Who is this invoice from?"
                  value={billFrom}
                  type="text"
                  name="billFrom"
                  className="border p-2 rounded mt-2 w-full"
                  onChange={handleChange(setBillFrom)}
                  autoComplete="name"
                  required
                />
                <input
                  placeholder="Email address"
                  value={billFromEmail}
                  type="email"
                  name="billFromEmail"
                  className="border p-2 rounded mt-2 w-full"
                  onChange={handleChange(setBillFromEmail)}
                  autoComplete="email"
                  required
                />
                <input
                  placeholder="Billing address"
                  value={billFromAddress}
                  type="text"
                  name="billFromAddress"
                  className="border p-2 rounded mt-2 w-full"
                  onChange={handleChange(setBillFromAddress)}
                  autoComplete="address"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold">Bill to:</label>
                <input
                  placeholder="Who is this invoice to?"
                  value={billTo}
                  type="text"
                  name="billTo"
                  className="border p-2 rounded mt-2 w-full"
                  onChange={handleChange(setBillTo)}
                  autoComplete="name"
                  required
                />
                <input
                  placeholder="Email address"
                  value={billToEmail}
                  type="email"
                  name="billToEmail"
                  className="border p-2 rounded mt-2 w-full"
                  onChange={handleChange(setBillToEmail)}
                  autoComplete="email"
                  required
                />
                <input
                  placeholder="Billing address"
                  value={billToAddress}
                  type="text"
                  name="billToAddress"
                  className="border p-2 rounded mt-2 w-full"
                  onChange={handleChange(setBillToAddress)}
                  autoComplete="address"
                  required
                />
              </div>
            </div>
            <InvoiceItem
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={currency}
              items={items}
            />
            <div className="mt-6 flex flex-col space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold">Subtotal:</span>
                <span>
                  {currency}
                  {subTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Discount:</span>
                <span>
                  <span className="text-sm">({discountRate || 0}%)</span>
                  {currency}
                  {discountAmount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Tax:</span>
                <span>
                  <span className="text-sm">({taxRate || 0}%)</span>
                  {currency}
                  {taxAmount || 0}
                </span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>
                  {currency}
                  {total || 0}
                </span>
              </div>
            </div>
            <hr className="my-4" />
            <label className="font-semibold">Notes:</label>
            <textarea
              placeholder="Additional notes to the client"
              value={notes}
              name="notes"
              className="border p-2 rounded mt-2 w-full"
              onChange={handleChange(setNotes)}
              rows="4"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full"
            >
              Review Invoice
            </button>
          </div>
        </div>
      </div>
      <InvoiceModal
        showModal={isOpen} // Changed from isOpen to showModal
        closeModal={closeModal}
        info={{
          billFrom,
          billFromEmail,
          billFromAddress,
          billTo,
          billToEmail,
          billToAddress,
          invoiceNumber,
          dateOfIssue,
          notes,
          currentDate,
        }}
        currency={currency}
        total={total}
        subTotal={subTotal}
        taxAmount={taxAmount}
        discountAmount={discountAmount}
        items={items}
      />
    </form>
  );
};

export default InvoiceForm;

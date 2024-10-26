/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React from "react";

const EditableField = ({ cellData, onItemizedItemEdit }) => {
  return (
    <div className="flex flex-nowrap items-center my-1">
      {cellData.leading != null && (
        <div className="bg-gray-100 font-semibold text-gray-500 px-2 border-none flex items-center">
          <span
            className="border border-gray-500 rounded-full flex items-center justify-center text-xs"
            style={{ width: "20px", height: "20px" }}
          >
            {cellData.leading}
          </span>
        </div>
      )}
      <input
        className={`form-input ${cellData.textAlign} px-3 py-1 w-full`}
        type={cellData.type}
        placeholder={cellData.placeholder}
        min={cellData.min}
        name={cellData.name}
        id={cellData.id}
        value={cellData.value}
        step={cellData.step}
        precision={cellData.precision}
        aria-label={cellData.name}
        onChange={onItemizedItemEdit}
        required
      />
    </div>
  );
};

export default EditableField;

import React, { useEffect, useState } from "react";

const Switch = ({ func }) => {
  const [checked, setChecked] = useState(true);
  useEffect(() => {
    func(checked);
  }, [checked]);
  return (
    <div
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked((v) => !v)}
      className={`w-12 h-6 duration-500 rounded-full p-1 flex items-center cursor-pointer transition ${
        checked ? "bg-indigo-600" : "bg-gray-200"
      }`}
    >
      <div
        className={`w-4 h-4 duration-500 bg-white rounded-full shadow transform transition ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default Switch;

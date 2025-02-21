import React, { useState } from "react";

function App() {
  const [onChangeValue, setOnChangeValue] = useState("");

  const onChangefun = (e) => {
    let value = e.target.value;
    setOnChangeValue(value);
  };

  return (
    <div className="bg-gray-400 h-screen m-4 p-2">
      <div className="flex bg-green-400 justify-center mb-2">
        {onChangeValue === ""
          ? "This is to inform you, this application is in working condition"
          : onChangeValue}
      </div>
      <div className="name flex justify-center mb-2">
        <label className="mr-2" htmlFor=""> Name: </label>
        <input
          type="text"
          placeholder="Type your name here"
          onChange={onChangefun}
        />
      </div>

    </div>
  );
}

export default App;

import React from "react";

const Error = ({ msg, to }) => {
  return (
    <div>
      {msg}
      <br />
      <button onClick={() => location.replace(to)}>go home</button>
    </div>
  );
};

export default Error;

import React, { useEffect } from "react";

const SessionExpired = ({ data }) => {
  useEffect(() => {
    location.replace("/login");
  }, [data]);
  return (
    <div className="flex max-w-2xl mx-auto h-[90vh]">
      you need to login first
    </div>
  );
};

export default SessionExpired;

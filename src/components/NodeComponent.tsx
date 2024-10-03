import React from 'react';

const NodeComponent = ({ data }) => {
  return (
    <div className="p-4 bg-white border border-gray-300 rounded shadow">
      {data.label}
    </div>
  );
};

export default NodeComponent;

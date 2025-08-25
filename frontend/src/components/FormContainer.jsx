import React from 'react';

const FormContainer = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
// app/components/FullScreenLoader.tsx
import React from "react";

const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="mt-4 text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;

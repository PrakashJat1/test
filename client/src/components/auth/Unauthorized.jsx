import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <Lock className="w-20 h-20 text-yellow-500 mb-4" />
      <h1 className="text-5xl font-bold mb-2">401</h1>
      <h2 className="text-2xl font-semibold mb-4">Unauthorized Access</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Sorry, you don’t have permission to view this page.  
        Please login with the correct account or contact support.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 transition"
        >
          Go Back Home
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-2xl shadow-md hover:bg-gray-300 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

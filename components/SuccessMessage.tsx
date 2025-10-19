import React from "react";

const SuccessMessage = ({ message }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] py-10">
    <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-2xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">Thank You!</h2>
      <p className="text-gray-700 text-lg mb-2">{message || "Your response is recorded. We will contact you shortly."}</p>
      <a href="/" className="mt-4 inline-block px-6 py-2 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition">Back to Home</a>
    </div>
  </div>
);

export default SuccessMessage;

import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Concert() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } 
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
    setShowModal(false);
  };

  return (
    <div className="bg-white text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b border-gray-200">
        <div className="text-2xl font-bold text-purple-800">E-Ticket Booking Concert</div>
        <div>
          {!isLoggedIn ? (
            <>
              <button
                className="bg-transparent border border-black py-2 px-4 rounded mr-4"
                onClick={() => router.push('/login')}
              >
                Login
              </button>
              <button
                className="bg-purple-800 text-white py-2 px-4 rounded"
                onClick={() => router.push('/register')}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(true)}
              >
                Logout
              </button>
              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
                  <div className="bg-white w-1/3 p-6 rounded-lg z-60">
                    <h2 className="text-xl text-black mb-4">Are you sure you want to logout?</h2>
                    <div className="flex justify-end">
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </header>

      {/* Event Details */}
      <section className="p-8">
        <h1 className="text-4xl font-bold text-purple-800 mb-4">NAMA EVENT</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img src="/path/to/your/image.jpg" alt="Event" className="w-full h-full object-cover rounded-md" />
          </div>
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">List Band</h2>
            <div className="space-y-4">
              {/* Example Band Item */}
              <div className="bg-white shadow-md rounded overflow-hidden">
                <img src="/path/to/your/image.jpg" alt="Band" className="w-full h-32 object-cover" />
                <div className="p-2 text-center font-bold">BTS</div>
              </div>
              {/* Add more band items as needed */}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Event Information</h2>
          <div className="flex items-center mb-2">
            <div className="mr-2">
              {/* <svg className="w-6 h-6 text-purple-800" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 1014 14 7 7 0 00-14-14zM10 12a2 2 0 100-4 2 2 0 000 4z" /></svg> */}
            </div>
            <div className="font-medium">pipo</div>
          </div>
          <div className="flex items-center mb-2">
            <div className="mr-2">
              {/* <svg className="w-6 h-6 text-purple-800" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM10 18A7 7 0 0110 4v1a6 6 0 100 12v1zm4-6a4 4 0 01-8 0v-1h8v1zm-3-3a1 1 0 11-2 0V8a1 1 0 012 0v1zm1-1V8a2 2 0 10-4 0v1H6a4 4 0 018 0h-2z" /></svg> */}
            </div>
            <div className="font-medium">29 Maret - 30 Maret</div>
          </div>
          <div className="flex items-center mb-4">
            <div className="font-medium mr-2">Fees Starting At :</div>
            <div className="text-purple-800 font-bold">Rp.150.000</div>
          </div>
          <button className="bg-purple-800 text-white py-2 px-4 rounded">Buy Now</button>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Deskripsi</h2>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

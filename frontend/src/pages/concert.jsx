/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ModalLogout from "@/components/ModalLogout";

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
      <div className="flex items-center">
          <img src="/images/logos/logo2.png" alt="Logo" className="w-7 h-7 mr-2" />
          <div className="text-2xl text-purple-800 font-bold">E-Ticket Booking Concert</div>
        </div>
        <div>
          <>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(true)}
              >
                Logout
              </button>
              {showModal && (
                <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout}/>
              )}
          </>
        </div>
      </header>

      {/* Event Details */}
      <section className="p-8">
        <h1 className="text-4xl font-bold text-purple-800 mb-4">NAMA EVENT</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1 w-62">
            <img src="/images/concert1.png" alt="Event" className="w-full h-full object-cover rounded-md" />
          </div>
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">List Band</h2>
            <div className="space-y-4">
              {/* Example Band Item */}
                <div className="bg-white shadow-md rounded overflow-hidden w-52">
                    <img src="/images/band1.png" alt="Band" className="w-full h-32 object-cover" />
                    <div className="p-2 text-center font-bold">BTS</div>
                </div>
              {/* Add more band items as needed */}
            </div>
          </div>
        </div>

        <div className="mt-8">
        <div className="flex space-x-20">
            <div>
                <h2 className="text-2xl font-bold text-purple-800 mb-6">Event Information</h2>
                <div className="flex items-center mb-4">
                  <img src="/images/logos/location.png" alt="Logo" className="w-6 h-6 mr-2" />
                  <div className="font-medium">pipo</div>
                </div>
                <div className="flex items-center">
                  <img src="/images/logos/alarm.png" alt="Logo" className="w-6 h-6 mr-2" />
                  <div className="font-medium">29 Maret - 30 Maret</div>
                </div>
            </div>
            <div className="flex flex-col items-center border border-gray-300 p-4 rounded">
                <div className="font-medium text-center mb-2">Fees Starting At:</div>
                <div className="text-purple-800 text-center font-bold mb-4">Rp.150.000</div>
                <button className="bg-purple-800 text-white py-2 px-4 rounded w-full">Order Now</button>
            </div>
        </div>


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

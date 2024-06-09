import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
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
    setIsLoggedIn(false);
    setShowModal(false);
    router.push('/login');
  };

  return (
    <div className="bg-white text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-purple-600 text-white p-6 flex justify-between items-center relative z-20">
        <div className="text-2xl font-bold">E-Ticket Booking Concert</div>
        <div>
          {!isLoggedIn ? (
            <>
              <button
                className="bg-transparent border border-white py-2 px-4 rounded mr-4"
                onClick={() => router.push('/login')}
              >
                Login
              </button>
              <button
                className="bg-white text-purple-800 py-2 px-4 rounded"
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-800 to-purple-600 text-white py-24 text-center relative z-10">
        <img
          src="/path/to/your/image.jpg"
          className="w-full h-full object-cover absolute inset-0 opacity-50 z-0"
          alt="Hero"
        />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold">Lorem Ipsum</h1>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button
            className="bg-pink-500 text-white mt-8 py-3 px-6 rounded"
            onClick={() => router.push('/tickets')}
          >
            Get Ticket
          </button>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-8 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Event Card */}
          <div className="bg-white shadow-md rounded overflow-hidden">
            <img src="/path/to/your/image.jpg" alt="Event" className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="text-sm text-gray-500">APR 14-16</div>
              <h3 className="text-xl font-bold">Event Name</h3>
              <p className="mt-2 text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          {/* Add more event cards as needed */}
        </div>
      </section>

      {/* Previous Events Section */}
      <section className="py-16 px-8 bg-gray-100 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8">Previous Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Example Previous Event Card */}
          <div className="bg-white shadow-md rounded overflow-hidden">
            <img src="/path/to/your/image.jpg" alt="Event" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold">Event Name</h3>
            </div>
          </div>
          {/* Add more previous event cards as needed */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12 text-center relative z-10">
        <div className="container mx-auto">
          <div className="mb-4">
            <h3 className="text-2xl font-bold">E-Ticket Booking Concert</h3>
            <p className="mt-2 max-w-lg mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="text-sm">
            &copy; 2024 E-Ticket Booking Concert. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

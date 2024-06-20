/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useEffect} from "react";
import ModalLogout from "@/components/ModalLogout";

export default function buy() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token) {
          router.push('/login')
        } else if (role == "Admin"){
          router.push('/admin/concerts')
        } else if (token){
          setIsLoggedIn(true)
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
        {!isLoggedIn ? (
          <>
          <button
            className="bg-transparent text-purple-800 border border-purple-800 py-2 px-4 rounded mr-4"
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
        ):(
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
        )}
        </div>
      </header>

      {/* Event Details */}
      <section className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1 w-62">
            <img src="/images/concert1.png" alt="Event" className="w-full h-full object-cover rounded-md" />
          </div>
          <div className="lg:col-span-1">
            
          </div>
        </div>
      </section>
    </div>
    );
}

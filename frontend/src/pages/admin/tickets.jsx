/* eslint-disable react-hooks/rules-of-hooks */
import React , { useState } from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from '@/components/Sidebar'
import ModalLogout from "@/components/ModalLogout";

export default function tickets() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      router.push('/login')
    } else if (role == "User"){
      router.push('/')
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
    setShowModal(false);
  };
  
  return (
    <div className='min-h-screen flex'>
      <Sidebar setShowModal={setShowModal}/>
      <main className='w-4/5 bg-gray-100 p-8'>
        <h1 className="text-2xl font-bold mb-8">List Tickets</h1>
        <div className="mb-4 flex justify-end">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={() => router.push('/admin/addTicket')}
          >
            Add Ticket
          </button>
        </div>
        <div className="bg-white rounded shadow-md p-4">
          <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Id Ticket</th>
                <th className="border border-gray-300 px-4 py-2">Concert Name</th>
                <th className="border border-gray-300 px-4 py-2">Ticket Type</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                <td className="border border-gray-300 px-4 py-2 text-center">SummerRoad</td>
                <td className="border border-gray-300 px-4 py-2 text-center">VIP</td>
                <td className="border border-gray-300 px-4 py-2 text-center">Available</td>
                <td className="border border-gray-300 px-4 py-2 text-center">Rp.100.000,00</td>
              </tr>
              {/* Tambahkan baris lain sesuai data */}
            </tbody>
          </table>
        </div>
      </main>
      {/* Aktifkan modal saat showModal bernilai true */}
      {showModal && (
        <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout}/>
      )}
    </div>
  )
}

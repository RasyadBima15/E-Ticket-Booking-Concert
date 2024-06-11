/* eslint-disable react-hooks/rules-of-hooks */
import React , { useState } from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '@/components/Sidebar'
import ModalLogout from "@/components/ModalLogout";
import Image from 'next/image';

export default function bands() {
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
    <div className="min-h-screen flex">
      <Sidebar setShowModal={setShowModal}/>
  
      <main className="w-4/5 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-8">List Bands</h1>
        <div className="mb-4 flex justify-end">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={() => router.push('/admin/addBand')}
          >
            Add Band
          </button>
        </div>
        <div className="bg-white rounded shadow-md p-4">
          <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Band Name</th>
                <th className="border border-gray-300 px-4 py-2">Concert Name</th>
                <th className="border border-gray-300 px-4 py-2">Band Image</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">BTS</td>
                <td className="border border-gray-300 px-4 py-2 text-center">SummerRoad</td>
                <td className="border border-gray-300 px-4 py-2 flex justify-center items-center">
                  <Image src="/images/band1.png" alt="Deskripsi gambar" width="100" height="100"/>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button className="mr-5 text-green-600">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="text-red-600">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
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

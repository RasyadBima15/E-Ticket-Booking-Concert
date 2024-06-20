import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '@/components/Sidebar';
import ModalLogout from "@/components/ModalLogout";
import ModalDelete from "@/components/ModalDelete";
import concertApi from "@/api/modules/concerts.api";

export default function Concerts() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [concerts, setConcerts] = useState([]);
  const [concertToDelete, setConcertToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      router.push('/login')
    } else if (role === "User") {
      router.push('/')
    } else {
      const fetchConcerts = async () => {
        const { response } = await concertApi.getAllConcerts();
        if (response) {
          const concertsData = response.map(concert => ({
            ...concert,
            deskripsi: concert.deskripsi.length > 20 ? `${concert.deskripsi.slice(0, 20)}...` : concert.deskripsi
          }));
          setConcerts(concertsData);
        }
      };
      fetchConcerts();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
    setShowModal(false);
  };

  const handleDelete = async () => {
    const { response } = await concertApi.deleteConcert(concertToDelete.concert_id);
    if (response) {
      const updatedConcerts = concerts.filter(concert => concert.concert_id !== concertToDelete.concert_id);
      setConcerts(updatedConcerts);
      router.push('/admin/concerts');
      setShowModalDelete(false);
      setConcertToDelete(null);
    }
  };

  const openDeleteModal = (concert) => {
    setConcertToDelete(concert);
    setShowModalDelete(true);
  };

  const handleEdit = (id) => {
    router.push(`/admin/editConcert/${id}`);
  };

  return (
    <div className="flex">
      <Sidebar setShowModal={setShowModal} />
      <main className="flex-1 h-screen overflow-auto bg-gray-100 p-8 ml-[20%]">
        <h1 className="text-2xl font-bold mb-8">List Concerts</h1>
        <div className="mb-4 flex justify-end">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={() => router.push('/admin/addConcert')}
          >
            Add Concert
          </button>
        </div>
        <div className="bg-white rounded shadow-md p-4">
          <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Concert Name</th>
                <th className="border border-gray-300 px-4 py-2">Location</th>
                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                <th className="border border-gray-300 px-4 py-2">End Date</th>
                <th className="border border-gray-300 px-4 py-2">Total Ticket</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {concerts.map((concert, index) => (
                <tr key={index} className="bg-gray-100">
                  <td className="border border-gray-300 px-3 py-2">{concert.nama}</td>
                  <td className="border border-gray-300 px-3 py-2">{concert.lokasi}</td>
                  <td className="border border-gray-300 px-3 py-2">{new Date(concert.start_date).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-3 py-2">{new Date(concert.end_date).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-3 py-2">{concert.total_ticket}</td>
                  <td className="border border-gray-300 px-3 py-2">{concert.deskripsi}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button onClick={() => handleEdit(concert.concert_id)} className="mr-5 text-green-600">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => openDeleteModal(concert)} className="text-red-600">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {/* Modal Logout */}
      {showModal && <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout} />}
      {/* Modal Delete */}
      {showModalDelete && <ModalDelete setShowModalDelete={setShowModalDelete} handleDelete={handleDelete} />}
    </div>
  );
}

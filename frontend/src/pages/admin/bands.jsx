/* eslint-disable react-hooks/rules-of-hooks */
import React , { useState } from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '@/components/Sidebar'
import ModalLogout from '@/components/ModalLogout';
import Image from 'next/image';
import bandApi from '@/api/modules/bands.api';
import ModalDelete from '@/components/ModalDelete';
import concertApi from '@/api/modules/concerts.api';

export default function bands() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [bands, setBands] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [bandToDelete, setBandToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      router.push('/login');
    } else if (role === 'User') {
      router.push('/');
    } else {
      const fetchBands = async () => {
        const { response: bandResponse } = await bandApi.getAllBands();
        const { response: concertResponse } = await concertApi.getAllConcerts();
        if (bandResponse) {
          setBands(bandResponse);
        }
        if(concertResponse){
          setConcerts(concertResponse);
        }
      };
      fetchBands();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('idUser');
    router.push('/login');
    setShowModal(false);
  };

  const handleDelete = async () => {
    const { response } = await bandApi.deleteBand(bandToDelete.IdBand);
    if (response) {
      const updatedBands = bands.filter(band => band.IdBand !== bandToDelete.IdBand);
      setBands(updatedBands);
      router.push('/admin/bands')
      setShowModalDelete(false);
      setBandToDelete(null);
    }
  }

  const handleEdit = (id) => {
    router.push(`/admin/editBand/${id}`);
  }

  const openDeleteModal = (band) => {
    setBandToDelete(band);
    setShowModalDelete(true);
  }

  const getConcertNameById = (concertId) => {
    if (concerts.length > 0){
      const concert = concerts.find(concert => concert.concert_id === concertId);
      if (!concert){
        return 'Unknown';
      }
      return concert.nama
    }
    return 'Unknown';
  };
  
  return (
    <div className="flex">
      <Sidebar setShowModal={setShowModal}/>
      <main className="flex-1 h-screen overflow-auto bg-gray-100 p-8 ml-[20%]">
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
              {bands.map((band, index) => (
                <tr key={index} className="bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">{band.Name}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{getConcertNameById(band.IdConcert)}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center items-center">
                    <Image src={band.ImageBand} alt="Deskripsi gambar" width="100" height="100"/>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button onClick={() => handleEdit(band.IdBand)} className="mr-5 text-green-600">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => openDeleteModal(band)} className="text-red-600">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {/* Aktifkan modal saat showModal bernilai true */}
      {showModal && (
        <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout}/>
      )}
      {/* Aktifkan modal saat showModal bernilai true */}
      {showModalDelete && (
        <ModalDelete setShowModalDelete={setShowModalDelete} handleDelete={handleDelete}/>
      )}
    </div>
  )
}

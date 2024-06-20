/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ModalLogout from "@/components/ModalLogout";
import concertApi from "@/api/modules/concerts.api";
import ticketApi from "@/api/modules/tickets.api";

export default function Concert() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [concert, setConcert] = useState(null);
  const [imageConcert, setImageConcert] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(null)
  const { id } = router.query;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    if (id) {
      const fetchConcert = async () => {
        try {
          const { response } = await concertApi.getConcert(id);
          if (response) {
            setConcert(response);
            setImageConcert(
              response.image_concert
                .replace(
                  'C:\\Users\\ASUS\\Documents\\Semester 4 Sisfo\\Pemrograman Web Lanjutan\\Tugas\\E-Ticket Booking Concert\\frontend\\public',
                  ''
                )
                .replace(/\\/g, '/')
            );
          }
        } catch (error) {
          console.error("Error fetching concert:", error);
        }
      };
      const fetchTicket = async () => {
        try {
          const { response, error } = await ticketApi.getTicketsByConcert(id);
          if(response){
            setTicketPrice(response.price)
          }
        } catch (error) {
          console.error("Error fetching concert:", error);
        }
      }
      fetchConcert();
      fetchTicket();
    }
  }, [router, id]);

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = months[start.getMonth()];
    const endMonth = months[end.getMonth()];

    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };
  
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
      {concert && (
        <section className="p-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-4">{concert.nama}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1 w-62">
            <img src={`${imageConcert}`} alt="Event" className="w-full h-full object-cover rounded-md" />
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
                  <div className="font-medium">{concert.lokasi}</div>
                </div>
                <div className="flex items-center">
                  <img src="/images/logos/alarm.png" alt="Logo" className="w-6 h-6 mr-2" />
                  <div className="font-medium">{formatDateRange(concert.start_date, concert.end_date)}</div>
                </div>
            </div>
            <div className="flex flex-col items-center border border-gray-300 py-4 px-6 rounded">
                <div className="font-medium text-center mb-2">Fees Starting At:</div>
                <div className="text-purple-800 text-center font-bold mb-4">{formatRupiah(ticketPrice)}</div>
                <button className="bg-purple-800 text-white py-2 px-4 rounded w-full">Order Now</button>
            </div>
        </div>


          <div className="mt-8">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Deskripsi</h2>
            <p className="text-gray-700">
              {concert.deskripsi}
            </p>
          </div>
        </div>
        </section>
      )}  
    </div>
  );
}

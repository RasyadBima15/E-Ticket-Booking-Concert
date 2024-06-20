/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ModalLogout from "@/components/ModalLogout";
import concertApi from "@/api/modules/concerts.api";
import ticketApi from "@/api/modules/tickets.api";
import bandApi from "@/api/modules/bands.api";

export default function Concert() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [concert, setConcert] = useState(null);
  const [imageConcert, setImageConcert] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(null)
  const [bands, setBands] = useState([])
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
          console.error("Error fetching ticket:", error);
        }
      }
      const fetchBand = async () => {
        try {
          const { response, error } = await bandApi.getBandByConcert(id);
          console.log(response);
          if(response){
            setBands(response)
          }
        } catch (error) {
          console.error("Error fetching band:", error);
        }
      }
      fetchConcert();
      fetchTicket();
      fetchBand();
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
            <div className="flex flex-wrap gap-10">
              {bands.map((band, index) => (
                <div key={index} className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden w-52 flex-shrink-0">
                  <img
                    src={band.image_band.replace(
                      'C:\\Users\\ASUS\\Documents\\Semester 4 Sisfo\\Pemrograman Web Lanjutan\\Tugas\\E-Ticket Booking Concert\\frontend\\public',
                      ''
                    ).replace(/\\/g, '/')}
                    alt="Band"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2 text-center font-bold">{band.name}</div>
                </div>
              ))}
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

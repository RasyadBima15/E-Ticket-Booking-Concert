/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ModalLogout from "@/components/ModalLogout";
import concertApi from "@/api/modules/concerts.api";
import bandApi from "@/api/modules/bands.api";
import ticketApi from "@/api/modules/tickets.api";
import ModalOrder from "@/components/ModalOrder";
import userApi from "@/api/modules/users.api";

export default function buy() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [concert, setConcert] = useState(null);
  const [imageConcert, setImageConcert] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketPriceVIP, setTicketPriceVIP] = useState(0);
  const [availUmum, setAvailUmum] = useState(false);
  const [availVip, setAvailVip] = useState(false);
  const [isEventClosed, setIsEventClosed] = useState(false);
  const [bands, setBands] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [ticketUmum, setTicketUmum] = useState(null);
  const [ticketVip, setTicketVip] = useState(null);
  const [showModalOrder, setShowModalOrder] = useState(false);
  const [isEmailExist, setIsEmailExist] = useState(false);
  const { id } = router.query;

  const defaultTicketType = 'umum';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      router.push('/login');
    } else if (role === "Admin") {
      router.push('/admin/concerts');
    } else if (token) {
      setIsLoggedIn(true);
    }
    if (id) {
      const fetchConcert = async () => {
        try {
          const { response } = await concertApi.getConcert(id);
          if (response) {
            setConcert(response);
            setImageConcert(response.image_concert);
            setIsEventClosed(new Date(response.start_date) < new Date());
          }
        } catch (error) {
          console.error("Error fetching concert:", error);
        }
      };
      const fetchTicket = async () => {
        try {
          const { response } = await ticketApi.getTicketsByConcert(id);
          if (response) {
            if (response.umum_ticket) {
              setTicketPrice(response.umum_ticket.price);
              setAvailUmum(response.umum_ticket.available);
              setTicketUmum(response.umum_ticket);
            }
            if (response.vip_ticket) {
              setTicketPriceVIP(response.vip_ticket.price);
              setAvailVip(response.vip_ticket.available);
              setTicketVip(response.vip_ticket);
            }
          }
        } catch (error) {
          console.error("Error fetching ticket:", error);
        }
      };
      const fetchBand = async () => {
        try {
          const { response } = await bandApi.getBandByConcert(id);
          if (response) {
            setBands(response);
          }
        } catch (error) {
          console.error("Error fetching band:", error);
        }
      };
      const fetchUser = async () => {
        try {
          const { response } = await userApi.checkEmailUser(localStorage.getItem('idUser'));
          if (response) {
            if(response.message === 'Email user sudah ada'){
              setIsEmailExist(true)
            } else if (response.message === 'Email user tidak ditemukan') {
              setIsEmailExist(false)
            }
          }
        } catch (error) {
          console.error("Error fetching band:", error);
        }
      };
      fetchConcert();
      fetchTicket();
      fetchBand();
      fetchUser();
    }

    setSelectedTicketType(defaultTicketType);

  }, [router, id, defaultTicketType]);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('idUser');
    localStorage.removeItem('haveOrdered');
    router.push('/login');
    setShowModal(false);
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const convertConcertTicket = (ticketPrice) => {
    const price = Number(ticketPrice);
    return price.toLocaleString('id-ID');
  };

  const handleOrder = () => {
    if (isEmailExist){
      localStorage.setItem("haveOrdered", true);
      if (selectedTicketType === 'umum'){
        router.push(`/payment/${ticketUmum.ticket_id}`);
      } else if (selectedTicketType === 'vip'){
        router.push(`/payment/${ticketVip.ticket_id}`);
      }
    } else {
      setShowModalOrder(true)
    }
  }

  const formattedPriceUmum = convertConcertTicket(ticketPrice);
  const formattedPriceVIP = convertConcertTicket(ticketPriceVIP);

  return (
    <div className="bg-white text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white border-b border-gray-200">
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
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
          ) : (
            <>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(true)}
              >
                Logout
              </button>
              {showModal && (
                <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout} />
              )}
            </>
          )}
        </div>
      </header>

      {concert && (
        <section className="p-8 border-b border-gray-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1 w-62 mt-2">
              <img src={imageConcert} alt="Event" className="w-full h-[450px] object-center rounded-md" />
            </div>
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-purple-800 mb-3">{concert.nama}</h2>
              <div className="flex space-x-20">
                <div className="mt-2">
                  <div className="flex items-center mb-3">
                    <img src="/images/logos/location.png" alt="Logo" className="w-6 h-6 mr-2" />
                    <div className="font-medium">{concert.lokasi}</div>
                  </div>
                  <div className="flex items-center">
                    <img src="/images/logos/alarm.png" alt="Logo" className="w-6 h-6 mr-2" />
                    <div className="font-medium">{formatDateRange(concert.start_date, concert.end_date)}</div>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl mt-4 font-medium text-purple-800 mb-2">Deskripsi</h2>
              <p className="text-gray-700">
                {concert.deskripsi}
              </p>
              <h2 className="text-2xl mt-3 font-medium text-purple-800 mb-4">List Band</h2>
              <div className="flex space-x-10 overflow-x-auto">
                {bands.map((band, index) => (
                  <div key={index} className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden w-52 flex-shrink-0">
                    <img
                      src={band.image_band}
                      alt="Band"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 text-center font-bold">{band.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="flex items-center mt-8 mb-8 gap-x-36 px-5">
        <div
          className={`flex items-center border rounded-sm w-80 ${!availUmum || isEventClosed ? 'cursor-not-allowed border-gray-400' : (selectedTicketType === 'umum' ? 'border-2 border-purple-600 cursor-pointer' : 'border-gray-400 cursor-pointer')}`}
          onClick={availUmum && !isEventClosed ? () => setSelectedTicketType('umum') : null}
        >
          <div className="w-2 h-24 bg-purple-600"></div>
          <div className="ml-2 flex items-center w-full">
            <div className="ml-5">
              <div className="font-bold mb-2">Umum</div>
              <div>IDR {formattedPriceUmum}</div>
            </div>
            {!availUmum && (
              <div className="ml-24 text-red-500 font-bold">Sold Out</div>
            )}
            {isEventClosed && (
              <div className="ml-24 text-gray-600 font-bold">Closed</div>
            )}
          </div>
        </div>
        <div
          className={`flex items-center border rounded-sm w-80 ${!availVip || isEventClosed ? 'cursor-not-allowed border-gray-400' : (selectedTicketType === 'vip' ? 'border-2 border-blue-500 cursor-pointer' : 'border-gray-400 cursor-pointer')}`}
          onClick={availVip && !isEventClosed ? () => setSelectedTicketType('vip') : null}
        >
          <div className="w-2 h-24 bg-blue-500"></div>
          <div className="ml-2 flex items-center w-full">
            <div className="ml-5">
              <div className="font-bold mb-2">VIP</div>
              <div>IDR {formattedPriceVIP}</div>
            </div>
            {!availVip && !isEventClosed && (
              <div className="ml-24 text-red-500 font-bold">Sold Out</div>
            )}
            {isEventClosed && (
              <div className="ml-24 text-gray-600 font-bold">Closed</div>
            )}
          </div>
        </div>
      </div>
      <h2 className="text-2xl ml-5 font-bold text-purple-800 mb-4">Terms and Condition</h2>
      <p className="text-gray-700 text-base ml-5 mr-10 mb-4">Dengan membeli tiket ini, saya mengakui bahwa saya telah membaca dan setuju dengan syarat dan ketentuan yang berlaku untuk melanjutkan pembayaran. Singkatnya, dalam hal terjadi FORCE MAJEURE (seperti Gempa Bumi, Gunung Meletus, Banjir, Tsunami, Pandemik dan/atau Epidemik, Pernyataan Perang, Perang, Terorisme) dan/atau keputusan darurat nasional dari pemerintah, Panitia memiliki hak untuk membatalkan atau menjadwalkan ulang acara secara sepihak. Sebagai pembeli, saya setuju untuk membebaskan Panitia dan Penyedia Layanan dari segala tuntutan. </p>
      <div className="p-4 mt-5 mb-10 ml-5 border rounded-lg max-w-md border-gray-700">
        <h2 className="text-xl font-bold mb-4">Your Orders</h2>
        <div className="flex justify-between mb-2">
          <span>{selectedTicketType === 'umum' ? 'Umum' : 'VIP'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>x1</span>
          <span className="font-bold">
            IDR {selectedTicketType === 'umum' ? formattedPriceUmum : formattedPriceVIP}
          </span>
        </div>
        <hr className="my-4 border-2 border-dotted border-black" />
        <div className="flex justify-between mb-4">
          <span className="font-bold">Total :</span>
          <span className="font-bold">
            IDR {selectedTicketType === 'umum' ? formattedPriceUmum : formattedPriceVIP}
          </span>
        </div>
        <div className="flex justify-end">
          {isEventClosed ? (
            <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed" disabled>
              Closed
            </button>
          ) : (
            <button onClick={() => handleOrder()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              Order
            </button>
          )}
        </div>
      </div>
      {showModalOrder && (
        <ModalOrder setShowModalOrder={setShowModalOrder} selectedTicketType={selectedTicketType}/>
      )}
    </div>
  );
}
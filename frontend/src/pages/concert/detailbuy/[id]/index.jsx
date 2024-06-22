/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useEffect} from "react";
import ModalLogout from "@/components/ModalLogout";
import concertApi from "@/api/modules/concerts.api";
import bandApi from "@/api/modules/bands.api";
import ticketApi from "@/api/modules/tickets.api";

export default function buy() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [concert, setConcert] = useState(null);
    const [imageConcert, setImageConcert] = useState(null);
    const [ticketPrice, setTicketPrice] = useState(null)
    const [ticketPriceVIP, setTicketPriceVIP] = useState(null)
    const [bands, setBands] = useState([])
    const { id } = router.query;
    const handleLogoClick = () => {
      router.push('/');
    };

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
        if (id){
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

      {concert && (
        <section className="p-8 border-b border-gray-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1 w-62 mt-2">
              <img src={imageConcert} alt="Event" className="w-full h-full object-cover rounded-md"/>
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
        </section>
      )}
      <div className="flex items-center mt-8 mb-8 gap-x-36 px-5">
      <div className="flex items-center border border-gray-200 rounded-lg w-80">
          <div className="w-2 h-24 bg-blue-500"></div>
          <div className="ml-2 flex items-center w-full">
            <div className="ml-5">
              <div className="font-bold mb-2">Umum</div>
              <div>IDR 100.000</div>
            </div>
            <div className="ml-24 text-red-500 font-bold">Sold Out</div>
          </div>
        </div>
        <div className="flex items-center border border-gray-200 rounded-lg w-80">
          <div className="w-2 h-24 bg-blue-500"></div>
          <div className="ml-2 flex items-center w-full">
            <div className="ml-5">
              <div className="font-bold mb-2">VIP</div>
              <div>IDR 500.000</div>
            </div>
            <div className="ml-24 text-red-500 font-bold">Sold Out</div>
          </div>
        </div>
      </div>
      <h2 className="text-2xl ml-5 font-bold text-purple-800 mb-4">Terms and Condition</h2>
      <p className="text-gray-700 text-base ml-5 mr-10 mb-4">Dengan membeli tiket ini, saya mengakui bahwa saya telah membaca dan setuju dengan syarat dan ketentuan yang berlaku untuk melanjutkan pembayaran. Singkatnya, dalam hal terjadi FORCE MAJEURE (seperti Gempa Bumi, Gunung Meletus, Banjir, Tsunami, Pandemik dan/atau Epidemik, Pernyataan Perang, Perang, Terorisme) dan/atau keputusan darurat nasional dari pemerintah, Panitia memiliki hak untuk membatalkan atau menjadwalkan ulang acara secara sepihak. Sebagai pembeli, saya setuju untuk membebaskan Panitia dan Penyedia Layanan dari segala tuntutan. </p>
    </div>
    );
}

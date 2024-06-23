import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ticketApi from '@/api/modules/tickets.api';
import concertApi from '@/api/modules/concerts.api';
import userApi from '@/api/modules/users.api';
import paymentApi from '@/api/modules/payments.api';
import ModalBuy from '@/components/ModalBuy';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';

export default function Payment() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState(null);
  const [concert, setConcert] = useState(null);
  const [email, setEmail] = useState('');
  const [showModalBuy, setShowModalBuy] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [isOnRequest, setIsOnRequest] = useState(false);
  const [toName, setToName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const haveOrdered = localStorage.getItem('haveOrdered');
    if (!token) {
      router.push('/login');
    } else if (role === 'Admin') {
      router.push('/admin/concerts');
    } else if (haveOrdered) {
      if (id) {
        setOrdered(true);
        const fetchTicket = async () => {
          try {
            const { response } = await ticketApi.getTicket(id);
            if (response) {
              setTicket(response);
            }
          } catch (error) {
            console.error('Error fetching ticket:', error);
          }
        };
        const fetchUser = async () => {
          try {
            const { response } = await userApi.checkEmailUser(localStorage.getItem('idUser'));
            if (response) {
              setEmail(response.email);
              setToName(response.username)
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        };
        fetchTicket();
        fetchUser();
      } else {
        setOrdered(false);
      }
    }
  }, [router, id]);

  useEffect(() => {
    if (ticket) {
      const fetchConcert = async () => {
        try {
          const concertResponse = await concertApi.getConcert(ticket.concert_id);
          if (concertResponse) {
            setConcert(concertResponse.response);
          }
        } catch (error) {
          console.error('Error fetching concert:', error);
        }
      };
      fetchConcert();
    }
  }, [ticket]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();

    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return `${day}${ordinalSuffix(day)} ${month} ${year}`;
  };

  const handleBuy = async () => {
    if (isOnRequest) return;
    setIsOnRequest(true);
    try {
      const formData = new FormData();
      formData.append('IdUser', localStorage.getItem('idUser'));
      formData.append('IdTicket', ticket.ticket_id);
      formData.append('PaymentDate', new Date().toISOString().split('T')[0]);
      formData.append('Amount', ticket.price);

      const { response, error } = await paymentApi.createPayment(formData);

      if (response) {
        const templateParams = {
          to_name: toName,
          from_name: 'E-Ticket Booking Concert',
          to_email: email,
          message: `Thank you for purchasing the ticket for ${concert.nama}.\n
                    Ticket ID: ${ticket.ticket_id}\n
                    Payment Date: ${getCurrentDate()}\n
                    Total Amount: IDR ${formatNumber(ticket.price)}`
        };

        emailjs
          .send('service_itsdn4a', 'template_y9xtf94', templateParams, {
            publicKey: 'o3L5J7U0Fk_B5zku8',
          })
          .then((response) => {
            console.log('Email sent:', response.status, response.text);
          })
          .catch((error) => {
            console.error('Email sending failed:', error);
          });

        toast.success('Tiket berhasil dibeli! Email konfirmasi telah dikirim.');
        localStorage.removeItem('haveOrdered');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
      if (error) {
        toast.error(`${error.data.message}`);
        localStorage.removeItem('haveOrdered');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
      localStorage.removeItem('haveOrdered');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
    setShowModalBuy(false);
  };

  if (!ordered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Not Found 404</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Payment</h2>
        {ticket && concert ? (
          <>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm">
                  <p className="font-bold">ID TICKET</p>
                  <p>{ticket.ticket_id}</p>
                </div>
                <div className="text-sm">
                  <p className="font-bold">PAYMENT DATE</p>
                  <p>{getCurrentDate()}</p>
                </div>
                <div className="text-sm">
                  <p className="font-bold">NAME CONCERT</p>
                  <p>{concert.nama}</p>
                </div>
                <div className="text-sm">
                  <p className="font-bold">EMAIL</p>
                  <p>{email}</p>
                </div>
              </div>
              <p className="text-sm text-red-500 mt-2">
                This information can be accessed in your email
              </p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Order Details</h3>
              <div className="flex justify-between text-sm">
                <p>1x {ticket.ticketType}</p>
                <p>IDR {formatNumber(ticket.price)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center font-bold text-xl mb-4">
              <p>Totals (1 ticket)</p>
              <p>IDR {formatNumber(ticket.price)}</p>
            </div>
            <button
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              onClick={() => setShowModalBuy(true)}
            >
              Buy Ticket
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {showModalBuy && (
        <ModalBuy setShowModalBuy={setShowModalBuy} handleBuy={handleBuy} isOnRequest={isOnRequest} />
      )}
    </div>
  );
}
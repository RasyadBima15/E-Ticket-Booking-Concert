/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ticketApi from '@/api/modules/tickets.api';
import concertApi from '@/api/modules/concerts.api';
import userApi from '@/api/modules/users.api';
import ModalBuy from '@/components/ModalBuy';

export default function Payment() {
    const router = useRouter();
    const { id } = router.query;
    const [ticket, setTicket] = useState(null);
    const [concert, setConcert] = useState(null);
    const [email, setEmail] = useState(false);
    const [showModalBuy, setShowModalBuy] = useState(false);
    const [ordered, setOrdered] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const haveOrdered = localStorage.getItem('haveOrdered');
        if (!token) {
          router.push('/login');
        } else if (role === "Admin") {
          router.push('/admin/concerts');
        } else if (haveOrdered) {
          if (id) {
            setOrdered(true)
            const fetchTicket = async () => {
              try {
                const { response } = await ticketApi.getTicket(id);
                console.log(response);
                if (response) {
                  setTicket(response);
                }
              } catch (error) {
                console.error("Error fetching ticket:", error);
              }
            };
            const fetchUser = async () => {
              try {
                const { response } = await userApi.checkEmailUser(localStorage.getItem('idUser'));
                if (response) {
                  setEmail(response.email);
                }
              } catch (error) {
                console.error("Error fetching band:", error);
              }
            };
            fetchTicket();
            fetchUser();
          } else if (!haveOrdered){
            setOrdered(false)
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
                console.error("Error fetching concert:", error);
              }
            };
            fetchConcert();
        }
    }, [ticket]);

    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const getCurrentDate = () => {
      const now = new Date();
      const day = now.getDate();
      const month = now.toLocaleString('default', { month: 'long' });
      const year = now.getFullYear();

      const ordinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };

      return `${day}${ordinalSuffix(day)} ${month} ${year}`;
    }

    const handleBuy = () => {
      setShowModalBuy(false);
    };

    if (!ordered) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Not Found 404</h2>
        </div>
    )}

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
                  this information can be accessed in your email
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
              <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700" onClick={() => setShowModalBuy(true)}>
                Buy Ticket
              </button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {showModalBuy && (
          <ModalBuy setShowModalBuy={setShowModalBuy} handleBuy={handleBuy}/>
        )}
      </div>
    );
}
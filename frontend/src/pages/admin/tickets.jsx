/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Sidebar from '@/components/Sidebar';
import ModalLogout from "@/components/ModalLogout";
import ticketApi from '@/api/modules/tickets.api';
import concertApi from '@/api/modules/concerts.api';

export default function Tickets() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [concerts, setConcerts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      router.push('/login');
    } else if (role === "User") {
      router.push('/');
    } else {
      const fetchTickets = async () => {
        const { response: ticketResponse } = await ticketApi.getAllTickets();
        const { response: concertResponse } = await concertApi.getAllConcerts();
        if (ticketResponse) {
          setTickets(ticketResponse);
        }
        if (concertResponse){
          setConcerts(concertResponse);
        }
      };
      fetchTickets();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('idUser');
    router.push('/login');
    setShowModal(false);
  };

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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <div className='flex'>
      <Sidebar setShowModal={setShowModal} />
      <main className='flex-1 h-screen overflow-auto bg-gray-100 p-8 ml-[20%]'>
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
              {tickets.map((ticket, index) => (
                <tr key={index} className="bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">{ticket.IdTicket}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{getConcertNameById(ticket.IdConcert)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{ticket.TicketType}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{ticket.Status}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{formatRupiah(ticket.Price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {showModal && (
        <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout} />
      )}
    </div>
  );
}

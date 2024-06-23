/* eslint-disable react-hooks/rules-of-hooks */
import React , { useState } from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from '@/components/Sidebar'
import ModalLogout from "@/components/ModalLogout";
import paymentApi from '@/api/modules/payments.api';
import userApi from '@/api/modules/users.api';
import concertApi from '@/api/modules/concerts.api';
import ticketApi from '@/api/modules/tickets.api';

export default function payments() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      router.push('/login')
    } else if (role == "User"){
      router.push('/')
    } else {
      const fetchPayments = async () => {
        const { response: paymentResponse } = await paymentApi.getAllPayments();
        const { response: userResponse } = await userApi.getAllUsers();
        const { response: ticketResponse } = await ticketApi.getAllTickets();
        const { response: concertResponse } = await concertApi.getAllConcerts();

        if (paymentResponse) {
          setPayments(paymentResponse);
        }
        if(userResponse){
          setUsers(userResponse);
        }
        if(ticketResponse){
          setTickets(ticketResponse)
        }
        if(concertResponse){
          setConcerts(concertResponse)
        }
      };
      fetchPayments();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('idUser');
    router.push('/login');
    setShowModal(false);
  };

  const getConcertByTicketId = (ticketId) => {
    if (tickets.length > 0){
      const ticket = tickets.find(ticket => ticket.IdTicket === ticketId);
      if (!ticket){
        return 'Unknown';
      }
      return ticket.IdConcert
    }
    return 'Unknown';
  };

  const getConcertNameById = (ticketId) => {
    const concertId = getConcertByTicketId(ticketId)
    if (concerts.length > 0){
      const concert = concerts.find(concert => concert.concert_id === concertId);
      if (!concert){
        return 'Unknown';
      }
      return concert.nama
    }
    return 'Unknown';
  };

  const getUserEmailById = (userId) => {
    if (users.length > 0){
      const user = users.find(user => user.idUser === userId);
      if (!user){
        return 'Unknown';
      }
      return user.Email
    }
    return 'Unknown';
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <div className='flex'>
      <Sidebar setShowModal={setShowModal}/>
      <main className='flex-1 h-screen overflow-auto bg-gray-100 p-8 ml-[20%]'>
      <h1 className="text-2xl font-bold mb-8">List Payments</h1>
      <div className="bg-white rounded shadow-md p-4">
          <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Id Ticket</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Concert Name</th>
                <th className="border border-gray-300 px-4 py-2">Payment Date</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
            {payments.map((payment, index) => (
              <tr key={index} className="bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">{payment.ticket_id}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{getUserEmailById(payment.user_id)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{getConcertNameById(payment.ticket_id)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{formatRupiah(payment.amount)}</td>
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
    </div>
  )
}

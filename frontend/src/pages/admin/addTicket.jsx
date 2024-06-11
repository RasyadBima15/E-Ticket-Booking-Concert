/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from '../../components/Sidebar'
import { useFormik } from 'formik';
import ModalLogout from '@/components/ModalLogout';

export default function addTicket() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isOnRequest, setIsOnRequest] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) {
        router.push('/login')
        } else if (role == "User"){
        router.push('/')
        }
    }, [router]);

    const dummyConcerts = [
        { id: 1, name: 'Concert 1' },
        { id: 2, name: 'Concert 2' },
        { id: 3, name: 'Concert 3' }
    ];

    const dummyTicketType = [
        { id: 1, ticketType: 'Umum' },
        { id: 2, ticketType: 'VIP' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
        setShowModal(false);
    };

    const formik = useFormik({
        initialValues: {
            namaConcert: '',
            ticketType: '',
            price: 0,
            totalGenerateTicket: 0
        },
        validate: values => {
            const errors = {};
            if (!values.namaConcert) {
                errors.namaConcert = 'Required';
            }
            if (!values.ticketType) {
                errors.ticketType = 'Required';
            }
            if (!values.price) {
                errors.price = 'Required';
            } else if (isNaN(values.price)) {
                errors.price = 'Must be a number';
            }
            if (!values.totalGenerateTicket) {
                errors.totalGenerateTicket = 'Required';
            } else if (isNaN(values.totalGenerateTicket)) {
                errors.totalGenerateTicket = 'Must be a number';
            }
            return errors;
        },
        onSubmit: values => {
            // Submit logic here
            console.log(values);
        },
    });

  return (
    <div className='min-h-screen flex'>
        <Sidebar setShowModal={setShowModal}/>
        <main className="w-4/5 bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-8">Generate Ticket</h1>
            <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="namaConcert" className="block text-gray-700 font-bold mb-2">Nama Concert</label>
                        <select
                            id="namaConcert"
                            name="namaConcert"
                            onChange={formik.handleChange}
                            value={formik.values.namaConcert}
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select Concert</option>
                            {dummyConcerts.map(concert => (
                                <option key={concert.id} value={concert.name}>{concert.name}</option>
                            ))}
                        </select>
                        {formik.errors.namaConcert ? <div className="text-red-500">{formik.errors.namaConcert}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="ticketType" className="block text-gray-700 font-bold mb-2">Ticket Type</label>
                        <select
                            id="ticketType"
                            name="ticketType"
                            onChange={formik.handleChange}
                            value={formik.values.ticketType}
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select Ticket Type</option>
                            {dummyTicketType.map(ticket => (
                                <option key={ticket.id} value={ticket.ticketType}>{ticket.ticketType}</option>
                            ))}
                        </select>
                        {formik.errors.ticketType ? <div className="text-red-500">{formik.errors.ticketType}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Price</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={formik.handleChange}
                            value={formik.values.price}
                        />
                        {formik.errors.price ? <div className="text-red-500">{formik.errors.price}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="totalGenerateTicket" className="block text-gray-700 font-bold mb-2">Total Generate Ticket</label>
                        <input
                            id="totalGenerateTicket"
                            name="totalGenerateTicket"
                            type="number"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={formik.handleChange}
                            value={formik.values.totalGenerateTicket}
                        />
                        {formik.errors.totalGenerateTicket ? <div className="text-red-500">{formik.errors.totalGenerateTicket}</div> : null}
                    </div>
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {isOnRequest ? "Generate Ticket..." : "Add Ticket"}
                    </button>
                </form>
        </main>
        {/* Aktifkan modal saat showModal bernilai true */}
        {showModal && (
                <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout}/>
        )}
    </div>
  )
}

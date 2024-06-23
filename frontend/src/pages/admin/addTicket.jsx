/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { useRouter} from "next/router";
import Sidebar from '../../components/Sidebar';
import { useFormik } from 'formik';
import ModalLogout from '@/components/ModalLogout';
import concertApi from '@/api/modules/concerts.api';
import ticketApi from '@/api/modules/tickets.api';

export default function addTicket() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isOnRequest, setIsOnRequest] = useState(false);
    const [concerts, setConcerts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) {
            router.push('/login');
        } else if (role === "User") {
            router.push('/');
        } else {
            const fetchConcerts = async () => {
                try {
                    const { response } = await concertApi.getAllConcerts();
                    if (response) {
                        setConcerts(response);
                    }
                } catch (error) {
                    setErrorMessage('Failed to fetch concerts');
                }
            };
            fetchConcerts();
        }
    }, [router]);

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
        onSubmit: async (values) => {
            if (isOnRequest) return;
            setIsOnRequest(true);

            try {
                const { response, error } = await ticketApi.createTicket({
                    IdConcert: values.namaConcert,
                    TicketType: values.ticketType,
                    Price: values.price,
                    totalTicket: values.totalGenerateTicket,
                    Status: 'Available'
                });
                if (response) {
                    router.push('/admin/tickets');
                }
                if (error) {
                    setErrorMessage(error.message);
                }
            } catch (error) {
                setErrorMessage("Failed to generate ticket. Please try again!");
            }
            setIsOnRequest(false);
        },
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('idUser');
        router.push('/login');
        setShowModal(false);
    };

    return (
        <div className='flex'>
            <Sidebar setShowModal={setShowModal} />
            <main className="flex-1 h-screen overflow-auto bg-gray-100 p-8 ml-[20%]">
                <h1 className="text-2xl font-bold mb-8">Generate Ticket</h1>
                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
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
                            {concerts && concerts.map(concert => (
                                <option key={concert.concert_id} value={concert.concert_id}>{concert.nama}</option>
                            ))}
                        </select>
                        {formik.errors.namaConcert && <div className="text-red-500 text-sm">{formik.errors.namaConcert}</div>}
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
                            <option value="Umum">Umum</option>
                            <option value="VIP">VIP</option>
                        </select>
                        {formik.errors.ticketType && <div className="text-red-500 text-sm">{formik.errors.ticketType}</div>}
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
                        {formik.errors.price && <div className="text-red-500 text-sm">{formik.errors.price}</div>}
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
                        {formik.errors.totalGenerateTicket && <div className="text-red-500 text-sm">{formik.errors.totalGenerateTicket}</div>}
                    </div>
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {isOnRequest ? "Generate Ticket..." : "Add Ticket"}
                    </button>
                </form>
            </main>
            {showModal && <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout} />}
        </div>
    );
}

/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from '../../components/Sidebar'
import { useFormik } from 'formik';
import ModalLogout from '@/components/ModalLogout';

export default function addBand() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) {
        router.push('/login')
        } else if (role == "User"){
        router.push('/')
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
        setShowModal(false);
    };

    const dummyConcerts = [
        { id: 1, name: 'Concert 1' },
        { id: 2, name: 'Concert 2' },
        { id: 3, name: 'Concert 3' }
    ];

    const formik = useFormik({
        initialValues: {
            namaBand: '',
            namaConcert: '',
            imageBand: ''
        },
        validate: values => {
            const errors = {};
            if (!values.namaBand) {
                errors.namaBand = 'Required';
            }
            if (!values.namaConcert) {
                errors.namaConcert = 'Required';
            }
            if (!values.imageBand) {
                errors.imageBand = 'Required';
            }
            return errors;
        },
        onSubmit: values => {
            // Submit logic here
            console.log(values);
        },
    });

    return (
        <div className="min-h-screen flex">
            <Sidebar setShowModal={setShowModal}/>
            <main className="w-4/5 bg-gray-100 p-8">
                <h1 className="text-2xl font-bold mb-8">Form Insert Data Band</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="namaBand" className="block text-gray-700 font-bold mb-2">Nama Band</label>
                        <input
                            id="namaBand"
                            name="namaBand"
                            type="text"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={formik.handleChange}
                            value={formik.values.namaBand}
                        />
                    </div>
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
                    </div>
                    <div className="mb-4">
                        <label htmlFor="imageBand" className="block text-gray-700 font-bold mb-2">Image Band</label>
                        <input
                            id="imageBand"
                            name="imageBand"
                            type="file"  // Jika ingin memungkinkan upload file
                            // type="text" // Jika ingin menggunakan input teks biasa
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(event) => {
                                formik.setFieldValue("imageBand", event.currentTarget.files[0]);
                            }}
                        />
                    </div>
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Add Band
                    </button>
                </form>
            </main>
            {/* Aktifkan modal saat showModal bernilai true */}
            {showModal && (
                <ModalLogout setShowModal={setShowModal} handleLogout={handleLogout}/>
            )}
        </div>
    );
}

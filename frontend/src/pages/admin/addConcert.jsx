/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from '../../components/Sidebar'
import { useFormik } from 'formik';
import ModalLogout from '@/components/ModalLogout';

export default function addConcert() {
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
    const formik = useFormik({
        initialValues: {
            namaConcert: '',
            imageConcert: '',
            startDate: '',
            endDate: '',
            deskripsi: ''
        },
        validate: values => {
            const errors = {};
            if (!values.namaConcert) {
                errors.namaConcert = 'Required';
            }
            if (!values.imageConcert) {
                errors.imageConcert = 'Required';
            }
            if (!values.startDate) {
                errors.startDate = 'Required';
            }
            if (!values.endDate) {
                errors.endDate = 'Required';
            }
            if (!values.deskripsi) {
                errors.deskripsi = 'Required';
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
                <h1 className="text-2xl font-bold mb-8">Form Insert Data Concert</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="namaConcert" className="block text-gray-700 font-bold mb-2">Nama Concert</label>
                        <input
                            id="namaConcert"
                            name="namaConcert"
                            type="text"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={formik.handleChange}
                            value={formik.values.namaConcert}
                        />
                        {formik.errors.namaConcert ? <div className="text-red-500">{formik.errors.namaConcert}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="imageConcert" className="block text-gray-700 font-bold mb-2">Image Concert</label>
                        <input
                            id="imageConcert"
                            name="imageConcert"
                            type="file"
                            accept="image/*"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(event) => {
                                formik.setFieldValue("imageConcert", event.currentTarget.files[0]);
                            }}
                        />
                        {formik.errors.imageConcert ? <div className="text-red-500">{formik.errors.imageConcert}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">Start Date</label>
                        <input
                            id="startDate"
                            name="startDate"
                            type="date"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={formik.handleChange}
                            value={formik.values.startDate}
                        />
                        {formik.errors.startDate ? <div className="text-red-500">{formik.errors.startDate}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">End Date</label>
                        <input
                            id="endDate"
                            name="endDate"
                            type="date"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={formik.handleChange}
                            value={formik.values.endDate}
                        />
                        {formik.errors.endDate ? <div className="text-red-500">{formik.errors.endDate}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="deskripsi" className="block text-gray-700 font-bold mb-2">Deskripsi</label>
                        <textarea
                            id="deskripsi"
                            name="deskripsi"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={formik.handleChange}
                            value={formik.values.deskripsi}
                        ></textarea>
                        {formik.errors.deskripsi ? <div className="text-red-500">{formik.errors.deskripsi}</div> : null}
                    </div>
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Add Concert
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

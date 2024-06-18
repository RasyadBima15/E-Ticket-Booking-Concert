/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from '../../components/Sidebar'
import { useFormik } from 'formik';
import ModalLogout from '@/components/ModalLogout';
import concertApi from '@/api/modules/concerts.api';

export default function addConcert() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isOnRequest, setIsOnRequest] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) {
        router.push('/login')
        } else if (role == "User"){
        router.push('/')
        }
    }, [router]);

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        concertForm.setFieldValue('imageConcert', uploadedFile);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
        setShowModal(false);
    };
    const concertForm = useFormik({
        initialValues: {
            namaConcert: '',
            location: '',
            imageConcert: null,
            startDate: '',
            endDate: '',
            deskripsi: ''
        },
        validate: values => {
            const errors = {};
            if (!values.namaConcert) {
                errors.namaConcert = 'Required';
            }
            if (!values.location) {
                errors.location = 'Required';
            }
            if (!values.imageConcert) {
                errors.imageConcert = 'Image Concert is required';
            }
            if (!values.startDate) {
                errors.startDate = 'Required';
            }
            if (!values.endDate) {
                errors.endDate = 'Required';
            } else if (values.endDate < values.startDate) {
                errors.endDate = 'End Date must be equal to or greater than Start Date';
            }
            if (!values.deskripsi) {
                errors.deskripsi = 'Required';
            }
            return errors;
        },
        onSubmit: async (values) => {
            if (isOnRequest) return;
            setIsOnRequest(true);

            try {
                const formData = new FormData();
                formData.append('Nama', values.namaConcert);
                formData.append('Lokasi', values.location);
                formData.append('ImageConcert', values.imageConcert);
                formData.append('StartDate', values.startDate);
                formData.append('EndDate', values.endDate);
                formData.append('Deskripsi', values.deskripsi);
                const { response, error } = await concertApi.createConcert(formData); 
        
                if (response) {
                    concertForm.resetForm();
                    router.push('/admin/concerts');
                }
        
                if (error) {
                    setErrorMessage(error.message);
                }
            } catch (error) {
                setErrorMessage("Pendaftaran gagal. Silahkan coba lagi!");
            }
            setIsOnRequest(false)
        },
    });
  
  return (
        <div className="flex">
            <Sidebar setShowModal={setShowModal}/>
            <main className="flex-1 h-screen overflow-auto bg-gray-100 p-8 ml-[20%]">
                <h1 className="text-2xl font-bold mb-8">Form Insert Data Concert</h1>
                <form onSubmit={concertForm.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="namaConcert" className="block text-gray-700 font-bold mb-2">Nama Concert</label>
                        <input
                            id="namaConcert"
                            name="namaConcert"
                            type="text"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={concertForm.handleChange}
                            value={concertForm.values.namaConcert}
                        />
                        {concertForm.errors.namaConcert ? <div className="text-red-500">{concertForm.errors.namaConcert}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Location</label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={concertForm.handleChange}
                            value={concertForm.values.location}
                        />
                        {concertForm.errors.location ? <div className="text-red-500">{concertForm.errors.location}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="imageConcert" className="block text-gray-700 font-bold mb-2">Image Concert</label>
                        <input
                            id="imageConcert"
                            name="imageConcert"
                            type="file"
                            accept="image/*"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={handleFileChange}
                        />
                        {concertForm.errors.imageConcert && <div className="text-red-500">{concertForm.errors.imageConcert}</div>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">Start Date</label>
                        <input
                            id="startDate"
                            name="startDate"
                            type="date"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={concertForm.handleChange}
                            value={concertForm.values.startDate}
                        />
                        {concertForm.errors.startDate ? <div className="text-red-500">{concertForm.errors.startDate}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">End Date</label>
                        <input
                            id="endDate"
                            name="endDate"
                            type="date"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={concertForm.handleChange}
                            value={concertForm.values.endDate}
                        />
                        {concertForm.errors.endDate ? <div className="text-red-500">{concertForm.errors.endDate}</div> : null}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="deskripsi" className="block text-gray-700 font-bold mb-2">Deskripsi</label>
                        <textarea
                            id="deskripsi"
                            name="deskripsi"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={concertForm.handleChange}
                            value={concertForm.values.deskripsi}
                        ></textarea>
                        {concertForm.errors.deskripsi ? <div className="text-red-500">{concertForm.errors.deskripsi}</div> : null}
                    </div>
                    {errorMessage && <div className="mt-2 mb-2 text-sm text-red-600">{errorMessage}</div>}
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

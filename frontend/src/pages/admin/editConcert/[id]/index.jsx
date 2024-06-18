/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react'
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import Sidebar from '../../../../components/Sidebar'
import { useFormik } from 'formik';
import ModalLogout from '@/components/ModalLogout';
import concertApi from '@/api/modules/concerts.api';

export default function editConcert() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isOnRequest, setIsOnRequest] = useState(false);
    const [error, setError] = useState(undefined);
    const [concert, setConcert] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const { id } = router.query;

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) {
            router.push('/login')
        } else if (role == "User"){
            router.push('/')
        } else {
            const fetchConcert = async () => {
              const { response } = await concertApi.getConcert(id);
              if (response) {
                setConcert(response);
                setExistingImage(response.image_concert.replace('C:\\Users\\ASUS\\Documents\\Semester 4 Sisfo\\Pemrograman Web Lanjutan\\Tugas\\E-Ticket Booking Concert\\frontend\\public', '').replace(/\\/g, '/'));
              }
            };
            fetchConcert();
        }
    }, [router, id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
        setShowModal(false);
    };
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        // Menambahkan leading zero jika diperlukan
        month = month.length === 1 ? '0' + month : month;
        day = day.length === 1 ? '0' + day : day;
        return `${year}-${month}-${day}`;
    };

    const concertForm = useFormik({
        initialValues: {
            namaConcert: concert ? concert.nama : '',
            location: concert ? concert.lokasi : '',
            startDate: concert ? formatDate(concert.start_date) : '',
            endDate: concert ? formatDate(concert.end_date) : '',
            deskripsi: concert ? concert.deskripsi : '',
            imageConcert: existingImage ? existingImage : null,
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
                errors.imageConcert = 'Required';
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
        enableReinitialize: true,
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
                const {response, error} = await concertApi.updateConcert(formData, id);
                if (response) {
                    concertForm.resetForm()
                    router.push('/admin/concerts')
                }
                if (error) {
                    setError(error.message)
                }
            } catch (error) {
                setError("Pendaftaran gagal. Silahkan coba lagi!")
            }
            setIsOnRequest(false)
        },
    });
  
  return (
        <div className="min-h-screen flex">
            <Sidebar setShowModal={setShowModal}/>
            <main className="w-4/5 bg-gray-100 p-8">
                <h1 className="text-2xl font-bold mb-8">Edit Data Concert</h1>
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
                        {existingImage && (
                            <div className="mb-2">
                                <Image src={`${existingImage}`} width={300} height={150} alt="Concert" className="object-cover"/>
                            </div>
                        )}
                        <input
                            id="imageConcert"
                            name="imageConcert"
                            type="file"
                            accept="image/*"
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(event) => {
                                concertForm.setFieldValue("imageConcert", event.currentTarget.files[0]);
                            }}
                        />
                        {concertForm.errors.imageConcert ? <div className="text-red-500">{concertForm.errors.imageConcert}</div> : null}
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
                    {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Edit Concert
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
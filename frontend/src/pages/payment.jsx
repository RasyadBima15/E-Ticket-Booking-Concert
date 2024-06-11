/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { useRouter } from "next/router";
import { useFormik } from 'formik';
import { useEffect } from "react";

export default function payment() {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token) {
          router.push('/login')
        } else if (role == "Admin"){
          router.push('/admin')
        }
    }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Payment Instruction</h2>
        <div className="p-4 mb-4 text-purple-700 bg-purple-100 rounded-lg">
          <span className="font-semibold">Please complete the booking before: 23.59, 21st May 2024</span>
        </div>
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm">
              <p className="font-bold">ORDER NUMBER</p>
              <p>123455678</p>
            </div>
            <div className="text-sm">
              <p className="font-bold">PAYMENT DATE</p>
              <p>21st May 2024</p>
            </div>
            <div className="text-sm">
              <p className="font-bold">AMOUNT TICKET</p>
              <p>1</p>
            </div>
            <div className="text-sm">
              <p className="font-bold">EMAIL</p>
              <p>dewinamk29@gmail.com</p>
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
            <p>1x Presale 1 <span className="text-gray-500">(date and time concert)</span></p>
            <p>IDR 135.000</p>
          </div>
        </div>
        <div className="flex justify-between items-center font-bold text-xl mb-4">
          <p>Totals (1 ticket)</p>
          <p>IDR 135.000</p>
        </div>
        <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Buy Ticket
        </button>
      </div>
    </div>
  )
}

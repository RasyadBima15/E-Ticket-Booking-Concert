/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { useRouter } from "next/router";
import { useFormik } from 'formik';
import { useEffect } from "react";

export default function order() {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token) {
          router.push('/login')
        } else if (role == "Admin"){
          router.push('/admin/concerts')
        }
    }, [router]);

    const formik = useFormik({
        initialValues: {
          fullname: '',
          email: '',
          phone: '',
          gender: '',
          terms: false,
        },
        validate: (values) => {
          const errors = {};
          if (!values.fullname) {
            errors.fullname = 'Required';
          }
          if (!values.email) {
            errors.email = 'Required';
          } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Invalid email address';
          }
          if (!values.phone) {
            errors.phone = 'Required';
          }
          if (!values.gender) {
            errors.gender = 'Required';
          }
          if (!values.terms) {
            errors.terms = 'Required';
          }
          return errors;
        },
        onSubmit: (values) => {
          console.log(values);
          // You can handle form submission here, e.g., sending data to a server
        },
    });
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Please Complete Your Data!
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="fullname">
                Fullname
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullname}
                className={`w-full px-3 py-2 border ${formik.touched.fullname && formik.errors.fullname ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-purple-500`}
              />
              {formik.touched.fullname && formik.errors.fullname ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.fullname}</p>
              ) : null}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full px-3 py-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-purple-500`}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              ) : null}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className={`w-full px-3 py-2 border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-purple-500`}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
              ) : null}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="gender">
                Gender
              </label>
              <input
                type="text"
                id="gender"
                name="gender"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.gender}
                className={`w-full px-3 py-2 border ${formik.touched.gender && formik.errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-purple-500`}
              />
              {formik.touched.gender && formik.errors.gender ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
              ) : null}
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="terms"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.terms}
                  className="form-checkbox h-5 w-5 text-purple-600"
                />
                <span className="ml-2 text-gray-700">
                  I agree to the applicable Terms and Conditions
                </span>
              </label>
              {formik.touched.terms && formik.errors.terms ? (
                <p className="text-red-500 text-sm mt-1">{formik.errors.terms}</p>
              ) : null}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => formik.resetForm()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Order Now
              </button>
            </div>
          </form>
        </div>
    );
}

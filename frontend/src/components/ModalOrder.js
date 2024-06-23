import React, { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import userApi from "@/api/modules/users.api";
import { useEffect } from "react";
import ticketApi from "@/api/modules/tickets.api";

const ModalOrder = ({ setShowModalOrder, selectedTicketType }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isOnRequest, setIsOnRequest] = useState(false);
  const [ticketUmum, setTicketUmum] = useState(null);
  const [ticketVip, setTicketVip] = useState(null);
  const { id } = router.query;

  useEffect(() => {
    if (id){
      const fetchTicket = async () => {
        try {
          const { response } = await ticketApi.getTicketsByConcert(id);
          if (response) {
            if (response.umum_ticket) {
              setTicketUmum(response.umum_ticket);
            }
            if (response.vip_ticket) {
              setTicketVip(response.vip_ticket);
            }
          }
        } catch (error) {
          console.error("Error fetching ticket:", error);
        }
      };
      fetchTicket()
    }  
  }, [id])

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
        errors.terms = 'Anda harus menyetujui terms dan conditions untuk melanjutkan';
      }
      return errors;
    },
    onSubmit: async (values) => {
        if (isOnRequest) return;
        setIsOnRequest(true);

        try {
            const formData = new FormData();
            formData.append('Fullname', values.fullname);
            formData.append('Email', values.email);
            formData.append('NoTelp', values.phone);
            formData.append('Gender', values.gender);

            const { response, error } = await userApi.updateUser(localStorage.getItem('idUser'), formData); 
            // console.log("response:", response);
            // console.log("error:", error);
            if (response) {
                formik.resetForm();
                localStorage.setItem("haveOrdered", true);
                if (selectedTicketType === 'umum'){
                  router.push(`/payment/${ticketUmum.ticket_id}`);
                } else if (selectedTicketType === 'vip'){
                  router.push(`/payment/${ticketVip.ticket_id}`);
                }        
            }
            if (error) {
                setErrorMessage(error.data.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Order gagal. Silahkan coba lagi!");
        }
        setIsOnRequest(false)
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Please Complete Your Data!
        </h2>
        <form onSubmit={formik.handleSubmit}>
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
            <div className="flex items-center">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.gender === 'male'}
                  className="form-radio h-5 w-5 text-purple-600 checked:bg-purple-600"
                />
                <span className="ml-2 text-gray-700">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.gender === 'female'}
                  className="form-radio h-5 w-5 text-purple-600 checked:bg-purple-600"
                />
                <span className="ml-2 text-gray-700">Female</span>
              </label>
            </div>
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
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
                {errorMessage}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setShowModalOrder(false)}
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
    </div>
  );
};

export default ModalOrder;

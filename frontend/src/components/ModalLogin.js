import React, { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import userApi from "@/api/modules/users.api";

const ModalLogin = ({ setShowModalLogin }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isOnRequest, setIsOnRequest] = useState(false);
  const { id } = router.query;

  const loginForm = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = "Required";
      }
      if (!values.password) {
        errors.password = "Required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      if (isOnRequest) return;

      setIsOnRequest(true);

      try {
        const {response, error} = await userApi.loginUser({
            Username: values.username,
            Password: values.password,
        })
        if (response) {
            loginForm.resetForm()
            localStorage.setItem("token", response.access_token);
            localStorage.setItem("role", response.role);

            if (response.role === "Admin"){
                router.push('/admin/concerts');  
            } else if (response.role === "User"){
                router.push(`/concert/detailbuy/${id}`);  
            }
        }
        if (error) {
            setErrorMessage(error.message)
        }
      } catch (error) {
        // console.error("Login error:", error);
        setErrorMessage("Login error:", error);
      }
        setIsOnRequest(false);
    },
  });

  const handleRegisterClick = () => {
    router.push('/register')
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="p-9">
            <div className="flex justify-end">
              <button
                className="text-gray-700 focus:outline-none"
                onClick={() => setShowModalLogin(false)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-center mb-5">Login</h1>
            <p className="text-sm font-medium text-red-700 mb-3">Anda harus login terlebih dahulu!</p>
            <form onSubmit={loginForm.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={loginForm.values.username}
                  onChange={loginForm.handleChange}
                  onBlur={loginForm.handleBlur}
                  className={`w-full p-2 mt-1 border ${loginForm.errors.username && loginForm.touched.username ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {loginForm.errors.username && loginForm.touched.username && (
                  <div className="mt-2 text-sm text-red-600">{loginForm.errors.username}</div>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={loginForm.values.password}
                  onChange={loginForm.handleChange}
                  onBlur={loginForm.handleBlur}
                  className={`w-full p-2 mt-1 border ${loginForm.errors.password && loginForm.touched.password ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {loginForm.errors.password && loginForm.touched.password && (
                  <div className="mt-2 text-sm text-red-600">{loginForm.errors.password}</div>
                )}
              </div>
              {errorMessage && <div className="mt-2 text-sm text-red-600">{errorMessage}</div>}
              <div>
                <button
                  type="submit"
                  disabled={isOnRequest}
                  className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isOnRequest ? "Go to the buy detail..." : "Login"}
                </button>
              </div>
            </form>
            <p className="text-sm text-gray-700 font-medium mt-4">
              Belum punya akun?{" "}
              <span
                className="text-purple-600 cursor-pointer"
                onClick={handleRegisterClick}
              >
                Register disini
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLogin;

import userApi from "@/api/modules/users.api";
import { useEffect } from "react";
import { useFormik } from "formik"
import { useRouter } from "next/router";
import { useState } from "react"

export default function Register() {

    const router = useRouter();
    const [isOnRequest, setIsOnRequest] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/");
        }
    });

    const registerForm = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
        validate: (values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Required";
            }
            if (!values.password) {
              errors.password = "Required";
            }
            if (values.password !== values.confirmPassword) {
              errors.confirmPassword = "Passwords do not match";
            }
            return errors;
        },
        onSubmit: async (values) => {
            if (isOnRequest) return;

            setIsOnRequest(true)
            try {
                const {response, error} = await userApi.registerUser({
                    Username: values.username,
                    Password: values.password,
                    Role: "User",
                })
                if (response) {
                    // console.log('Register Response:', response);
                    registerForm.resetForm()
                    // localStorage.setItem("token", response.access_token);
                    router.push('/login');
                }
                if (error) {
                    // console.log('Register Response:', error);
                    setErrorMessage(error.message)
                }
            } catch (error) {
                setErrorMessage("Pendaftaran gagal. Silahkan coba lagi!")
            }
            setIsOnRequest(false)
        }
    })
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold text-center">Register</h1>
            <form onSubmit={registerForm.handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
                </label>
                <input
                id="username"
                name="username"
                type="text"
                onChange={registerForm.handleChange}
                value={registerForm.values.username}
                className="w-full p-2 mt-1 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                {registerForm.errors.username ? (
                <div className="mt-2 text-sm text-red-600">{registerForm.errors.username}</div>
                ) : null}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
                </label>
                <input
                id="password"
                name="password"
                type="password"
                onChange={registerForm.handleChange}
                value={registerForm.values.password}
                className="w-full p-2 mt-1 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                {registerForm.errors.password ? (
                <div className="mt-2 text-sm text-red-600">{registerForm.errors.password}</div>
                ) : null}
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
                </label>
                <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={registerForm.handleChange}
                value={registerForm.values.confirmPassword}
                className="w-full p-2 mt-1 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                {registerForm.errors.confirmPassword ? (
                <div className="mt-2 text-sm text-red-600">{registerForm.errors.confirmPassword}</div>
                ) : null}
            </div>
            {errorMessage && <div className="mt-2 text-sm text-red-600">{errorMessage}</div>}
            <div>
                <button
                type="submit"
                disabled={isOnRequest}
                className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                {isOnRequest ? "Registering..." : "Register"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}

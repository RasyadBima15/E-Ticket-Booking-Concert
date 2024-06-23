import userApi from "@/api/modules/users.api";
import { useEffect } from "react";
import { useFormik } from "formik"
import { useRouter } from "next/router";
import { useState } from "react"

export default function Login() {
    const router = useRouter();
    const [isOnRequest, setIsOnRequest] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (token) {
            if (role === "User"){
                router.push("/");
            } else if (role === "Admin"){
                router.push("/admin/concerts")
            }
        }
    }, [router]);

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

            setIsOnRequest(true)
            try {
                const {response, error} = await userApi.loginUser({
                    Username: values.username,
                    Password: values.password,
                })
                if (response) {
                    loginForm.resetForm()
                    localStorage.setItem("token", response.access_token);
                    localStorage.setItem("role", response.role);
                    localStorage.setItem("idUser", response.idUser);

                    if (response.role === "Admin"){
                        console.log("test for admin");
                        router.push('/admin/concerts');  
                    } else if (response.role === "User"){
                        router.push('/');  
                    }
                }
                if (error) {
                    setErrorMessage(error.message)
                }
            } catch (error) {
                setErrorMessage("Pendaftaran gagal. Silahkan coba lagi!")
            }
            setIsOnRequest(false)
        }
    });

    const handleRegisterClick = () => {
        router.push('/register')
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 min-h-screen bg-gray-100">
        {/* Bagian Kiri (Logo dan Selamat Datang) */}
        <div className="flex items-center justify-center p-9 bg-cover bg-center rounded shadow-md" style={{ backgroundImage: `url('/images/bg_login.png')` }}>
            <div className="flex items-center text-white">
                <img src="/images/logos/logo1.png" alt="Logo" className="w-5 h-5 mr-2" />
                <div className="text-2xl font-bold">E-Ticket Booking Concert</div>
            </div>
        </div>
        {/* Bagian Kanan (Form Login) */}
        <div className="flex items-center justify-center p-9 bg-white rounded shadow-md">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-8">Login</h1>
                <form onSubmit={loginForm.handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            onChange={loginForm.handleChange}
                            value={loginForm.values.username}
                            className="w-full p-2 mt-1 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {loginForm.errors.username ? (
                            <div className="mt-2 text-sm text-red-600">{loginForm.errors.username}</div>
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
                            onChange={loginForm.handleChange}
                            value={loginForm.values.password}
                            className="w-full p-2 mt-1 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {loginForm.errors.password ? (
                            <div className="mt-2 text-sm text-red-600">{loginForm.errors.password}</div>
                        ) : null}
                    </div>
                    {errorMessage && <div className="mt-2 text-sm text-red-600">{errorMessage}</div>}
                    <div>
                        <button
                            type="submit"
                            disabled={isOnRequest}
                            className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isOnRequest ? "Go to the homepage..." : "Login"}
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
    
    );
}

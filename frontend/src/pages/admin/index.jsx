import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Admin() {
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

  return (
    <div className="min-h-screen flex">
      <aside className="w-1/4 bg-purple-800 text-white p-8">
        <h2 className="text-2xl font-bold mb-8">ADMIN DASHBOARD</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <span>List Concert</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <span>List Bands</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <span>List Payments</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <span>List Tickets</span>
              </a>
            </li>
            <li>
              {/* Tambahkan onClick untuk menampilkan modal saat tombol Logout ditekan */}
              <a href="#" className="flex items-center" onClick={() => setShowModal(true)}>
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
  
      <main className="w-3/4 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-8">List Concert</h1>
        <div className="mb-4 flex justify-end">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={() => router.push('/add-concert')}
          >
            Add Data
          </button>
        </div>
        <div className="bg-white rounded shadow-md p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Concert Name</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Number Ticket</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-200">
                <td className="border px-4 py-2">SummerRoad</td>
                <td className="border px-4 py-2">Parkiran Pipo</td>
                <td className="border px-4 py-2">02-02-2024</td>
                <td className="border px-4 py-2">03-02-2024</td>
                <td className="border px-4 py-2">400</td>
                <td className="border px-4 py-2">Lorem ipsum dolor</td>
                <td className="border px-4 py-2 flex justify-center">
                  <button className="mr-2 text-green-600">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-red-600">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              {/* Tambahkan baris lain sesuai data */}
            </tbody>
          </table>
        </div>
      </main>
      {/* Aktifkan modal saat showModal bernilai true */}
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white w-1/3 p-6 rounded-lg">
            <h2 className="text-xl mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-end">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
}

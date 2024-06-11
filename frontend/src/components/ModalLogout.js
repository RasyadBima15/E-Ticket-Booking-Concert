const ModalLogout = ({setShowModal, handleLogout}) => {
    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white w-1/3 p-6 rounded-lg">
            <h2 className="text-xl text-black mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-end">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
    );
}

export default ModalLogout;
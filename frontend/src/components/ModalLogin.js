const ModalLogin = ({setShowModalLogin, handleLogin}) => {
    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white w-1/3 p-6 rounded-lg">
            <h2 className="text-xl text-black mb-4">Anda harus login terlebih dahulu!</h2>
            <div className="flex justify-end">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2" onClick={() => setShowModalLogin(false)}>Cancel</button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogin}>Go to Login Page</button>
            </div>
          </div>
        </div>
    );
}

export default ModalLogin;
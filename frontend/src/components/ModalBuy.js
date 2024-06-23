const ModalBuy = ({setShowModalBuy, handleBuy}) => {
    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white w-1/3 p-6 rounded-lg">
            <h2 className="text-xl text-black mb-4">Apakah kamu yakin ingin membeli tiket ini?</h2>
            <div className="flex justify-end">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2" onClick={() => setShowModalBuy(false)}>Tidak</button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={handleBuy}>Ya</button>
            </div>
          </div>
        </div>
    );
}

export default ModalBuy;
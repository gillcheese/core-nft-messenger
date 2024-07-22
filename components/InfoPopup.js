// components/InfoPopup.js
const InfoPopup = ({ showInfoPopup, toggleInfoPopup }) => (
  showInfoPopup && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={toggleInfoPopup}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3 text-left">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Transactions</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              There are several transactions to approve:<br/>
              <br/>
              1. Upload image to Arweave<br/>
              2. Upload metadata to Arweave<br/>
              3. Mint and Send<br/>
              Please note there is a 0.001 SOL fee
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={toggleInfoPopup}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
);

export default InfoPopup;
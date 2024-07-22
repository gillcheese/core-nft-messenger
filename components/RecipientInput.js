// components/RecipientInput.js
const RecipientInput = ({ recipientAddress, handleRecipientChange }) => (
  <div className="mt-4">
    <input
      type="text"
      placeholder="Recipient Address"
      value={recipientAddress}
      onChange={handleRecipientChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default RecipientInput;
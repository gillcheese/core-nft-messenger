import React from 'react';

const MintingProgress = ({ steps }) => {
  return (
    <div className="mt-4">
      <ul className="space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex items-center">
            {step.completed ? (
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : step.inProgress ? (
              <svg className="w-4 h-4 mr-2 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            <span className={step.completed ? 'text-green-500' : (step.inProgress ? 'text-blue-500' : 'text-gray-500')}>
              {step.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MintingProgress;
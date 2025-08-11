import React from "react";

const Account = (props) => {
  return (
    <div className="min-h-screen  flex items-center justify-center flex-col gap-4">
      <h1 className="text-3xl font-bold">Metamask wallet is Connected</h1>
      <p>Metamask account is : {props.account}</p>
      <p className="connected-account">Remaining Time: {props.remainingTime}</p>

      {props.showButton ? (
        <h1 className="text-3xl font-bold">Already Voted</h1>
      ) : (
        <div>
          <input
            className="border-slate-800 border"
            type="number"
            onChange={props.handleInputChange}
            value={props.number}
          />
          <button onClick={props.voteFun} className="border p-4 font-bold">
            Vote
          </button>
        </div>
      )}

      <table className=" border border-gray-300 rounded-lg shadow-md text-sm sm:text-base">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700">
              Index
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">
              Candidate Name
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">
              Candidate Votes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-center">
          {props.candidates.map((candidate, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="px-4 py-2">{candidate.index}</td>
              <td className="px-4 py-2">{candidate.name}</td>
              <td className="px-4 py-2">{candidate.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Account;

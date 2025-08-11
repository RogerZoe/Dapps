import React from 'react'

const Login = (props) => {
  return (
    <div className='min-h-screen  flex items-center justify-center flex-col gap-4'>
         <h1 className='text-3xl font-bold'>Welcome to decentralized Voting Application</h1>
         <button onClick={props.connectWallet} className='border px-4 py-4 bg-blue-500 rounded font-bold text-white'>Login Metamask</button>
    </div>
  )
}

export default Login

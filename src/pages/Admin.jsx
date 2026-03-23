import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import {  IoHandLeftOutline,IoRemoveCircleOutline  } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { IoMdArrowDropleft } from "react-icons/io"

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users')
  const [users,setUsers]=useState([])
  const [transactions,setTransactions]=useState([])
  const [adminRequests,setAdminRequests]=useState([])
  const navigate=useNavigate()

  const tabs = ['Users', 'Transactions', 'Admin Requests']

  useEffect(()=>{
    async function fetchUsers(){
      const{data}=await supabase.from('profiles').select('*')
      setUsers(data)
    }
    fetchUsers()
  },[])

  {/*users functions section*/}
  async function handleDelete(userId){
      const{error}=await supabase.from('profiles').delete().eq('id',userId)
      if(error){
        alert(error.message)
        return
      }
      setUsers(prev=>prev.filter(u=>u.id !== userId))
  }

  async function handleBan(userId){
      const{error}= await supabase.from('profiles').update({banned:true}).eq('id',userId)
      if(error){
        alert(error.message)
        return
      }
      setUsers(prev=>prev.map(u=>u.id===userId?{ ...u,banned:true}:u))
  }

  {/*transactions section*/}
useEffect(()=>{
  async function fetchTransactions(){
  const { data } = await supabase
  .from('purchases')
  .select('*, products(title, price,seller_id),profiles(matricule)')
  
    setTransactions(data || [])
  }
  fetchTransactions()
},[users])

  {/* Admin request */}
 async function fetchAdminRequests(){
  try{
    const {data,error} =await supabase.from('admin_requests').select('*,profiles(*)')
    if(error) throw error
    setAdminRequests(data || [])
  }catch(err){
    console.error('Error fetching admin requests:',err)
    alert('faild to load admin requests')
  }
 }
useEffect(() => {
  fetchAdminRequests();
}, []); 

  {/* handle approve */}
  async function handleApprove(requestId,userId){
    await supabase.from('admin_requests').update({status: 'approved'}).eq('id',requestId)
    await supabase.from('profiles').update({role:'admin'}).eq('id',userId)
    await fetchAdminRequests()
  }

  {/* handle reject */}
async function handleReject(requestId) {
  await supabase
    .from('admin_requests')
    .update({ status: 'rejected' })
    .eq('id', requestId);
  await fetchAdminRequests(); //to refrech list
}
return (
  <div className="relative p-10 bg-[#F0F0F0] min-h-screen">
    <h1 className="text-2xl font-bold text-gray-700">Admin Panel</h1>
    <p className="text-gray-400 mb-6">Manage users, transactions and reports</p>

    {/* Tabs */}
    <div className="flex gap-4 mb-6">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab.toLowerCase())}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            activeTab === tab.toLowerCase()
              ? 'bg-gradient-to-r from-[#FF4760] to-[#FF4385] text-white'
              : 'bg-white text-gray-500 hover:text-[#FF4760]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Users Tab */}
    {activeTab === 'users' && (
      <div className="flex flex-col gap-3">
        {users.map(user => (
          <div key={user.id} className="relative bg-white rounded-2xl px-6 py-4 shadow-sm flex items-center justify-between">
            
            {/* Left - user info */}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-gray-700 font-semibold">
                <span className="font-bold">Student/Admin Id : </span>{user.matricule}
                {user.banned && <span className="ml-2 text-xs text-red-400 font-semibold bg-red-50 px-2 py-0.5 rounded-full">BANNED</span>}
              </p>
              <p className="text-xs font-semibold text-gray-400"><span className="text-sm text-black font-bold">User Id : </span>{user.id}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-500' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {user.role}
              </span>
            </div>

            {/* Right - action buttons */}
            {user.role !== 'admin' && (
              <div className="flex items-center gap-2">
                {!user.banned && (
                  <button
                    onClick={() => handleBan(user.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-white bg-orange-400 hover:bg-orange-500 px-3 py-1.5 rounded-full transition-colors duration-200"
                  >
                    <IoHandLeftOutline size={14} /> Ban
                  </button>
                )}
                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-white bg-red-400 hover:bg-red-500 px-3 py-1.5 rounded-full transition-colors duration-200"
                >
                  <IoRemoveCircleOutline size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
    {/* Transactions tab */}
   {activeTab === 'transactions' && (
  <div className="flex flex-col gap-3">
    {transactions.map(transaction => (
      <div key={transaction.id} className="bg-white rounded-2xl px-6 py-4 shadow-sm flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-gray-700">{transaction.products?.title}</p>
          <p className="text-xs text-gray-400">Buyer student id : {transaction.profiles?.matricule}</p>
          <p className="text-xs text-gray-400">Buyer ID: {transaction.buyer_id}</p>
          <p className="text-xs text-gray-400">Seller Id : {transaction.products?.seller_id}</p>
          <p className="text-xs text-gray-400">Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
        </div>
        <p className="font-bold text-sm bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">
          {transaction.products?.price} DA
        </p>
      </div>
    ))}
  </div>
)}
    {/* admin Tab */}
    {activeTab === 'admin requests' && (
      <div className="flex flex-col gap-3">
        {adminRequests.map(request=>(
          <div key={request.id} className="bg-white rounded-2xl px-6 py-4 shadow-sm flex justify-between items-center">
            <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-gray-700">{request.profiles?.matricule}</p>
            <p className="text-xs text-gray-400">Status: {request.status}</p>
            </div>
              {request.status==='pending' && (
                <div className="flex gap-2">
                  <button onClick={()=>handleApprove(request.id,request.user_id)}
                    className="text-xs font-semibold text-white bg-green-400 hover:bg-green-500 px-3 py-1.5 rounded-full transition-colors duration-200"  
                  >
                    Approve
                  </button>
                  <button
              onClick={() => handleReject(request.id)}
              className="text-xs font-semibold text-white bg-red-400 hover:bg-red-500 px-3 py-1.5 rounded-full transition-colors duration-200"
            >
              Reject
            </button>
                </div>
              )}
          </div>
        ))}
      </div>
    )
      }

    <div onClick={()=>navigate('/dashboard')} className="absolute top-3 left-3 flex items-center text-pink-800 cursor-pointer"><IoMdArrowDropleft size={20}/> <span className="font-semibold bg-gradient-to-r from-[#FF4760] to-[#FF4385] bg-clip-text text-transparent">Go Back</span></div>
  </div>
)}
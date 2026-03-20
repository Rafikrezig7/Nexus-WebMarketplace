import { useState } from "react"



export default function Admin() {const [activeTab, setActiveTab] = useState('users')
    const tabs = ['Users', 'Transactions', 'Admin Requests']
return (
  <div className="p-10">
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

    {/* Content */}
    {activeTab === 'users' && <div>Users list here</div>}
    {activeTab === 'transactions' && <div>Transactions here</div>}
    {activeTab === 'admin requests' && <div>Admin requests here</div>}
  </div>
)}
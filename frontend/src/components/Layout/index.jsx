import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex'>
      <Sidebar/>
      <div className='flex-1 h-dvh overflow-auto'>
      <Navbar/>
      <Outlet/>
      </div>
        
    </div>
  )
}

export default Layout

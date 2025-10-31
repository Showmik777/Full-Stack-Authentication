import React from 'react'
import Manubar from '../components/Manubar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col item-center justify-content-center min-vh-100'>
      <Manubar/>
      <Header/>
    </div>
  )
}

export default Home

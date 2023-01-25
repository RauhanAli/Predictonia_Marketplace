import React from 'react'
import Display from '../components/NFTs'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

export default function NFT(){
  return(
    <div>
      <Navbar />
      <div>
      <Display/>
      </div>
      <Footer />
    </div>
  )
}
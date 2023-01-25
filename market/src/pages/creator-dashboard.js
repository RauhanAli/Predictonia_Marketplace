import react from 'react'
import Navbar from '../components/navbar'
import CreatorDashboard from '../components/dashboard'
import Footer from '../components/footer'

export default function Dashboard(){
  return(
    <div>
      <Navbar />
      <CreatorDashboard />
      <Footer />
    </div>
  )
}
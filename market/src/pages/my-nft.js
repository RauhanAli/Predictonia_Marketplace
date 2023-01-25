import react from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import MyAssets from '../components/my-nft'

export default function MyNFT(){
    return(
        <div>
            <Navbar />
            <MyAssets />
            <Footer/>
        </div>
    )
}
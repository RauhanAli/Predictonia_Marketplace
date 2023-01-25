/* pages/my-nfts.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { Link, Navigate, useNavigate } from "react-router-dom";


import {
  marketplaceAddress
} from '../../config'

import NFTMarketplace from '../../artifacts/contracts/Marketplace.sol/NFTMarketplace.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const navigate = useNavigate();
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const data = await marketplaceContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        tokenURI
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  function listNFT(nft) {
    navigate(`/resell?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>)
  return (
    <div>

<div className="page-heading normal-space">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h6>Marketplace</h6>
              <h2>PREDICTONIA</h2>
              <div className="buttons">
                  <Link to="/nft">
                  <div className="main-button">
                  <a href="#">Explore Our Items</a>
                  </div>
                  </Link>
                  <Link to='/create-item'>
                  <div className="border-button">
                  <a href='#'>Create Your NFT</a>
                  </div>
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    <div className="justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img style={{maxWidth:"350px", maxHeight:"180px"}} src={nft.image} />
                {/* <div className="rounded" style={{backgroundImage:`url("${nft.image}")`, height:'300px', backgroundPosition:'center', backgroundSize:'cover', backgroundRepeat:'no-repeat'}}></div> */}
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} PDTK</p>
                  <button className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded" onClick={() => listNFT(nft)}>List</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    </div>
  )
}

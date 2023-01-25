/* pages/resell-nft.js */
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import Web3 from "web3/dist/web3.min.js";
//import BigNumber from 'big-number'


import {
  marketplaceAddress
} from '../../config'

import NFTMarketplace from '../../artifacts/contracts/Marketplace.sol/NFTMarketplace.json'
import IERC20 from "../../artifacts/contracts/Marketplace.sol/IERC20.json"

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const {search} = useLocation();
  let transaction = null;
  var web3 = null;
  var account = null;
  const searchParams = new URLSearchParams(search)
  const tokenURI = searchParams.get('tokenURI')
  const id = searchParams.get('id')
  // const {id, tokenURI} = queryString.parse(search)
  const { image, price } = formInput
  const navigate = useNavigate();


  useEffect(() => {
    fetchNFT()
  }, [id])

  async function fetchNFT() {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI)
    updateFormInput(state => ({ ...state, image: meta.data.image }))
  }

  async function listNFTForSale() {
    if (!price) return
    const web3Modal = new Web3Modal()
    var provider = await web3Modal.connect();
		web3 = new Web3(provider); 
		await provider.send('eth_requestAccounts'); 
		var accounts = await web3.eth.getAccounts(); 
		account = accounts[0]; 
      console.log(account)

    /* create the NFT */
    const priceFormatted = web3.utils.toWei(formInput.price, 'ether')
    let contract = new web3.eth.Contract(NFTMarketplace.abi,marketplaceAddress);
     const token = await contract.methods.tokenAddress.call().call()
     console.log(token)
    console.log("Done");
    let listingPrice = await contract.methods.getListingPrice().call()
     listingPrice = listingPrice.toString() 
     const token1 = new web3.eth.Contract(IERC20.abi,token)
     token1.methods.approve(marketplaceAddress,listingPrice).send({from:account}).on("confirmation", async (num)=>{
      if(num == 0){
       transaction = await contract.methods.resellToken(id, priceFormatted).send({from:account})
         navigate('/nft')
      }
     })
    
    
  }


  return (
    <div>

<div className="page-heading normal-space">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h6>Marketplace</h6>
              <h2>PREDICTONIA League</h2>
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

      <div class="item-details-page">
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
      <div className="flex justify-center">
      <div id="contact">
      <div class="row">
      <label for="price">Price Of NFT</label>
        <input
          placeholder="NFT Price in PDTK"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        {
          image && (
            <img className="rounded mt-4" width="350" src={image} />
          )
        }
        <button onClick={listNFTForSale} class="orange-button">
          List NFT
        </button>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  )
}

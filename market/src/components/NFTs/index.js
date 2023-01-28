/* eslint-disable jsx-a11y/alt-text */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Web3 from "web3/dist/web3.min.js";
import BigNumber from 'big-number'
import './index.css'

import {
  marketplaceAddress
} from '../../config'

import NFTMarketplace from '../../artifacts/contracts/Marketplace.sol/NFTMarketplace.json'
import IERC20 from "../../artifacts/contracts/Marketplace.sol/IERC20.json"
import { Link } from 'react-router-dom';
export default function Display() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  let transaction= null;
  var web3 = null;
  var account = null;
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      // console.log(item);
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    var provider = await web3Modal.connect();
		web3 = new Web3(provider); 
		await provider.send('eth_requestAccounts'); 
		var accounts = await web3.eth.getAccounts(); 
		account = accounts[0]; 
      console.log(account)

    /* create the NFT */
    let price = web3.utils.toWei(nft.price, 'ether')
    console.log(price)
    price = new BigNumber((price))
    let contract = new web3.eth.Contract(NFTMarketplace.abi,marketplaceAddress);
     const token = await contract.methods.tokenAddress.call().call()
     console.log(token)
    console.log("Done");
    let listingPrice = await contract.methods.getListingPrice().call()
    listingPrice = listingPrice + price
    const Amount = listingPrice.toString() 
     const token1 = new web3.eth.Contract(IERC20.abi,token)
     token1.methods.approve(marketplaceAddress,Amount).send({from:account}).on("confirmation", async (num)=>{
      if(num == 0){
        transaction = await contract.methods.createMarketSale(nft.tokenId).send({from:account})
        loadNFTs()
      }
     })
   
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div>

      <div className="page-heading normal-space">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h6>Marketplace</h6>
              <h2>PREDICTONIA</h2>
              <div className="buttons">
                <Link to='/nft'>
                <div className="main-button">
                  <a href="explore.html">Explore Our Items</a>
                </div>
                </Link>
                <Link to='/create-item'>
                <div className="border-button">
                  <a href="create.html">Create Your NFT</a>
                </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

          
      {/* <div className="item-details-page"> */}
      <div className="flex justify-center">
        <div className="px-4 cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
            {
              nfts.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  <img style={{width:"300px", height:"300px", alignItems:'center'}} src={nft.image} />
                  {/* <div className="rounded" style={{backgroundImage:`url("${nft.image}")`, height:'350px', backgroundPosition:'center', backgroundSize:'cover', backgroundRepeat:'no-repeat'}}></div> */}
                  {/* <div className="rounded" style={{backgroundImage:`url("${nft.image}")`, height:'500px', backgroundPosition:'center', backgroundSize:'cover', backgroundRepeat:'no-repeat'}}></div> */}
                  <div className="p-4" style={{overflow:'hidden'}}>
                    <p style={{ fontSize:"20px", color:'black'}} className="text-2xl font-bold">{nft.name}</p>
                    <div  style={{overflow:'hidden'}}>
                      <p className="text-gray-400" style={{lineHeight: '20px', fontSize:'12px'}}>{nft.description}</p>
                    </div>
                  </div>
                  <div style={{}}>
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">{nft.price} PDTK</p>
                    <button className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                  </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      {/* </div> */}

    </div>
  )
}
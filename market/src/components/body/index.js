import react from 'react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate} from 'react-router-dom';


import {
  marketplaceAddress
} from '../../config'

import NFTMarketplace from '../../artifacts/contracts/Marketplace.sol/NFTMarketplace.json'
import IERC20 from "../../artifacts/contracts/Marketplace.sol/IERC20.json"


export default function Body(){
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  const navigate = useNavigate();
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

  async function Details(){
    navigate('/nft')
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
    return(
        <div>
            <div class="main-banner">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 align-self-center">
          <div class="header-text">
            <h6>PDTK NFT Market</h6>
            <h2>Create, Sell &amp; Collect Top NFT’s.</h2>
            {/* <p>Liberty NFT Market is a really cool and professional design for your NFT websites. This HTML CSS template is based on Bootstrap v5 and it is designed for NFT related web portals. Liberty can be freely downloaded from TemplateMo's free css templates.</p> */}
            <div class="buttons">
              <div class="border-button">
                <a href="explore.html">Explore Top NFTs</a>
              </div>
              {/* <div class="main-button">
                <a href="https://youtube.com/templatemo" target="_blank">Watch Our Videos</a>
              </div> */}
            </div>
          </div>
        </div>
        <div class="col-lg-5 offset-lg-1">
          <div class="owl-banner owl-carousel">
            <div class="item">
              <img src="assets/images/banner-01.png" alt=""/>
            </div>
            <div class="item">
              <img src="assets/images/banner-02.png" alt=""/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* <!-- ***** Main Banner Area End ***** --> */}
  
  <div class="categories-collections">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="categories">
            <div class="row">
            </div>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="collections">
            <div class="row">
              <div class="col-lg-12">
                <div class="section-heading">
                  <div class="line-dec"></div>
                  <h2>Explore Some Hot <em>Collections</em> In Market.</h2>
                </div>
              </div>

              <div class="col-lg-12">
                <div class="owl-collection owl-carousel">
                  <div class="item">
                    <img src="assets/images/collection-01.jpg" alt=""/>
                    <div class="down-content">
                      <h4>Mutant Bored Ape Yacht Club</h4>
                      <span class="collection">Items In Collection:<br /><strong>310/340</strong></span>
                      <span class="category">Category:<br /><strong>Digital Crypto</strong></span>
                      <div class="main-button">
                        <a href="explore.html">Explore Mutant</a>
                      </div>
                    </div>
                  </div>
                  <div class="item">
                    <img src="assets/images/collection-01.jpg" alt=""/>
                    <div class="down-content">
                      <h4>Bored Ape Kennel Club</h4>
                      <span class="collection">Items In Collection:<br /><strong>324/324</strong></span>
                      <span class="category">Category:<br /><strong>Visual Art</strong></span>
                      <div class="main-button">
                        <a href="explore.html">Explore Bored Ape</a>
                      </div>
                    </div>
                  </div>
                  <div class="item">
                    <img src="assets/images/collection-01.jpg" alt=""/>
                    <div class="down-content">
                      <h4>Genesis Collective Statue</h4>
                      <span class="collection">Items In Collection:<br /><strong>380/394</strong></span>
                      <span class="category">Category:<br /><strong>Music Art</strong></span>
                      <div class="main-button">
                        <a href="explore.html">Explore Genesis</a>
                      </div>
                    </div>
                  </div>
                  <div class="item">
                    <img src="assets/images/collection-01.jpg" alt=""/>
                    <div class="down-content">
                      <h4>Worldwide Artwork Ground</h4>
                      <span class="collection">Items In Collection:<br /><strong>426/468</strong></span>
                      <span class="category">Category:<br /><strong>Blockchain</strong></span>
                      <div class="main-button">
                        <a href="explore.html">Explore Worldwide</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="create-nft">
    <div class="container">
      <div class="row">
        <div class="col-lg-8">
          <div class="section-heading">
            <div class="line-dec"></div>
            <h2>Create Your NFT, Put It On The Market.</h2>
          </div>
        </div>
        <div class="col-lg-4">
          <Link to='/create-item'>
          <div class="main-button">
            <a href="create.html">Create Your NFT Now</a>
          </div>
          </Link>
        </div>
        <div class="col-lg-4">
          <div class="item first-item">
            <div class="number">
              <h6>1</h6>
            </div>
            <div class="icon">
              <img style={{marginLeft:"15px", marginTop:"10px"}} src="assets/images/icon-02.png" alt="" />
            </div>
            <h4>Set Up Your Wallet</h4>
           
          </div>
        </div>
        <div class="col-lg-4">
          <div class="item second-item">
            <div class="number">
              <h6>2</h6>
            </div>
            <div class="icon">
              <img style={{marginLeft:"15px", marginTop:"10px"}} src="assets/images/icon-04.png" alt="" />
            </div>
            <h4>Add Your Digital NFT</h4>
           
          </div>
        </div>
        <div class="col-lg-4">
          <div class="item">
            <div class="icon">
              <img style={{marginLeft:"15px", marginTop:"10px"}} src="assets/images/icon-06.png" alt="" />
            </div>
            <h4>Sell Your NFT &amp; Make Profit</h4>
           
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="currently-market">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="section-heading">
            <div class="line-dec"></div>
            <h2><em>Items</em> Currently In The Market.</h2>
          </div>
        </div>
        {/* nfst map strat here */}
        <div class="col-lg-12">
          <div class="row grid">
            <div class="col-lg-6 currently-market-item all msc">
            {  nfts.map((nft, i) => (
              <div key={i} >
              <div class="item">
                <div class="left-image">
                  <img src={nft.image} alt="" style={{borderRadius: "20px", maxWidth: "350px", maxHeight:"180px"}} />
                </div>
                <div class="right-content">
                  <h4>{nft.name}</h4>
                  <span class="author">
                    <img src="assets/images/author.jpg" alt="" style={{maxWidth: "50px", borderRadius: "50%"}} />
                    <h6>Owner Address<br /><a href="#">{nft.owner}</a></h6>
                  </span>
                  <div class="line-dec"></div>
                  <span class="bid" >
                    Current Price<br /><strong>{nft.price} PDTK</strong><br /><em></em>
                  </span>
                  <span class="ends">
                    <br /><strong>NFT Description</strong><br /><em>{nft.description}</em>
                  </span>
                  <div class="text-button">
                    <a onClick={Details}>View NFT Details</a>
                      </div>
                   </div>
                   </div>
                   </div>
               ))
                }
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
        </div>
    )
}
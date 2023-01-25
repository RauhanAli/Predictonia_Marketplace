/* pages/create-nft.js */
import { Buffer } from 'buffer';
import { useState } from 'react'
import Web3Modal from 'web3modal'
import {create} from 'ipfs-http-client'
import Web3 from "web3/dist/web3.min.js";
import { Link, useNavigate} from 'react-router-dom';
import Resizer from "react-image-file-resizer";
import Compress from 'compress.js';


import {
  marketplaceAddress
} from "../../config"

import NFTMarketplace from "../../artifacts/contracts/Marketplace.sol/NFTMarketplace.json"
import IERC20 from "../../artifacts/contracts/Marketplace.sol/IERC20.json"


export default function CreateItem(){
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  var web3 = null;
  var account = null;
  let tx, value,tokenId, event, transaction = null;
  const navigate = useNavigate();
  global.Buffer = Buffer;

  const projectId = "2ERD9RRgnmieay9kkOQ4AfpQA0m";
  const projectSecret = "920b0d07882f48b11ae93b84cb71b308";

  const auth =
    "Basic " +
    Buffer.from(projectId + ":" + projectSecret).toString("base64");
    
    const client = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });

  
  
  async function onChange(e) {
    /* upload image to IPFS */
    const file = e.target.files[0]
   
    try {
      const result = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      );
      const url = `https://clg.infura-ipfs.io/ipfs/${result.path}`
      setFileUrl(url)
      console.log(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    } 
}
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      // const url = `https://ipfs.infura.io:5001/api/v0/${added.path}`
      const url = `https://clg.infura-ipfs.io/ipfs/${added.path}`
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      console.log(url)
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    var provider = await web3Modal.connect();
		web3 = new Web3(provider); 
		await provider.send('eth_requestAccounts'); 
		var accounts = await web3.eth.getAccounts(); 
		account = accounts[0]; 
      console.log(account)

    /* create the NFT */
    let price = web3.utils.toWei(formInput.price, 'ether')
    console.log(price)
    let contract = new web3.eth.Contract(NFTMarketplace.abi,marketplaceAddress);
     const token = await contract.methods.tokenAddress.call().call()
     console.log(token)
     let listingPrice = await contract.methods.getListingPrice().call()
    listingPrice = listingPrice.toString()
    console.log(listingPrice);
    console.log("My Listing Price");
     const token1 = new web3.eth.Contract(IERC20.abi,token)
     console.log(token1)
     token1.methods.approve(marketplaceAddress,listingPrice).send({from:account}).on("confirmation", async (num)=>{
      if(num == 0){
        transaction = await contract.methods.createToken(url,price).send({from:account, gasLimit: null,})
        navigate('/nft');
      }
     })
      
  }

   return (
    <div>
      
  <div class="page-heading normal-space">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h6>PDTK NFT Market</h6>
          <h2>Create Your NFT Now.</h2>
        </div>
      </div>
    </div>
  </div>
       <div class="item-details-page">
       <div class="col-lg-12">
          <div class="section-heading">
            <div class="line-dec"></div>
            <h2>Apply For <em>Your Item</em> Here.</h2>
          </div>
        </div>
    <div className="flex justify-center">
      <div id="contact">
      <div class="row">
      {/* <div className="w-1/2 flex flex-col pb-12"> */}
       <div class="col-lg-6">
                <fieldset>
                <label for="name">NFT Title</label>
               <input 
                  type="name" name="name" id="name" placeholder="Your NFT tittle" autocomplete="on" required
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                      />
                </fieldset>
              </div>
              <div class="col-lg-6">
                <fieldset>
                  <label for="description">Description For NFT</label>
                  <input type="description" name="description" id="description" placeholder="Your NFT description" autocomplete="on" required
                   onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                  />
                </fieldset>
                </div>
                <div class="col-lg-6">
                <fieldset>
                  <label for="price">Price Of Item</label>
                  <input type="price" name="price" id="price" placeholder="NFT Price in PDTK" autocomplete="on" required
                  onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                  />
                </fieldset>
              </div>
              
              <div class="col-lg-12">
                <fieldset>
                  <label for="file">Your File</label>
                  <input type="file" id="file" name="myfiles[]" multipnpm audit le
                   onChange={onChange} />
        {
          fileUrl && (
             <img className="rounded mt-4 justify-center" style={{maxWidth:"350px", margin:"10px"}} src={fileUrl} />
        //  <div className="rounded" style={{backgroundImage:`url("${fileUrl}}")`, height:'500px',width: '350px' , backgroundPosition:'center', backgroundSize:'cover', backgroundRepeat:'no-repeat'}}></div>

          )
        }
         </fieldset>
              </div> 
            
         <div class="col-lg-2"></div>
         <div class="col-lg-8">
        <button onClick={listNFTForSale}  class="orange-button">
          Create NFT
        </button>
        </div>
        <div class="col-lg-2"></div>
      {/* </div> */}
      </div>
      </div>
      </div>
    </div>
  </div>

   )
}


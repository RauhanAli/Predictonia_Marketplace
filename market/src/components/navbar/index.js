import react from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../../styles/navbar.css'

export default function Navbar() {
  const [navbar, setNavbar] = useState(false);
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const styless = {
    paddingBottom: "2px"
  }

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, []);

  async function connectWallet() {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance);
      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  return (
    <div>
      {/* <!-- ***** Header Area Start ***** --> */}
      <header class="header-area header-sticky">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <nav class="main-nav">
                {/* <!-- ***** Logo Start ***** --> */}
                <a href="/" class="logo" style={{margin:"20px"}}>
                  <img src="assets/images/PDTK.png" styles={{ width:"80px"}} alt="" />
                </a>
                {/* <!-- ***** Logo End ***** -->
                    <!-- ***** Menu Start ***** --> */}
                <ul class="nav">
                  <li>
                    <Link to='/' className='active'>Home</Link>
                  </li>
                  <li>
                    <Link to="/nft">NFT</Link>
                  </li>
                  <li>
                    <Link to='/create-item'>Sell NFT</Link>
                  </li>
                  <li>
                    <Link to='/mynft'>MyNFTs</Link>
                  </li>
                  <li>
                    <Link to='/dashboard'>Dashboard</Link>
                  </li>
                </ul>

                <div style={{ marginTop: "15px", width: "200px" }}>
                  <button onClick={connectWallet} class="align-middle font-bold btn rounded p-2 shadow-lg mt-15">
                    Connect Wallet
                  </button>
                </div>
                <a class='menu-trigger'>
                  <span>Menu</span>
                </a>
                {/* <!-- ***** Menu End ***** --> */}
              </nav>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- ***** Header Area End ***** --> */}
      <div className='mobile-nav'>
        <nav class="navigation">
          <nav class="navigation">
            {/* <!-- ***** Logo Start ***** --> */}
            <a href="" className="logo">
              <img src="assets/images/PDTK1.png" className='mobile-logo' alt="" />
            </a>
            {/* <!-- ***** Logo End ***** -->
                    <!-- ***** Menu Start ***** --> */}
            <button
              className="hamburger"
              onClick={() => {
                setIsNavExpanded(!isNavExpanded)
              }}
            >
            </button>
            <div className={
              isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
            }>
              <ul class="nav card-slide">
                <li>
                  <Link to='/' className='active'>Home</Link>
                </li>
                <li>
                  <Link to="/nft">NFT</Link>
                </li>
                <li>
                  <Link to='/create-item'>Sell NFT</Link>
                </li>
                <li>
                  <Link to='/mynft'>MyNFTs</Link>
                </li>
                <li>
                  <Link to='/dashboard'>Dashboard</Link>
                </li>
                <li>
                  <Link onClick={connectWallet} to=''>Connect wallet</Link>
                </li>
              </ul>

              {/* <div>
                    <button onClick={connectWallet} class="align-middle font-bold btn rounded p-2 shadow-lg mt-15">
                                    Connect Wallet
                          </button>
                    </div>   */}
              <a className='menu-trigger'>
              </a>
              {/* <!-- ***** Menu End ***** --> */}
            </div>
          </nav>
        </nav>
      </div>

    </div>
  )
}
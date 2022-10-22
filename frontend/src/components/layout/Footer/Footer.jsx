import React from 'react'
import playStore from "../../../assets/images/playstore.png"
import appStore from "../../../assets/images/Appstore.png"
import "./Footer.css"

const Footer = () => {
    return (
        <footer id="footer">
            <div className="leftFooter">
                <h4>DOWNLOAD OUR APP</h4>
                <p>Download App for Android and IOS mobile phone</p>
                <img src={playStore} alt="playstore" />
                <img src={appStore} alt="playstore" />
            </div>

            <div className="midFooter">
                <h1>SHOP-MELA</h1>
                <p>High Quality is our first priority</p>

                <p>Copyrights 2021 &copy; Charchil</p>
            </div>

            <div className="rightFooter">
                <h4>Follow Us</h4>
                <br />
                <a className='footerLink' href="http://instagram.com/charchil08">Instagram</a>
                <a className='footerLink' href="http://youtube.com/charchil08">Twitter</a>
                <a className='footerLink' href="http://instagram.com/charchil08">Facebook</a>
            </div>
        </footer>
    )
}

export default Footer
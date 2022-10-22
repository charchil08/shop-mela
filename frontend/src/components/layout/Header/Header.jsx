import React from "react";
import logo from "../../../assets/images/logo.png"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { AiOutlineSearch } from "react-icons/ai"
import { BsPerson } from "react-icons/bs"
import { NavLink } from "react-router-dom";
import "./Header.css"

const menu = [
    {
        id: 1,
        name: "Home",
        link: "/"
    },
    {
        id: 2,
        name: "Products",
        link: "/products"
    },
    {
        id: 3,
        name: "Contact",
        link: "/contact"
    },
    {
        id: 4,
        name: "About",
        link: "/about"
    }
]

const Header = () => (
    <div className="headerContainer">
        <div className="headerLogo">
            <img src={logo} alt="Ecommerce" srcSet="" className="headerImage" />
        </div>

        <div className="headerMenu">
            <ul className="menuList" >
                {
                    menu.map(item => (
                        <li key={item.id} className="menuItem"
                        >
                            <NavLink to={item.link}>{item.name}</NavLink>
                        </li>
                    ))
                }
            </ul>
        </div>

        <div className="headerIcons">
            <span><AiOutlineSearch /></span>
            <span><AiOutlineShoppingCart /></span>
            <span><BsPerson /></span>
        </div>

    </div >
);

export default Header;

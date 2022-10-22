import React, { Fragment } from 'react'
import "./Home.css"
import { CgMouse } from "react-icons/cg"
import Product from "./Product.jsx"

const product = {
    name: "Blue tshirt",
    images: [{ url: "https://i.ibb.co/DRST11n/1.webp" }],
    price: "₹3000",
    _id: "abhishek"
}

const Home = () => {
    return (
        <Fragment>
            <div className="banner">
                <p>Welcome to E-commerce</p>
                <h1>FIND AMAZING PRODUCT BELOW</h1>

                <a href="#container">
                    <button>
                        Scroll <CgMouse />
                    </button>
                </a>
            </div>

            <h2 className='homeHeading'>
                Featured Products
            </h2>

            <div className="container" id='container' >
                <Product product={product} />
                <Product product={product} />
                <Product product={product} />
                <Product product={product} />

                <Product product={product} />
                <Product product={product} />
                <Product product={product} />
                <Product product={product} />

            </div>

        </Fragment>
    )
}

export default Home
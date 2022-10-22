// import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"

const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: 2.5,
    isHalf: true
}

const Product = ({ product }) => {
    return (
        <Link to={product._id} id={product._id} className="productCard"  >
            <img src={product.images[0].url} alt={product.name} />
            <p>{product.name}</p>
            <div>
                {/* <ReactStars {...options} />  */}
                <span>(256 Reviews)</span>
            </div>
            <span>{product.price}</span>
        </Link>
    )
}

export default Product
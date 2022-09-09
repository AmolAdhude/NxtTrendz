import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const statusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    value: 1,
    itemDetails: {},
    isTrue: statusConstants.inProgress,
  }

  componentDidMount() {
    this.getDetails()
  }

  increment = () => {
    this.setState(prevState => ({value: prevState.value + 1}))
  }

  decrement = () => {
    this.setState(prevState => ({
      value: prevState.value > 1 ? prevState.value - 1 : prevState.value,
    }))
  }

  getDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, option)
    const data = await response.json()
    if (response.ok) {
      const newData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products,
        price: data.price,
        description: data.description,
      }
      this.setState({itemDetails: newData, isTrue: statusConstants.success})
    } else {
      this.setState({itemDetails: {}, isTrue: statusConstants.failure})
    }
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  successDetails = () => {
    const {itemDetails} = this.state
    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
      price,
      description,
    } = itemDetails
    const {value} = this.state
    return (
      <div className="success-container">
        <Header />
        <div className="first-container">
          <img src={imageUrl} className="src-image" alt="product" />
          <div className="first-content">
            <h1 className="first-heading">{title}</h1>
            <p className="first-price">Rs {price}/- </p>
            <div className="rating-holder">
              <div className="rating">
                <p className="para">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star-img"
                  alt="star"
                />
              </div>
              <p className="review">{totalReviews} Reviews</p>
            </div>
            <p className="first-para">{description}</p>
            <p className="review">
              <span className="first-bold">Available: </span>
              {availability}
            </p>
            <p className="review">
              <span className="first-bold">Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="quantity-holder">
              <button
                type="button"
                className="btn"
                testid="minus"
                onClick={this.decrement}
              >
                <BsDashSquare className="btn-icons" />
              </button>
              <p className="number">{value}</p>
              <button
                type="button"
                className="btn"
                testid="plus"
                onClick={this.increment}
              >
                <BsPlusSquare className="btn-icons" />
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <p className="similar-heading">Similar Products</p>
        <ul className="similar-list">
          {similarProducts.map(eachItem => (
            <SimilarProductItem key={eachItem.id} itemValue={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  failureDetails = () => (
    <div className="failure-container">
      <Header />
      <div className="no-result">
        <div className="failure-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
            className="failure-img"
            alt="failure view"
          />
          <h1 className="failure-heading">Product Not Found</h1>
          <button
            type="submit"
            className="continue-shopping"
            onClick={this.continueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )

  render() {
    const {isTrue, itemDetails} = this.state

    switch (isTrue) {
      case statusConstants.inProgress:
        return (
          <div testid="loader" className="loader">
            <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
          </div>
        )
      case statusConstants.success:
        if (itemDetails.length !== 0) {
          return this.successDetails()
        }
        return this.failureDetails()
      default:
        return this.failureDetails()
    }
  }
}
export default ProductItemDetails

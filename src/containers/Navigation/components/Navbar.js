import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { getAccounts, getProducts, fetchProductData, setOrderBook  } from '../../../utils/api'
import { initWSConnection } from '../../../utils/websocket'

export default class Navigation extends Component {

  componentDidMount(){

    getProducts().then(products => {
      let productIds = products.map( p => (p.id))

      this.props.setProducts(products)
      this.props.selectProduct('LTC-USD')

      initWSConnection(productIds, this.props.setProductWSData)

      for (const product of products) {
        fetchProductData(product.id, 60, 60, this.props.setProductData)
        setOrderBook(product.id, this.props.updateOrderBook)
      }
    })

    setInterval(() => {
      if(this.props.session.length > 5){
        getAccounts(this.props.session).then((res) => {
          this.props.updateAccounts(res)
        })
      }
    }, 30000)

    setInterval(() => {
      let ids = this.props.selectedProductIds
      for(let i = 0; i < ids.length; i++){
        setOrderBook(ids[i], this.props.updateOrderBook)
      }
    }, 30000)

  }

  render() {

    let round = (value, decimals) => {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    return (
      <nav className={`navbar navbar-inverse navbar-fixed-top ${this.props.live ? 'live' : ''}`}>
        <div className='container nav-container'>
          <div className='navbar-header'>
            <a className="navbar-brand" href='https://github.com/aastein/crypto-trader'>
              <img alt='logo' className='navbar-brand-img' height='50' src='https://avatars0.githubusercontent.com/u/18291415?v=3&s=460'/>
            </a>
          </div>
          <ul className='nav navbar-nav'>
            <li>
              <NavLink exact activeClassName='active' to='/'>Dashboard</NavLink>
            </li>
            <li>
              <NavLink exact activeClassName='active' to='/profile'>Profile</NavLink>
            </li>
          </ul>
          <div className='order-book'>
            <ul>
              {this.props.products.filter( p => (
                this.props.selectedProductIds.indexOf(p.id) > -1
               )).map( a => (
                <li>
                  <div>
                    <label>{a.display_name}</label>
                    <span>{`Bid: ${a.bid}`}</span>
                    <span>{`Ask: ${a.ask}`}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className='accounts'>
            <ul>
              {this.props.accounts.map( a => (
                <li>
                  <div>
                    <label>{a.currency}</label>
                    <span>{`Available: ${round(a.available, 6)}`}</span>
                    <span>{`Balance: ${round(a.balance, 6)}`}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

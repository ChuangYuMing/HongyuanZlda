import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './login.css'
import classNames from 'classnames/bind'
import Logo from 'static/image/icons/logo.png'

let cx = classNames.bind(styles)
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      pwd: ''
    }
    this.isLogin = props.isLogin
  }
  componentDidUpdate() {
    console.log(this.props.isLogin)
    if (this.props.isLogin) {
      this.props.history.replace('/')
    }
  }
  handleInputChange = e => {
    // console.log(this)
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    if (parseInt(value)) {
      this.setState({
        [name]: parseInt(value)
      })
    } else {
      this.setState({
        [name]: value
      })
    }
  }
  login = () => {
    let { userId, pwd } = this.state
    let parms = {
      '50': '',
      '11000': '30',
      '553': userId,
      '554': pwd,
      '1408': ''
    }
    this.props.login(parms)
  }
  render() {
    return (
      <div className={cx('main')}>
        <div className={cx('login-wrap')}>
          <img className={cx('logo')} src={Logo} alt="logo" />
          <span className={cx('title')}>自打登入</span>
          <div className={cx('input-wrap')}>
            <div className={cx('item')}>
              <label htmlFor="userId">帳號：</label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={this.state.userId}
                onChange={this.handleInputChange}
              />
            </div>
            <div className={cx('item')}>
              <label htmlFor="pwd">密碼：</label>
              <input
                type="text"
                id="pwd"
                name="pwd"
                value={this.state.pwd}
                onChange={this.handleInputChange}
              />
            </div>
            <span onClick={this.login} className={cx('btn')}>
              登入
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Login.propTypes = {}

export default Login

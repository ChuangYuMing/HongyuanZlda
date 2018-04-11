import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './login.css'
import classNames from 'classnames/bind'
import Logo from 'static/image/icons/logo.png'
import Loading from 'modules/shared/components/Loading/Loading.js'

let cx = classNames.bind(styles)
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      pwd: '',
      disableSubmit: false
    }
    this.isLogin = props.isLogin
  }
  componentDidUpdate() {
    console.log(this.props.isLogin)
    if (this.props.isLogin) {
      this.props.history.replace('/order')
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
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.errorMsg !== '') {
      this.setState({
        disableSubmit: false
      })
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    let { userId, pwd } = this.state
    let parms = {
      '34': '',
      '35': '30',
      '553': userId,
      '554': pwd,
      '1408': ''
    }
    this.setState({
      disableSubmit: true
    })
    setTimeout(() => {
      this.props.login(parms).then(res => {
        if (!res) {
          this.setState({
            disableSubmit: false
          })
        }
      })
    }, 300)
  }
  render() {
    let { errorMsg } = this.props
    return (
      <div className={cx('main')}>
        <form className={cx('login-wrap')} onSubmit={this.handleSubmit}>
          <img className={cx('logo')} src={Logo} alt="logo" />
          <span className={cx('title')}>自打登入</span>
          <div className={cx('input-wrap')}>
            <span className={errorMsg !== '' ? cx('error') : cx('hide')}>
              {`<${errorMsg}>`}
            </span>
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
                type="password"
                id="pwd"
                name="pwd"
                value={this.state.pwd}
                onChange={this.handleInputChange}
              />
            </div>
            {this.state.disableSubmit ? (
              <div className={cx('loading-wrap')}>
                <Loading />
              </div>
            ) : (
              <button
                disabled={this.state.disableSubmit}
                type="submit"
                className={cx('btn')}
              >
                登入
              </button>
            )}
          </div>
        </form>
      </div>
    )
  }
}

Login.propTypes = {}

export default Login

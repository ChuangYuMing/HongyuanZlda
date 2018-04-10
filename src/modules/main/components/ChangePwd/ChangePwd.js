import React, { PureComponent } from 'react'
import styles from './change-pwd.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
class ChangePwd extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      pwd: '',
      oldPwd: ''
    }
  }
  handleInputChange = e => {
    // console.log(this)
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }
  hidePopup = () => {
    this.props.hidePopup()
    let msg = document.getElementsByClassName(styles['msg'])[0]
    msg.textContent = ''
    this.setState({
      pwd: ''
    })
  }
  checkPwd = () => {
    let { pwd, oldPwd } = this.state
    let checkParams = {
      MsgType: 43,
      TokenID: this.props.tokenId,
      RMode: '0',
      Username: this.props.userId,
      Password: oldPwd,
      MsgSeqNum: ''
    }
    let updateParams = {
      MsgType: 43,
      TokenID: this.props.tokenId,
      RMode: '1',
      Username: this.props.userId,
      Password: pwd,
      MsgSeqNum: ''
    }

    this.props.checkPwd(checkParams).then(res => {
      if (res) {
        this.updatePwd(updateParams)
      } else {
        let msg = document.getElementsByClassName(styles['msg'])[0]
        msg.textContent = '原密碼錯誤'
      }
    })
  }
  updatePwd = params => {
    this.props.updatePwd(params).then(res => {
      let msg = document.getElementsByClassName(styles['msg'])[0]
      msg.textContent = res
    })
  }
  render() {
    let { showChangePwd, forceUpdatePwd } = this.props
    return (
      <div className={showChangePwd ? cx('wrap') : cx('hide')}>
        <div className={cx('main')}>
          <div className={cx('title')}>修改密碼</div>
          <div className={cx('pwd-wrap')}>
            <span className={cx('msg')} />
            <span>原密碼：</span>
            <input
              onChange={this.handleInputChange}
              name="oldPwd"
              type="text"
              value={this.state.oldPwd}
            />
            <br />
            <span>新密碼：</span>
            <input
              onChange={this.handleInputChange}
              name="pwd"
              type="text"
              value={this.state.pwd}
            />
            <span className={forceUpdatePwd ? cx('msg2') : cx('hide')}>
              {`<第一次登入請修改密碼>`}
            </span>
          </div>
          <span onClick={this.hidePopup} className={cx('btn', 'cancel')}>
            關閉
          </span>
          <span onClick={this.checkPwd} className={cx('btn', 'submit')}>
            送出
          </span>
        </div>
      </div>
    )
  }
}

export default ChangePwd

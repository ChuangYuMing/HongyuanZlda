import React, { PureComponent } from 'react'
import styles from './change-pwd.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
class ChangePwd extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      pwd: ''
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
  updatePwd = () => {
    let { pwd } = this.state
    let params = {
      MsgType: 43,
      TokenID: this.props.tokenId,
      SenderCompID: '',
      SenderSubID: '',
      RMode: '1',
      Username: this.props.userId,
      Password: pwd,
      MsgSeqNum: '',
      SendingTime: '',
      TargetCompID: '',
      TargetSubID: ''
    }
    console.log(params)
    this.props.updatePwd(params).then(res => {
      let info = ''
      let msg = document.getElementsByClassName(styles['msg'])[0]
      info = res === '1' ? '更新成功！' : '更新失敗！'
      msg.textContent = info
    })
  }
  render() {
    let { showChangePwd } = this.props
    console.log('showChangePwd', showChangePwd)
    return (
      <div className={showChangePwd ? cx('wrap') : cx('hide')}>
        <div className={cx('main')}>
          <div className={cx('title')}>修改密碼</div>
          <div className={cx('pwd-wrap')}>
            <span className={cx('msg')} />
            <span>新密碼：</span>
            <input
              onChange={this.handleInputChange}
              name="pwd"
              type="text"
              value={this.state.pwd}
            />
          </div>
          <span onClick={this.hidePopup} className={cx('btn', 'cancel')}>
            關閉
          </span>
          <span onClick={this.updatePwd} className={cx('btn', 'submit')}>
            送出
          </span>
        </div>
      </div>
    )
  }
}

export default ChangePwd

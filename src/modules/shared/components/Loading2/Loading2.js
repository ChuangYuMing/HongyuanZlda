import React from 'react'
import classNames from 'classnames/bind'
import styles from './Loading2.css'

let cx = classNames.bind(styles)

function Loading2() {
  return (
    <div className={cx('loading-wrapper')}>
      <svg width="60" viewBox="0 0 58 60" xmlns="http://www.w3.org/2000/svg">
        <g fill="#000" fillRule="evenodd">
          <circle cx="28.679" cy="3" r="3" />
          <circle cx="44.549" cy="8.157" r="3" />
          <circle cx="54.357" cy="21.657" r="3" />
          <circle cx="54.357" cy="38.343" r="3" />
          <circle cx="44.549" cy="51.843" r="3" />
          <circle cx="28.679" cy="57" r="3" />
          <circle cx="12.808" cy="51.843" r="3" />
          <circle cx="3" cy="38.343" r="3" />
          <circle cx="3" cy="21.657" r="3" />
          <circle cx="12.808" cy="8.157" r="3" />
        </g>
      </svg>
    </div>
  )
}

export default Loading2

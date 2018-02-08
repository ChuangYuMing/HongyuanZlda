import Popup from 'react-popup'
import React from 'react'

export const popup = (content, lbtn = true, rbtn = true, arg = {}) => {
  let { rText, rAction, rClassName, lText, lAction, lClassName } = arg
  let popArg = {
    content: content,
    buttons: {
      left: [
        {
          text: lText || '確定',
          className: lClassName,
          action: () => {
            lAction && lAction()
            Popup.close()
          }
        }
      ],
      right: [
        {
          text: rText || '取消',
          className: rClassName,
          action: () => {
            rAction && rAction()
            Popup.close()
          }
        }
      ]
    },
    closeOnOutsideClick: false
  }
  if (!lbtn) {
    delete popArg.buttons.left
  }
  if (!rbtn) {
    delete popArg.buttons.right
  }
  // console.log('popArg', popArg)
  Popup.create(popArg)
}

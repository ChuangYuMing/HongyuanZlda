import React from 'react'
import styles from './temp.css'
import classNames from 'classnames/bind'
import { getCookie, setCookie } from 'tools/cookie.js'
import xml2js from 'xml2js'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import PropTypes from 'prop-types'
import image from 'static/image/icons/booking.png'
import image2 from 'static/image/ct2.png'
import { fromJS } from 'immutable'
import forge, { pkcs7 } from 'node-forge'
// import Rx from 'rxjs'

console.log(forge)
let cx = classNames.bind(styles)
class Temp extends React.PureComponent {
  constructor() {
    super()
    this.times = 0
    this.toggle = false
    this.state = {
      count: 0,
      data: fromJS({
        count: 0,
        school: {
          high: 'sc1',
          moddle: 'sc2',
          friends: [1, 2, 3, 4],
          test: [{ a: 1 }, { a: 2 }]
        }
      })
    }
    // console.log(this.state)
    // var rows = []
    // for (var i = 0; i < 10; i++) {
    //   rows.push(
    //     <Row key={i}>
    //       <Cell>a {i}</Cell>
    //       <Cell>b {i}</Cell>
    //     </Row>
    //   )
    // }

    // this.state = { rows }
  }
  pkcs7 = () => {
    var p7 = forge.pkcs7.createSignedData()
    p7.content = forge.util.createBuffer('Some content to be signed.', 'utf8')
    var signers = ['a']
    for (var i = 0; i < signers.length; ++i) {
      var signer = createSigner(signers[i])
      p7.addCertificate(signer.certificate)
      p7.addSigner({
        key: signer.keys.privateKey,
        certificate: signer.certificate,
        digestAlgorithm: forge.pki.oids.sha256,
        authenticatedAttributes: [
          {
            type: forge.pki.oids.contentType,
            value: forge.pki.oids.data
          },
          {
            type: forge.pki.oids.messageDigest
            // value will be auto-populated at signing time
          },
          {
            type: forge.pki.oids.signingTime
            // value will be auto-populated at signing time
            //value: new Date('2050-01-01T00:00:00Z')
          }
        ]
      })
    }
    p7.sign()
    var pem = forge.pkcs7.messageToPem(p7)
    console.log('Signed PKCS #7 message:\n' + pem)
    var tt = forge.pkcs7.messageFromPem(pem)
    // console.log(JSON.stringify(tt))
    // console.log(tt)
  }
  componentDidMount() {
    this.pkcs7()
  }
  test = () => {
    var formData = new FormData()
    formData.append('id', 123)
    fetch(`http://192.168.12.166:8080/api/order`, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(obj => {})
  }
  imtest = () => {
    let c = this.state.data
    console.log(c.toJS())
    // this.setState({
    //   count: c,
    //   school: {
    //     high: 'sc2'
    //   }
    // })
    // let tt = this.state.data.getIn(['school', 'moddle'])
    // console.log(tt)
    if (!this.toggle) {
      this.setState(({ data }) => {
        let newfriend = data.getIn(['school', 'friends'])
        return {
          data: data.setIn(['school', 'test', 1, 'a'], 5)
        }
      })
      this.toggle = true
    } else {
      this.setState(({ data }) => {
        let newfriend = data.getIn(['school', 'friends'])
        return {
          data: data.setIn(['school', 'test', 1, 'a'], 5)
        }
      })
    }
  }
  // shouldComponentUpdate(nextProp, nextState) {
  //   let a = this.state
  //   console.log(a.data === nextState.data)
  //   return true
  // }
  render() {
    var rows = []
    var cells
    this.times = this.times + 1
    for (var r = 0; r < 50; r++) {
      cells = []

      for (var c = 0; c < 20; c++) {
        cells.push(<Cell key={c}>{(r === 0 ? 'Header ' : 'Cell ') + c}</Cell>)
      }

      rows.push(<Row key={r}>{cells}</Row>)
    }
    console.log(this.state)
    let data = this.state.data
    return (
      <div className={cx('main')}>
        {/* <span className={cx('test')} onClick={this.test}>
          login
        </span> */}
        {/* <br />
        <img src={image} />
        <img src={image2} />
        <br /> */}
        <span>render: {this.times}</span>
        <span>count: {data.get('count')}</span>
        <button onClick={this.imtest}>test</button>
        {/* <div style={{ width: '100%', height: '200px' }}>
          <StickyTable stickyColumnCount={0}>{rows}</StickyTable>
        </div> */}
      </div>
    )
  }
}

Temp.propTypes = {}
function createSigner(name) {
  console.log('Creating signer "' + name + '"...')

  // generate a keypair
  console.log('Generating 1024-bit key-pair...')
  var keys = forge.pki.rsa.generateKeyPair(1024)
  console.log('Key-pair created:')
  console.log(forge.pki.privateKeyToPem(keys.privateKey))
  console.log(forge.pki.publicKeyToPem(keys.publicKey))

  // create a certificate
  var certificate = createCertificate(name, keys)
  console.log('Signer "' + name + '" created.')

  return {
    name: name,
    keys: keys,
    certificate: certificate
  }
}

function createCertificate(name, keys) {
  // create a certificate
  console.log('Creating self-signed certificate...')
  var cert = forge.pki.createCertificate()
  cert.publicKey = keys.publicKey
  cert.serialNumber = '01'
  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date()
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)
  var attrs = [
    {
      name: 'commonName',
      value: name
    },
    {
      name: 'countryName',
      value: 'US'
    },
    {
      shortName: 'ST',
      value: 'Virginia'
    },
    {
      name: 'localityName',
      value: 'Blacksburg'
    },
    {
      name: 'organizationName',
      value: 'Test'
    },
    {
      shortName: 'OU',
      value: 'Test'
    }
  ]
  cert.setSubject(attrs)
  cert.setIssuer(attrs)
  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: true
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: 'subjectAltName',
      altNames: [
        {
          type: 6, // URI
          value: 'http://example.org/webid#me'
        }
      ]
    }
  ])

  // self-sign certificate
  cert.sign(keys.privateKey)
  console.log('Certificate created: \n' + forge.pki.certificateToPem(cert))

  return cert
}
export default Temp

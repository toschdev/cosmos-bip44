/**
 * @file Bip44.js
 * @author Tobias Schwarz <toschdev@gmail.com>
 * @date 2020
 */

import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import loadingPic from './loading.gif';

const bip39 = require('bip39');
const bip32 = require('bip32');
const bech32 = require('bech32');
const secp256k1 = require('secp256k1');
const ecc = require('tiny-secp256k1');
const createHash = require('create-hash');


export default class ReactComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mnemonic: "",
      addressData: [],
      account: 0,
      loading: false,
      prefix: "cosmos",
      encoding: "hex",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.getAddressData = this.getAddressData.bind(this);
    this.handlePrefixChange = this.handlePrefixChange.bind(this);
    this.handleEncodingChange = this.handleEncodingChange.bind(this);
    this.onClickMnemonic = this.onClickMnemonic.bind(this);
  }

  handleInputChange(event) {
    let mnemonic = event.target.value;
    this.setState({
        loading: true,
        mnemonic,
    });

    setTimeout(() => {
        let addressData = this.getAddressData();
    
        this.setState({
          addressData,
          loading: false,
        });
    }, 100);


  }

  handleAccountChange(event) {
    let account = event.target.value;
    if(!(!isNaN(parseFloat(account)) && isFinite(account))) {
        account = 0;
    }
    this.setState({
        loading: true,
        account,
    });

    setTimeout(() => {
        let addressData = this.getAddressData();
    
        this.setState({
          addressData,
          loading: false,
        });
    }, 100);
  }

  getAddressData() {
    let { mnemonic, account, prefix, encoding } = this.state;
    let walletData = [0,1,2,3,4,5,6,7]

    let returnData = walletData.map((a, i) => {
        console.log(account);
        let obj = {
            index: i,
            path: `m/44'/118'/${account}'/0/${i}`,
            keys: {
                publicKey: Buffer.from(getPublicKeyFromMnemonic(mnemonic, account, i)).toString(encoding),
                privateKey: Buffer.from(getPrivateKeyFromMnemonic(mnemonic, account, i)).toString(encoding)
            },
            address: getAddressFromMnemonic(mnemonic, prefix, account, i)
        }
        return obj
    });
    return returnData;
  }

  handlePrefixChange(event) {
    let prefix = event.target.value;
    this.setState({
        loading: true,
        prefix,
    });

    setTimeout(() => {
        let addressData = this.getAddressData();
    
        this.setState({
          addressData,
          loading: false,
        });
    }, 100);
  }

  handleEncodingChange(event) {
      let encoding = event.target.value;
      this.setState({
          loading: true,
          encoding,
      });
      let that = this;
  
      setTimeout(() => {
          let addressData = this.getAddressData();
      
          that.setState({
            addressData,
            loading: false,
          });
      }, 100);

  }

  onClickMnemonic() {
    const mnemonic = newMnemonic();
    this.setState({
        loading: true,
        mnemonic
    });
    setTimeout(() => {
        let addressData = this.getAddressData();
    
        this.setState({
          addressData,
          loading: false,
        });
    }, 100);
  }

  render() {
    const { mnemonic, account, prefix, addressData, loading } = this.state;
    const { handleInputChange, handleAccountChange, handlePrefixChange, handleEncodingChange, onClickMnemonic } = this;
    return (
        <div>
            <div className="loading" style={{display: loading ? "block" : "none"}}>
                <img src={loadingPic} className="loadingImg" alt="loading" />
            </div>
        
        <Row style={{padding: "30px"}}>
            <Col>
            </Col>
            <Col xs={8}>
                
                <h2 style={{margin: "20px"}}>Cosmos SDK BIP44 Mnemonic Converter</h2>
                <Row>
                    <Col>
                        <Button style={{margin: "10px"}} onClick={onClickMnemonic}>Generate new Mnemonic</Button>
                    </Col>
                </Row>
                
                <Form>
                    <Form.Group as={Row} controlId="formMnemonic">
                        <Form.Label column sm="2">Mnemonic</Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" name="mnemonic" value={mnemonic} placeholder="Enter mnemonic" onChange={handleInputChange} autoFocus />
                            <Form.Text className="text-muted">
                                Your 12/24 word mnemonic
                            </Form.Text>
                        </Col>  
                        
                    </Form.Group>
                </Form>

            </Col>
            <Col>
            </Col>
        </Row>
        <hr/>

        <Row>
            <Col>
            </Col>
            <Col xs={8}>
                
                <h2>Derivation Path</h2>

                <Form.Group as={Row} controlId="formPurpose">
                    <Form.Label column sm="2">
                        Purpose
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" value="44" readOnly />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formCoin">
                    <Form.Label column sm="2">
                        Coin
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" value="118" readOnly />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formCoin">
                    <Form.Label column sm="2">
                        Account
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control name="account" type="numeric" value={account} onChange={handleAccountChange} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formInternal">
                    <Form.Label column sm="2">
                        External / Internal
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" value="0" readOnly />
                    </Col>
                </Form.Group>

                <p>The BIP32 derivation path and extended keys are the basis for the derived addresses.</p>

                <Form.Group as={Row} controlId="formBip32DerivationPath">
                    <Form.Label column sm="2">
                    BIP32 Derivation Path
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" value={`m/44'/118'/${account}'/0`} readOnly />
                    </Col>
                </Form.Group>
            </Col>
            <Col>
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col>
                <h2>Derived Addresses</h2>
                
                <Row>
                    <Col>
                        <Form.Group as={Row} controlId="formBip32DerivationPath">
                            <Form.Label column sm="2">
                            Prefix
                            </Form.Label>
                            <Col sm="5">
                                <Form.Control type="text" value={prefix} onChange={handlePrefixChange} />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group as={Row} controlId="form.selectBufferEncoding">
                            <Form.Label column sm="2">Key encoding</Form.Label>
                            <Col sm="5">
                                <Form.Control as="select" onChange={handleEncodingChange}>
                                <option value="hex">hex</option>
                                <option value="base64">base64</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Path</th>
                            <th>Address</th>
                            <th>Public Key<br/><small>tendermint/PubKeySecp256k1</small></th>
                            <th>Private Key</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mnemonic === "" ? null : addressData ? this.state.addressData.map((a, i) => 
                                <tr key={i}>
                                    <td>{a.path}</td>
                                    <td>{a.address}</td>
                                    <td>{a.keys.publicKey.toString("hex")}</td>
                                    <td>{a.keys.privateKey.toString("hex")}</td>
                                </tr>
                            ) : ""}
                        </tbody>
                        </Table>
                </Col>
        </Row>
      </div>
    );
  }
}





/**
 * Creates points on the Elliptic Curve for the KeyPair
 *
 * @class ECPair
 * @param {Buffer} privateKey
 * @param {Buffer} publicKey
 * @return {Object}
 */

class ECPair {
	constructor(__D, __Q,) {
	  this.__D = __D;
	  this.__Q = __Q;
	  this.compressed = false;
	  if (__Q !== undefined) this.__Q = ecc.pointCompress(__Q, this.compressed);
	}
	get privateKey() {
	  return this.__D;
	}
	get publicKey() {
	  if (!this.__Q) this.__Q = ecc.pointFromScalar(this.__D, this.compressed);
	  return this.__Q;
	}
}


/**
 * Creates the BIP44 path given account and address
 *
 * @method bip44path
 * @param {String} bip44account the given account number point of BIP44
 * @param {String} bip44address the given address point of BIP44
 * @return {String}
 */

const bip44path = (bip44account = 0, bip44address = 0) => `m/44'/118'/${bip44account}'/0/${bip44address}`;


/**
 * Gets an ECPair from Passphrase Mnemonic
 *
 * @method getKeyPairFromMnemonic
 * @param {String} menmonic the given mnemonic
 * @param {String} bip44account the given account number point of BIP44
 * @param {String} bip44address the given address point of BIP44
 * @return {Object} { privateKey, publicKey }
 */

function getKeyPairFromMnemonic(mnemonic, bip44account = 0, bip44address = 0) {
	const seed = bip39.mnemonicToSeedSync(mnemonic);
	const node = bip32.fromSeed(seed);
	const child = node.derivePath(bip44path(bip44account, bip44address));
	const ecpair = new ECPair(child.privateKey);

	return {
		privateKey: ecpair.privateKey,
		publicKey: ecpair.publicKey
	};
}

/**
 * Gets an address from a EC publicKey
 *
 * @method getAddressFromPublicKey
 * @param {String} menmonic the given mnemonic
 * @param {String} account the given account number point of BIP44
 * @param {String} address the given address point of BIP44
 * @return {String}
 */

function getAddressFromPublicKey(publicKey, prefix) {
	const addressHash = hash160(publicKey);
	const words = bech32.toWords(addressHash);
	const address = bech32.encode(prefix, words);
	return address;
}


/**
 * Gets a publicKey from Passphrase Mnemonic
 *
 * @method getPublicKeyFromMnemonic
 * @param {String} menmonic the given mnemonic
 * @param {String} bip44account the given bip44account number point of BIP44
 * @param {String} bip44address the given address point of BIP44
 * @return {Buffer}
 */
function getPublicKeyFromMnemonic (mnemonic, bip44account = 0, bip44address = 0) {
	const keypair = getKeyPairFromMnemonic(mnemonic, bip44account, bip44address);

	return secp256k1.publicKeyCreate(keypair.privateKey)
}

/**
 * Gets a EC privateKey from Passphrase Mnemonic
 *
 * @method getPrivateKeyFromMnemonic
 * @param {String} menmonic the given mnemonic
 * @param {String} bip44account the given account number point of BIP44
 * @param {String} bip44address the given bip44address point of BIP44
 * @return {Buffer} 
 */

function getPrivateKeyFromMnemonic (mnemonic, bip44account, bip44address) {
	const keypair = getKeyPairFromMnemonic(mnemonic, bip44account, bip44address);
	return keypair.privateKey;
}

/**
 * Gets an address from a mnemonic
 *
 * @method getAddressFromMnemonic
 * @param {String} menmonic the given mnemonic
 * @param {String} bip44account the given account number point of BIP44
 * @param {String} bip44address the given address point of BIP44
 * @return {String}
 */

function getAddressFromMnemonic (mnemonic, prefix, bip44account=0, bip44address=0) {
	const publicKey = getPublicKeyFromMnemonic(mnemonic, bip44account, bip44address);
	return getAddressFromPublicKey(publicKey, prefix);
}

/**
 * Creates a new mnemonic
 *
 * @method newMnemonic
 * @return {String}
 */
function newMnemonic() {
    return bip39.generateMnemonic();
}


function hash160(buffer) {
    const sha256Hash = createHash('sha256')
        .update(buffer)
        .digest();
    try {
        return createHash('rmd160')
            .update(sha256Hash)
            .digest();
    }
    catch (err) {
        return createHash('ripemd160')
            .update(sha256Hash)
            .digest();
    }
}
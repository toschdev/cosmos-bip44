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
import InputGroup from 'react-bootstrap/InputGroup';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import GithubCorner from 'react-github-corner';
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
      wordEntropy: "128",
      validBip39Mnemonic: true,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.getAddressData = this.getAddressData.bind(this);
    this.handlePrefixChange = this.handlePrefixChange.bind(this);
    this.handleEncodingChange = this.handleEncodingChange.bind(this);
    this.onClickMnemonic = this.onClickMnemonic.bind(this);
    this.handleWordChange = this.handleWordChange.bind(this);
  }

  handleInputChange(event) {
    let mnemonic = event.target.value;
    let validBip39Mnemonic = validateMnemonic(mnemonic);
    console.log(validBip39Mnemonic);
    this.setState({
        loading: true,
        mnemonic,
        validBip39Mnemonic,
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
    let walletData = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]

    let returnData = walletData.map((a, i) => {
        console.log(account);
        const acc = getAccountFromMnemonic(mnemonic, prefix, account, i);
        let obj = {
            index: i,
            path: acc.bip44path,
            keys: {
                publicKey: Buffer.from(acc.publicKey).toString(encoding),
                privateKey: Buffer.from(acc.privateKey).toString(encoding)
            },
            address: acc.address
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
    const mnemonic = newMnemonic(this.state.wordEntropy);
    let validBip39Mnemonic = validateMnemonic(mnemonic);
    this.setState({
        loading: true,
        mnemonic,
        validBip39Mnemonic
    });
    setTimeout(() => {
        let addressData = this.getAddressData();
    
        this.setState({
          addressData,
          loading: false,
        });
    }, 100);
  }

  handleWordChange(event) {
    let word = event.target.value;
    this.setState({
        wordEntropy: word
    });
  }

  render() {
    const { mnemonic, account, prefix, addressData, validBip39Mnemonic, loading } = this.state;
    const { handleInputChange, handleAccountChange, handlePrefixChange, handleEncodingChange, onClickMnemonic, handleWordChange } = this;
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
                    <Col></Col>
                    <Col>
                        <Button style={{margin: "10px"}} onClick={onClickMnemonic} variant="success">Generate new Mnemonic</Button>
                    </Col>
                    <Col>
                        <Form.Group as={Row} controlId="form.selectBufferEncoding">
                            <Form.Label column sm="2"></Form.Label>
                            <Col sm="5">
                                <Form.Control as="select" onChange={handleWordChange}>
                                <option value="128">12</option>
                                <option value="160">15</option>
                                <option value="192">18</option>
                                <option value="224">21</option>
                                <option value="256">24</option>
                                </Form.Control>
                            </Col>
                                Words
                        </Form.Group>
                    </Col>
                </Row>
                
                <Form>
                    <Form.Group as={Row} controlId="formMnemonic">
                        <Form.Label column sm="2">Mnemonic</Form.Label>
                        <Col sm="9">
                            <Form.Control type="text" name="mnemonic" value={mnemonic} placeholder="Enter mnemonic" onChange={handleInputChange} autoFocus />
                            <Form.Text className="text-muted">
                                Your mnemonic passphrase as words.
                            </Form.Text>
                        </Col>  
                        <Col>
                        <OverlayTrigger trigger="click" placement="top" overlay={popoverMnemonic}>
                            <Button variant="primary">?</Button>
                        </OverlayTrigger>
                    </Col>
                    </Form.Group>
                </Form>
                {validBip39Mnemonic ? null : <p style={{color: "red"}}><i>Given mnemonic is not a valid BIP39 mnemonic.</i></p>}
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
                    <Col sm="9">
                        <InputGroup className="mb-2">
                            <Form.Control type="text" value="44" readOnly />
                            <InputGroup.Append>
                            <InputGroup.Text>'</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                    <Col>
                        <OverlayTrigger trigger="click" placement="top" overlay={popoverPurpose}>
                            <Button variant="primary">?</Button>
                        </OverlayTrigger>
                    </Col>

                </Form.Group>

                <Form.Group as={Row} controlId="formCoin">
                    <Form.Label column sm="2">
                        Coin
                    </Form.Label>
                    <Col sm="9">
                        <InputGroup className="mb-2">
                            <Form.Control type="text" value="118" readOnly />
                            <InputGroup.Append>
                            <InputGroup.Text>'</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                    <Col>
                        <OverlayTrigger trigger="click" placement="top" overlay={popoverCoin}>
                            <Button variant="primary">?</Button>
                        </OverlayTrigger>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formCoin">
                    <Form.Label column sm="2">
                        Account
                    </Form.Label>
                    <Col sm="9">
                        <InputGroup className="mb-2">
                            <Form.Control name="account" type="numeric" value={account} onChange={handleAccountChange} />
                            <InputGroup.Append>
                            <InputGroup.Text>'</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                    <Col>
                        <OverlayTrigger trigger="click" placement="top" overlay={popoverAccount}>
                            <Button variant="primary">?</Button>
                        </OverlayTrigger>
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
                                    <td>{a.keys.publicKey}</td>
                                    <td>{a.keys.privateKey}</td>
                                </tr>
                            ) : ""}
                        </tbody>
                        </Table>
                </Col>
        </Row>
        <GithubCorner href="https://github.com/tosch110/cosmos-bip44" />
      </div>
    );
  }
}

const popoverPurpose = (
    <Popover id="popover-purpose">
        <Popover.Title as="h3">Purpose</Popover.Title>
        <Popover.Content>
        Purpose is a constant set to 44' (hardened) following <a href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki" target="new">BIP44</a>. <br/>It indicates that the subtree of this node is used according to this specification.
        <br />
        Hardened derivation is used at this level.
        </Popover.Content>
    </Popover>
);

const popoverCoin = (
    <Popover id="popover-coin">
        <Popover.Title as="h3">Coin type</Popover.Title>
        <Popover.Content>
        Coin type level creates a separate subtree for every cryptocoin, avoiding reusing addresses across cryptocoins and improving privacy issues.
        <br/>
        The Cosmos SDK is registered with 118.
        <br />
        Hardened derivation is used at this level.
        </Popover.Content>
    </Popover>
);

const popoverAccount = (
    <Popover id="popover-account">
        <Popover.Title as="h3">Account</Popover.Title>
        <Popover.Content>
        Users can use these accounts to organize the funds in the same fashion as bank accounts; for donation purposes (where all addresses are considered public), for saving purposes, for common expenses etc.
        <br/>
        Accounts are numbered from index 0 in sequentially increasing manner. This number is used as child index in BIP32 derivation.
        <br/>
        Hardened derivation is used at this level.
        </Popover.Content>
    </Popover>
);

const popoverMnemonic = (
    <Popover id="popover-account">
        <Popover.Title as="h3">Mnemonic</Popover.Title>
        <Popover.Content>
        Passphrase mnemonics are a combination of words that provide a convinient and secure way to save cryptographic keys. 
        </Popover.Content>
    </Popover>
);


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
 * Creates a new mnemonic
 *
 * @method newMnemonic
 * @return {String}
 */
function newMnemonic(entropySize) {
    return bip39.generateMnemonic(entropySize);
}

/**
 * Gets an account from a mnemonic
 *
 * @method getAccountFromMnemonic
 * @param {String} menmonic the given mnemonic
 * @param {String} bip44account the given account number point of BIP44
 * @param {String} address the given address point of BIP44
 * @return {String}
 */
function getAccountFromMnemonic (mnemonic, prefix, bip44account=0, bip44address=0) {
    const keypair = getKeyPairFromMnemonic(mnemonic, bip44account, bip44address);
    const publicKey = secp256k1.publicKeyCreate(keypair.privateKey)
    
	return {
		address: getAddressFromPublicKey(publicKey, prefix),
		bip44path: bip44path(bip44account, bip44address),
        publicKey: publicKey,
        privateKey: keypair.privateKey,
	};
}

/**
 * validates a mnemonic
 *
 * @method validateMnemonic
 * @param {String} menmonic the given mnemonic
 * @return {String}
 */
function validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
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

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import CertificateContract from './contracts/Certificate.json';

function CertificateVerification() {
  const [certificateHash, setCertificateHash] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [studentName, setStudentName] = useState('');
  const [programName, setProgramName] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);

  useEffect(() => {
    const initializeWeb3AndContract = async () => {
      try {
        const _web3 = new Web3('http://localhost:8545');
        const networkId = await _web3.eth.net.getId();
        const deployedNetwork = CertificateContract.networks[networkId];
        const _contractInstance = new _web3.eth.Contract(
          CertificateContract.abi,
          deployedNetwork.address
        );
        setWeb3(_web3);
        setContractInstance(_contractInstance);
      } catch (error) {
        console.error('Error initializing Web3 and contract instance:', error);
      }
    };

    initializeWeb3AndContract(); 
  }, []);

  const verifyCertificate = async () => {
    try {
      if (!web3.utils.isHex(certificateHash) || certificateHash.length !== 66) {
        console.error('Invalid certificate hash format');
        setVerificationResult('Invalid certificate hash format');
        return;
      }


      const isValid = await contractInstance.methods.verifyCertificate(certificateHash).call();
      setVerificationResult(isValid ? 'This certificate is valid' : 'Invalid Certificate');


      if (isValid) {
        const student = await contractInstance.methods.getStudentName(certificateHash).call();
        const program = await contractInstance.methods.getProgramName(certificateHash).call();
        setStudentName(student);
        setProgramName(program);
      } else {

        setStudentName('');
        setProgramName('');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerificationResult('Error verifying certificate. Please try again.');
    }
  };

  return (
    <div className='verifiy'>
      <h2>Paste a Certificate Hash to Verify</h2>
      <input type="text" value={certificateHash} onChange={(e) => setCertificateHash(e.target.value)} />

      <br />
      <button onClick={verifyCertificate}>Verify Certificate</button>
      {verificationResult && <div className='result1'><p style={{ fontSize: '20px', textAlign: 'center' }} >{verificationResult}</p>
        {verificationResult === 'This certificate is valid' && studentName && (
          <p style={{ fontSize: '18px', textAlign: 'left', marginLeft: '40px', marginBottom: '5px' }}>Student Name:<span style={{ fontSize: '18px', color: '#0e2a47', fontStyle: 'italic' }}> {studentName}</span>

          </p>
        )}
        {verificationResult === 'This certificate is valid' && programName && (
          <p style={{ fontSize: '18px', textAlign: 'left', marginLeft: '40px' }}>Program Name:<span style={{ fontSize: '18px', color: '#0e2a47', fontStyle: 'italic' }}> {programName}</span></p>
        )}
      </div>}


    </div >
  );
}

export default CertificateVerification;

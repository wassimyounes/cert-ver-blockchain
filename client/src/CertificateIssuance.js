import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CertificateContract from './contracts/Certificate.json';

function CertificateIssuance({ onIssueCertificate }) {
  const [studentName, setStudentName] = useState('');
  const [programName, setProgramName] = useState('');
  const [issuingResult, setIssuingResult] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);

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

  const issueCertificate = async () => {
    try {
      if (!web3) {
        console.error('Web3 object is not initialized.');
        return;
      }

      const accounts = await web3.eth.getAccounts();
      if (!accounts || !accounts.length) {
        console.error('No accounts found.');
        return;
      }

      if (!contractInstance) {
        console.error('Contract instance is not initialized.');
        return;
      }

      await contractInstance.methods.issueCertificate(studentName, programName).send({ from: accounts[0], gas: '1000000', gasPrice: 1000000 });
      setIssuingResult('Certificate Issued Successfully');
      onIssueCertificate();
    } catch (error) {
      console.error('Error issuing certificate:', error);
      setIssuingResult('A certificate with such data already exists');
    }
  };

  useEffect(() => {
    initializeWeb3AndContract();
  }, []);

  return (
    <div className='issue'>
      <h2>Enter the Required Information to Issue a Certificate</h2>
      <div className='box'>
        <label>Student Name:*</label> <br />
        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} />

        <br />
        <label>Program Name:*</label>  <br />
        <input type="text" value={programName} onChange={(e) => setProgramName(e.target.value)} />
        <br />
        <button onClick={issueCertificate}>Issue Certificate</button>
      </div>
      <br />
      {issuingResult && <p className='result' >{issuingResult}</p>}
    </div>
  );
}

export default CertificateIssuance;

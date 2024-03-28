import React, { useState, useEffect } from 'react';
import CertificateContract from './contracts/Certificate.json';
import Web3 from 'web3';

function CertificateList({ reload, onReloadComplete }) {
    const [certificateHashes, setCertificateHashes] = useState([]);
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

    const fetchCertificateHashes = async () => {
        try {
            if (!contractInstance) {
                console.error('Contract instance is not initialized.');
                return;
            }

            const hashes = await contractInstance.methods.getCertificateHashes().call();
            setCertificateHashes(hashes);
            onReloadComplete();
        } catch (error) {
            console.error('Error fetching certificate hashes:', error);
        }
    };

    useEffect(() => {
        initializeWeb3AndContract();
    }, []);

    useEffect(() => {
        if (web3 && contractInstance) {
            fetchCertificateHashes();
        }
    }, [web3, contractInstance]);

    useEffect(() => {
        if (reload && web3 && contractInstance) {
            fetchCertificateHashes();
        }
    }, [reload, web3, contractInstance ]);

    return (
        <div className="issued-list">
            <h2>Issued Certificate Hashes</h2>

            {certificateHashes.map((hash, index) => (
                <li key={index}>{hash}</li>
            ))}

        </div>
    );
}

export default CertificateList;

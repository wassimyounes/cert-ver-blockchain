import React, { useState } from 'react';
import './App.css';
import CertificateVerification from './CertificateVerification';
import CertificateIssuance from './CertificateIssuance';
import CertificateList from './CertificateList';

function App() {
  const [reloadCertificateList, setReloadCertificateList] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Issue Certificate');
  const handleCertificateIssued = () => {
    setReloadCertificateList(true);
  };

  const handleCertificateListReloaded = () => {
    setReloadCertificateList(false);
  };
  const handleNavItemClicked = (itemName) => {
    setActiveNavItem(itemName);
  };
  return (
    <div className='container'>
      <p>Blockchain-based Certificate Verification System</p>
      <nav className='navBar'>
        <ul className={activeNavItem === 'Issue Certificate' ? 'active' : ''} onClick={() => handleNavItemClicked('Issue Certificate')}>
          Issue Certificate
        </ul>
        <ul className={activeNavItem === 'Verify Certificate' ? 'active' : ''} onClick={() => handleNavItemClicked('Verify Certificate')}>
          Verify Certificate
        </ul>
      </nav>

      <div className="app">
        <div className='left'>
          {activeNavItem === 'Issue Certificate' && (<CertificateIssuance onIssueCertificate={handleCertificateIssued} />)}
          {activeNavItem === 'Verify Certificate' && (<CertificateVerification />)}
        </div>
        <CertificateList reload={reloadCertificateList} onReloadComplete={handleCertificateListReloaded} />
      </div>
    </div>

  );
}

export default App;

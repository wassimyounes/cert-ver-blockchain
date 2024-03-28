// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Certificate {
    struct Cert {
        address issuer;
        string studentName;
        string programName;
        bool isValid;
    }

    mapping(bytes32 => Cert) public certificates;
    bytes32[] public certificateHashes;

    event CertificateIssued(
        bytes32 indexed certificateHash,
        address indexed issuer,
        string studentName,
        string programName
    );
    event CertificateVerified(bytes32 indexed certificateHash, bool isValid);

    function issueCertificate(
        string memory studentName,
        string memory programName
    ) public {
        bytes32 certificateHash = keccak256(
            abi.encodePacked(studentName, programName)
        );
        require(
            certificates[certificateHash].issuer == address(0),
            "Certificate already issued"
        );

        certificates[certificateHash] = Cert(
            msg.sender,
            studentName,
            programName,
            true
        );
        certificateHashes.push(certificateHash);
        emit CertificateIssued(
            certificateHash,
            msg.sender,
            studentName,
            programName
        );
    }

    function getCertificateHashes() public view returns (bytes32[] memory) {
        return certificateHashes;
    }

    function verifyCertificate(
        bytes32 certificateHash
    ) public view returns (bool) {
        return certificates[certificateHash].isValid;
    }

    function getStudentName(
        bytes32 certificateHash
    ) public view returns (string memory) {
        return certificates[certificateHash].studentName;
    }

    function getProgramName(
        bytes32 certificateHash
    ) public view returns (string memory) {
        return certificates[certificateHash].programName;
    }
}

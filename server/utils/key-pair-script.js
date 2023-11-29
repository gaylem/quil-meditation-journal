const crypto = require('crypto');

const generateKeyPair = () => {
  // Generate key pair
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  // Log or use the private key
  console.log('Private Key:', privateKey.replace(/\n/g, ''));

  // Log or use the public key
  console.log('Public Key:', publicKey.replace(/\n/g, ''));

  return { privateKey, publicKey };
};

// Call the function to generate the key pair
generateKeyPair();

import { encrypt, decrypt } from './encrypt-decrypt-utils';

let encryptResult;
const plaintext = 'Hello, world!';

describe('encrypt function', () => {
  it('should encrypt the input text', () => {
    encryptResult = encrypt(plaintext);
    expect(encryptResult.iv).toBeDefined();
    expect(encryptResult.encryptedData).toBeDefined();
    expect(encryptResult.encryptedData).not.toEqual(plaintext);
  });

  it('should throw an error if encryption key is invalid length', () => {
    jest.mock('crypto', () => ({
      createCipheriv: jest.fn(() => {
        throw new Error('Invalid key length');
      }),
    }));

    expect(() => {
      encrypt('Hello, World!', 'invalid_key');
    }).toThrow('Invalid key length');
  });

  it('should generate a different IV for each encryption', () => {
    const result1 = encrypt('Text 1');
    const result2 = encrypt('Text 2');
    expect(result1.iv).not.toEqual(result2.iv);
  });
});

describe('decrypt function', () => {
  it('should decrypt the input text', () => {
    const encryptedText = encryptResult.encryptedData;
    const decryptionIv = encryptResult.iv;
    const decryptResult = decrypt(encryptedText, decryptionIv);
    expect(decryptResult).toEqual(plaintext);
  });

  it('should throw an error if iv is invalid', () => {
    jest.mock('crypto', () => ({
      createDecipheriv: jest.fn(() => {
        throw new Error('Invalid initialization vector');
      }),
    }));

    expect(() => {
      const encryptedText = encryptResult.encryptedData;
      decrypt(encryptedText, 'invalid_iv');
    }).toThrow('Invalid initialization vector');
  });
});

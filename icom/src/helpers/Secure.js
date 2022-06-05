import { useState } from "react";

var crypto = require("crypto");
// var webcrypto = require("webcrypto");

// AKA Sieve of Eratosthenes
const getPrimes = (min, max) => {
  const result = Array(max + 1)
    .fill(0)
    .map((_, i) => i);
  for (let i = 2; i <= Math.sqrt(max + 1); i++) {
    for (let j = i ** 2; j < max + 1; j += i) delete result[j];
  }
  return Object.values(result.slice(Math.max(min, 2)));
};

const getRandNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandPrime = (min, max) => {
  const primes = getPrimes(min, max);
  return primes[getRandNum(0, primes.length - 1)];
};

// to add function for generator, default is two

const Secure = () => {
  const [instance, setInstance] = useState(null);

  const GenerateDiffieHelmanKeys = () => {
    const rprime = getRandPrime(500, 2000);
    const object = crypto.createDiffieHellman(rprime);
    setInstance(object);
    //
  };

  const getPublicKey = () => {
    if (instance === null) return;
    return instance.generateKeys("base64");
  };

  const generateSharedKey = (theOtherKey) => {
    if (instance === null) return;
    return instance.computeSecret(theOtherKey, "base64", "hex");
  };

  return {
    GenerateDiffieHelmanKeys,
    getPublicKey,
    generateSharedKey,
  };
};

export default Secure;

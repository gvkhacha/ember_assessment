import React from 'react';

import {useState, useEffect} from 'react';

import {Text} from 'react-native';
import wallet from 'eth-wallet-light';




const TestWallet = () => {
    const [addr, setAddr] = useState('');

    useEffect(() => {
        const password = "tempfakepassword";
        const entropy = "tempfakeentropy";
        const keystore = new wallet.Keystore();

        keystore.initializeFromEntropy(entropy, password)
            .then(result => {
                console.log(result);
                setAddr(result.getAddress());
            })
    }, [])





    return (
        <>
            <Text>Hello World</Text>
            <Text>{addr}</Text>
        </>
    );
}

export default TestWallet;
import React, { useEffect } from 'react';
import {useState} from 'react';

import {Text, StyleSheet, Button, View, AsyncStorage} from 'react-native';

import { generateSecureRandom } from 'react-native-securerandom';

import wallet from 'eth-wallet-light';

async function csprng(bytes){
    let randomBytes = await generateSecureRandom(bytes);
    return randomBytes.toString('hex');
}

const Wallet = () => {
    const [pubAddr, setPubAddr] = useState('0x32Be343B94f860124dC4fEe278FDCBD38C102D88');
    const [privAddr, setPrivAddr] = useState('0x32Be343B94f860124dC4fEe278FDCBD38C102D88');
    const [hidePrivate, setHidePrivate] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("wallet")
            .then(data => {
                console.log(data);
                if (data != null){
                    const fields = data.split(";");
                    setPubAddr(fields[0]);
                    setPrivAddr(fields[1]);
                }
            })
    }, []);

    const copyPublicAddr = () => {
        console.log("public addr", pubAddr);
    }

    const togglePrivAddr = () => {
        setHidePrivate(!hidePrivate)
    }

    const resetWallet = () => {
        const keystore = new wallet.Keystore(csprng);
        keystore.initializeFromEntropy("tempfakeentropy", "tempfakepassword")
            .then(result => {
                const publicAddr = result.getAddress();
                const privateAddr = result.getPrivateKey("tempfakepassword");

                setPubAddr(result.getAddress());
                setPrivAddr(result.getPrivateKey("tempfakepassword"));

                const data = publicAddr + ";" + privateAddr;
                AsyncStorage.setItem("wallet", data, err => {
                    console.log(err);
                });
            })
    }

    return (
        <>
            <Text>This is your ETH Wallet</Text>
        <View>
            <View>
                <Text style={styles.addrText}>
                    {pubAddr}
                </Text>
                <Button 
                    title="Click to copy"
                    onPress={copyPublicAddr}
                />
            </View>
            <View>
                <Text style={styles.addrText}>
                    {hidePrivate ? '*'.repeat(42) : privAddr}
                </Text>
                <Button 
                    title={(hidePrivate ? "Show " : "Hide ") + "Private Address"}
                    onPress={togglePrivAddr}
                />
            </View>
            <Button
                title="Reset Wallet"
                onPress={resetWallet}
            />
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    addrText: {
        textAlign: 'center'
    }
})

export default Wallet;
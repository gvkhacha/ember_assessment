import React, { useEffect } from 'react';
import {useState} from 'react';

import {Text, StyleSheet, Button, View, AsyncStorage, Alert} from 'react-native';
import Clipboard from "@react-native-community/clipboard";

import { generateSecureRandom } from 'react-native-securerandom';

import wallet from 'eth-wallet-light';

async function csprng(bytes){
    let randomBytes = await generateSecureRandom(bytes);
    return randomBytes.toString('hex');
}

// will likely be an async function that
// not sure how react-native-securerandom if thats true entropy
function entropyString(){
    return "tempfakeentropy";
}

const password = "tempfakepassword"; //not considering passwords at all

const Wallet = () => {
    const [pubAddr, setPubAddr] = useState('0x0000000000000000000000000000000000000000');
    const [privAddr, setPrivAddr] = useState('0x0000000000000000000000000000000000000000000000000000000000000000');
    const [hidePrivate, setHidePrivate] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("wallet")
            .then(data => {
                if (data != null){
                    const keystore = new wallet.Keystore().restorefromSerialized(data)
                    setPubAddr(keystore.getAddress());
                    setPrivAddr(keystore.getPrivateKey(password));
                }
            })
    }, []);

    const copyPublicAddr = () => {
        Clipboard.setString(pubAddr);
    }

    const copyPrivateAddr = () => {
        Clipboard.setString(privAddr);
    }

    const togglePrivAddr = () => {
        setHidePrivate(!hidePrivate)
    }

    const resetWallet = () => {
        const keystore = new wallet.Keystore(csprng);
        keystore.initializeFromEntropy(entropyString(), password)
            .then(result => {
                setPubAddr(result.getAddress());
                setPrivAddr(result.getPrivateKey(password));

                // Also, probably a bad way to store data.
                // Should likely be encrypted/decrypted through eth-wallet's keystore
                // but passwords are not being considered at all right now.
                const data = keystore.serialize();
                AsyncStorage.setItem("wallet", data, err => {
                    if(err){
                        console.log(err);
                    }
                });
            })
    }

    const resetWalletAlert = () => {
        Alert.alert(
            "Reset Wallet",
            "Are you sure you want to generate new keys. Existing data will be destroyed.",
            [
                {
                    text: "Yes",
                    onPress: resetWallet,
                    style: "destructive"
                },
                {
                    text: "No",
                    style: "cancel",
                }
            ]
        )
    }

    return (
        <>
        <View>
            <View>
                <Text style={styles.walletTitle}>This is your ETH Wallet</Text>
            </View>
            <View style={{marginBottom: 20}}>
                <Text style={styles.addrTitle}>Public Key</Text>
                <Text style={styles.addrText} selectable={true}>
                    {pubAddr}
                </Text>
                <Button 
                    title="Click to copy"
                    onPress={copyPublicAddr}
                />
            </View>
            <View style={{width: '80%'}}>
                <Text style={styles.addrTitle}>Private Key</Text>
                <Text style={styles.addrText} selectable={true} ellipsizeMode={'middle'}>
                    {hidePrivate ? '0x' + '0'.repeat(64) : privAddr}
                </Text>
                <View>
                    <View>
                        <Button 
                            title="Click to copy"
                            onPress={copyPrivateAddr}
                            style={styles.privateBtns}
                        />
                    </View>
                    <View style={{marginTop: 10, marginBottom: 50}}>
                        <Button 
                            title={(hidePrivate ? "Show " : "Hide ") + "Private Address"}
                            onPress={togglePrivAddr}
                            style={styles.privateBtns}
                        />
                    </View>
                </View>
            </View>
            <Button
                title="Reset Wallet"
                onPress={resetWalletAlert}
                style={styles.resetBtn}
            />
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    walletTitle: {
        fontSize: 18,
        textAlign: "center",
        paddingBottom: 100,
        color: '#000000',
        fontWeight: 'bold'
    },
    addrTitle: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold'
    },
    addrText: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    privateBtns: {
        width: '20%',
        marginTop: 20
    },
    privateBtnContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 200
    },
    resetBtn: {
        marginTop: 100
    }
})

export default Wallet;
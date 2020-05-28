import React, { useEffect } from 'react';
import {useState} from 'react';

import {Text, StyleSheet, Button, View, AsyncStorage} from 'react-native';
import Clipboard from "@react-native-community/clipboard";

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
                    {hidePrivate ? '*'.repeat(42) : privAddr}
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
                onPress={resetWallet}
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
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Wallet from './components/wallet';

export default function App() {
  return (
    <View style={styles.container}>
      <Wallet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

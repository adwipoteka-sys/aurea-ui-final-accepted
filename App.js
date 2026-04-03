import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ExactAureaV13Windows from './src/ExactAureaV13Windows';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <ExactAureaV13Windows />
    </SafeAreaProvider>
  );
}

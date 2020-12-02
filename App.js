import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import{ ConfigureStore } from './redux/configureStore';
<script src="http://192.168.0.3:8097"></script>

const store = ConfigureStore();

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>

  );
}


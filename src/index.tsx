import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './redux/themeSlice';
import { QueryClient, QueryClientProvider } from 'react-query';
import roomReducer from './redux/roomSlice';
import logReducer from './redux/logSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    room: roomReducer,
    log: logReducer
  }
})

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorkerRegistration.register();

reportWebVitals();

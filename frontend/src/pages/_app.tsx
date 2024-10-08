// pages/_app.tsx
import { Provider } from 'react-redux';
import { store } from "@/redux/store/store";

import { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;

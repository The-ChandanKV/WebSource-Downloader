import '../styles/globals.css';

// This is the main App component that Next.js uses to wrap all pages.
// 'Component' is the active page, 'pageProps' are its initial props.
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// This is the most important line!
// It exports the MyApp function as the default export for this file.
export default MyApp;
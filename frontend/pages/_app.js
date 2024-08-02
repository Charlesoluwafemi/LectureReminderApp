// pages/_app.js
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default MyApp;

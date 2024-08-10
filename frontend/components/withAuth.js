import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/login');
      } else {
        try {
          jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
          router.push('/login');
        }
      }
    }, [router]); // Added `router` as a dependency

    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

  return Wrapper;
};

// Helper function to get the display name
const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default withAuth;

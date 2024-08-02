// components/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const withAuth = (WrappedComponent) => {
  return (props) => {
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
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

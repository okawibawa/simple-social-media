import React, { useEffect, useState } from 'react';
import styles from './Auth.module.css';
import axios from 'axios';

// Components
import Layout from '../components/Layout';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginState, setIsLoginState] = useState(true);
  const [credentials, setCredentials] = useState();

  const handleChangeCredentials = (name) => (e) => {
    setCredentials({ ...credentials, [name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoginState(true);
    setIsLoading(true);

    try {
      const { data } = await axios.post('http://localhost:1337/auth/local', {
        identifier: credentials.email,
        password: credentials.password,
      });
      console.log(data);
      window.localStorage.setItem('userJWT', data.jwt);
      window.localStorage.setItem('userData', JSON.stringify(data.user));

      setIsLoading(false);
      window.location.replace('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsLoginState(true);
    setIsLoading(true);

    try {
      const { data } = await axios.post('http://localhost:1337/auth/local/register', {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      });
      console.log(data);
      window.localStorage.setItem('userJWT', data.jwt);
      window.localStorage.setItem('userData', JSON.stringify(data.user));

      setIsLoading(false);
      window.location.replace('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className={styles.util}>
        {!isLoading ? (
          <div className={styles.form__container}>
            {isLoginState ? <h1>LOGIN</h1> : <h1>REGISTER</h1>}

            <form className={styles.forms}>
              <div className={styles.form__wrapper}>
                <label htmlFor="email" className={styles.label}>
                  E-Mail
                </label>
                <input
                  type="email"
                  placeholder="test@example.com"
                  className={styles.input}
                  onChange={handleChangeCredentials('email')}
                />
              </div>

              {!isLoginState && (
                <div className={styles.form__wrapper}>
                  <label htmlFor="username" className={styles.label}>
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={styles.input}
                    onChange={handleChangeCredentials('username')}
                  />
                </div>
              )}

              <div className={styles.form__wrapper}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="at least 6 characters"
                  className={styles.input}
                  onChange={handleChangeCredentials('password')}
                />
              </div>

              {isLoginState ? (
                <button className={styles.button} onClick={handleLogin}>
                  LOGIN
                </button>
              ) : (
                <button className={styles.button} onClick={handleRegister}>
                  REGISTER
                </button>
              )}
            </form>

            {isLoginState ? (
              <p>
                New here?{' '}
                <span className={styles.cta} onClick={(e) => setIsLoginState(false)}>
                  Register
                </span>
                .
              </p>
            ) : (
              <p>
                Have an account?{' '}
                <span className={styles.cta} onClick={(e) => setIsLoginState(true)}>
                  Login
                </span>
                .
              </p>
            )}
          </div>
        ) : (
          <h1>Please wait ...</h1>
        )}
      </div>
    </Layout>
  );
};

export default Auth;

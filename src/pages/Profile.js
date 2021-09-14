import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';

import Trash from '../assets/img/trash.svg';

// components
import Layout from '../components/Layout';
import axios from 'axios';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userJWT, setUserJWT] = useState('');
  const [userData, setUserData] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setUserJWT(window.localStorage.getItem('userJWT'));
    setUserData([JSON.parse(window.localStorage.getItem('userData'))]);
    const userId = JSON.parse(window.localStorage.getItem('userData')).id;

    const fetchPosts = async () => {
      const { data } = await axios.get(`http://localhost:1337/posts?user.id=${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.localStorage.getItem('userJWT')}`,
        },
      });

      setPosts([data]);
    };

    setTimeout(() => {
      fetchPosts();
    }, 500);
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Sure you want to logout?')) {
      window.localStorage.removeItem('userJWT');
      window.localStorage.removeItem('userData');

      window.location.replace('/');
    }
  };

  const handleDeletePost = async (id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userJWT}`,
      },
    };

    if (window.confirm('Delete this post?')) {
      setIsLoading(true);
      try {
        const { data } = await axios.delete(`http://localhost:1337/posts/${id}`, config);
        alert('Data deleted!');
        setIsLoading(false);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Layout>
      {userData.length > 0 ? (
        <>
          <header className={styles.header}>
            <Link to="/" className={styles.header__title}>
              <h1 style={{ marginBottom: 0 }}>
                <b>Carta</b>
              </h1>
            </Link>

            <div>
              <Link to="/" className={styles.header__link} style={{ marginRight: '1em' }}>
                Home
              </Link>

              <Link to="#" className={styles.header__link} onClick={handleLogout}>
                Logout
              </Link>
            </div>
          </header>

          <section className={styles.profile}>
            <h2 style={{ marginBottom: '.5em' }}>{userData[0].username}</h2>
            <h5 style={{ marginBottom: '0' }}>{userData[0].email}</h5>
          </section>

          {posts && posts.length > 0 ? (
            <section className={styles.posts}>
              {posts[0]
                .filter((post) => post.user !== null)
                .sort((a, b) => b.id - a.id)
                .map((post) => (
                  <>
                    {!isLoading && (
                      <Link to="#" className={styles.post} key={post.id}>
                        <div className={styles.posts__title__container}>
                          <div>
                            <small className={styles.posts__username}>{userData[0].username}</small>
                            <small>{userData[0].email}</small>
                          </div>

                          <img
                            src={Trash}
                            alt="Delete"
                            style={{ width: '16px' }}
                            onClick={() => handleDeletePost(post.id)}
                          />
                        </div>
                        <p>{post.post_text}</p>
                      </Link>
                    )}
                  </>
                ))}
            </section>
          ) : (
            <header className={styles.header}>
              <Link to="#" className={styles.header__title}>
                <h1>
                  <b>Please wait ...</b>
                </h1>
              </Link>

              <Link to="/profile" className={styles.header__link}></Link>
            </header>
          )}
        </>
      ) : (
        <header className={styles.header}>
          <Link to="#" className={styles.header__title}>
            <h1 style={{ marginBottom: 0 }}>
              <b>Please Wait ...</b>
            </h1>
          </Link>
        </header>
      )}
    </Layout>
  );
};

export default Profile;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

import Trash from '../assets/img/trash.svg';

// components
import Layout from '../components/Layout';
import axios from 'axios';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userJWT, setUserJWT] = useState('');
  const [userData, setUserData] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setUserJWT(window.localStorage.getItem('userJWT'));
    setUserData(JSON.parse(window.localStorage.getItem('userData')));
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('http://localhost:1337/posts?_sort=id:desc');

        setPosts(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, []);

  const toggleLikes = async (id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userJWT}`,
      },
    };

    try {
      const result = await axios.post('http://localhost:1337/upvotes/toggle-like', { post: id }, config);

      if (result.statusText === 'OK') {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
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
        alert('Data berhasil dihapus!');
        setIsLoading(false);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChangeTextarea = (e) => {
    setNewPost(e.target.value);
  };

  const handleSubmitNewPost = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userJWT}`,
      },
    };

    if (newPost) {
      setIsLoading(true);
      try {
        const { data } = await axios.post(`http://localhost:1337/posts`, { post_text: newPost }, config);
        setIsLoading(false);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Write something first!');
    }
  };

  return (
    <Layout>
      <header className={styles.header}>
        <Link to="/" className={styles.header__title}>
          <h1 style={{ marginBottom: 0 }}>
            <b>Carta</b>
          </h1>
        </Link>

        {userJWT ? (
          <Link to="/profile" className={styles.header__link}>
            Profile
          </Link>
        ) : (
          <Link to="/auth" className={styles.header__link}>
            Login
          </Link>
        )}
      </header>

      <section className={styles.add__post}>
        <textarea
          name="post"
          placeholder="What's on your mind?"
          className={styles.textarea}
          defaultValue={newPost}
          onChange={handleChangeTextarea}
          disabled={isLoading ? true : false}
        />
        <button className={styles.btn__go} onClick={handleSubmitNewPost} disabled={isLoading ? true : false}>
          GO!
        </button>
      </section>

      {!isLoading ? (
        <section className={styles.posts}>
          {posts
            .filter((post) => post.user !== null)
            .map((post) => (
              <div className={styles.post}>
                <Link to={`/detail-post/${post.id}`} className={styles.clickable} key={post.id}>
                  <div className={styles.posts__title__container}>
                    <div>
                      <small className={styles.posts__username}>{post.user.username}</small>
                      <small>{post.user.email}</small>
                    </div>

                    {userData && post.user.id === userData.id && (
                      <img
                        src={Trash}
                        alt="Delete"
                        style={{ width: '16px' }}
                        onClick={() => handleDeletePost(post.id)}
                      />
                    )}
                  </div>
                  <p>{post.post_text}</p>
                </Link>
                <div className={styles.posts__engagements}>
                  <small onClick={(e) => toggleLikes(post.id)}>
                    {post.upvotes.length > 0 ? post.upvotes.length : 0} 🖤
                  </small>
                  <small>{post.comments.length > 0 ? post.comments.length : 0} 💬</small>
                </div>
              </div>
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
    </Layout>
  );
};

export default Home;

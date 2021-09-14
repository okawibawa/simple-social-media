import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './DetailPost.module.css';

import Trash from '../assets/img/trash.svg';

// components
import Layout from '../components/Layout';

// http://localhost:1337/posts/:id

const DetailPost = ({ match }) => {
  const { postId } = match.params;

  const [isLoading, setIsLoading] = useState(false);
  const [userJWT, setUserJWT] = useState();
  const [userData, setUserData] = useState([]);
  const [detailPost, setDetailPost] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    setUserJWT(window.localStorage.getItem('userJWT'));
    setUserData(JSON.parse(window.localStorage.getItem('userData')));

    const fetchDetailPost = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:1337/posts/${postId}`);

        setDetailPost([data]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetailPost();
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
    setNewComment(e.target.value);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userJWT}`,
      },
    };

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        'http://localhost:1337/comments/add',
        { comment_text: newComment, post: postId },
        config
      );

      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
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

      {detailPost.length > 0 ? (
        <>
          <section className={`${styles.posts} ${styles.post}`}>
            <div className={styles.posts__title__container} key={detailPost[0].id}>
              <div>
                <small className={styles.posts__username}>{detailPost[0].user.username}</small>
                <small>{detailPost[0].user.email}</small>
              </div>

              {userData && detailPost[0].user.id === userData.id && (
                <img
                  src={Trash}
                  alt="Delete"
                  style={{ width: '16px' }}
                  onClick={() => handleDeletePost(detailPost[0].id)}
                />
              )}
            </div>
            <p>{detailPost[0].post_text}</p>
            <div className={styles.posts__engagements}>
              <small onClick={(e) => toggleLikes(detailPost[0].id)}>
                {detailPost[0].upvotes.length > 0 ? detailPost[0].upvotes.length : 0} 🖤
              </small>
              <small>{detailPost[0].comments.length > 0 ? detailPost[0].comments.length : 0} 💬</small>
            </div>
          </section>

          <section className={styles.add__post}>
            <textarea
              name="post"
              placeholder="What's on your mind?"
              className={styles.textarea}
              defaultValue={newComment}
              onChange={handleChangeTextarea}
            />
            <button className={styles.btn__go} onClick={handleAddComment}>
              GO!
            </button>
          </section>
        </>
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

      <h3>
        <b>Replies</b>
      </h3>

      {detailPost.length > 0 ? (
        detailPost[0].comments && detailPost[0].comments.length > 0 ? (
          !isLoading ? (
            detailPost[0].comments
              .sort((a, b) => b.id - a.id)
              .map((comment) => (
                <>
                  <section className={styles.comments__container}>
                    <div className={styles.dots}>
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </div>

                    <div className={`${styles.posts} ${styles.comments}`}>
                      <div className={styles.posts__title__container} key={detailPost[0].id}>
                        <div>
                          <small className={styles.posts__username}>{detailPost[0].comments[0].user.username}</small>
                          <small>{detailPost[0].comments[0].user.email}</small>
                        </div>

                        {/* {userData && detailPost[0].user.id === userData.id && (
                        <img
                          src={Trash}
                          alt="Delete"
                          style={{ width: '16px' }}
                          onClick={() => handleDeletePost(detailPost[0].id)}
                        />
                      )} */}
                      </div>

                      <p>{comment.comment_text}</p>

                      <div className={styles.posts__engagements}>
                        <small onClick={(e) => toggleLikes(comment.id)}>
                          {comment.upvotes.length > 0 ? comment.upvotes.length : 0} 🖤
                        </small>
                        {/* <small>{detailPost[0].comments.length > 0 ? detailPost[0].comments.length : 0} 💬</small> */}
                      </div>
                    </div>
                  </section>
                </>
              ))
          ) : (
            <header className={styles.header}>
              <Link to="#" className={styles.header__title}>
                <h4>
                  <b>Loading Replies ...</b>
                </h4>
              </Link>

              <Link to="/profile" className={styles.header__link}></Link>
            </header>
          )
        ) : (
          <header className={styles.header}>
            <Link to="#" className={styles.header__title}>
              <h4>
                <b>It's empty out here 📭</b>
              </h4>
            </Link>

            <Link to="/profile" className={styles.header__link}></Link>
          </header>
        )
      ) : (
        <header className={styles.header}>
          <Link to="#" className={styles.header__title}>
            <h4>
              <b>Loading Replies ...</b>
            </h4>
          </Link>

          <Link to="/profile" className={styles.header__link}></Link>
        </header>
      )}
    </Layout>
  );
};

export default DetailPost;

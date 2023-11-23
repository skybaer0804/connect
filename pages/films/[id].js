import { useRouter } from "next/router";
import Container from "@/components/Container";
import Header from "@/components/Header";
import MovieReviewList from "@/components/MovieReviewList";
import styles from "@/styles/Movie.module.css";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import Head from "next/head";

const labels = {
  rating: {
    12: "12세이상관람가",
    15: "15세이상관람가",
    19: "청소년관람불가",
    all: "전체관람가",
  },
};

export default function Movie() {
  const router = useRouter();
  const id = router.query["id"];

  const [movie, setMovie] = useState();
  const [movieReviews, setMovieReviews] = useState([]);

  async function getMovie(targetId) {
    const res = await axios.get(`/movies/${targetId}`);
    const nextMovie = res.data;
    setMovie(nextMovie);
  }

  async function getMovieReviews(targetId) {
    const res = await axios.get(`/movie_reviews/?movie_id=${targetId}`);
    const nextMovieReviews = res.data.results ?? [];
    setMovieReviews(nextMovieReviews);
  }

  useEffect(() => {
    if (id) {
      getMovie(id);
      getMovieReviews(id);
    }
  }, [id]);

  if (!movie) return null;

  return (
    <>
      <Head>
        <title>{movie.title} - watchit</title>
      </Head>
      <Container page>
        <div className={styles.header}>
          <div className={styles.posterContainer}>
            <Image fill src={movie.posterUrl} alt={movie.name} />
          </div>
          <div className={styles.info}>
            <div className={styles.englishTitle}>{movie.englishTitle}</div>
            <h1 className={styles.title}>{movie.title}</h1>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <th>개봉</th> <td>{movie.date}</td>
                </tr>
                <tr>
                  <th>장르</th> <td>{movie.genre}</td>
                </tr>
                <tr>
                  <th>국가</th> <td>{movie.country}</td>
                </tr>
                <tr>
                  <th>등급</th> <td>{labels.rating[movie.rating]}</td>
                </tr>
                <tr>
                  <th>러닝타임</th> <td>{movie.runningTime}분</td>
                </tr>
                <tr>
                  <th>평점</th>{" "}
                  <td className={styles.starRating}>★{movie.starRating}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>소개</h2>
          <p className={styles.description}>{movie.description}</p>
          <span className={styles.readMore}>더보기</span>
        </section>
        <div className={styles.reviewSections}>
          <section>
            <h2 className={styles.sectionTitle}>내 리뷰 작성하기</h2>
          </section>
          <section>
            <h2 className={styles.sectionTitle}>리뷰</h2>
            <MovieReviewList movieReviews={movieReviews} />
          </section>
        </div>
      </Container>
    </>
  );
}

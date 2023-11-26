import { useRouter } from "next/router";
import Container from "@/components/Container";
import MovieReviewList from "@/components/MovieReviewList";
import styles from "@/styles/Movie.module.css";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import Head from "next/head";
import { notFound } from "next/navigation";
import Spinner from "@/components/Spinner";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";

const labels = {
  rating: {
    12: "12세이상관람가",
    15: "15세이상관람가",
    19: "청소년관람불가",
    all: "전체관람가",
  },
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  let movie;
  try {
    const res = await axios.get(`/movies/${id}`);
    movie = res.data;
  } catch {
    return {
      notFound: true,
    };
  }

  let movieReviews;
  try {
    const res = await axios.get(`/movie_reviews/?movie_id=${id}`);
    movieReviews = res.data.results ?? [];
  } catch {
    movieReviews = [];
  }

  return {
    props: {
      movie,
      movieReviews,
    },
  };
}

export default function Movie({ movie, movieReviews: initialMovieReviews }) {
  const [movieReviews, setMovieReviews] = useState(initialMovieReviews);

  const [formValue, setFormValue] = useState({
    sex: "male",
    age: 10,
    starRating: 1,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...formValue,
      movieId: movie.id,
    };
    const res = await axios.post("/movie_reviews/", payload);
    const nextMovieReview = res.data;

    setMovieReviews((prevValue) => [nextMovieReview, ...prevValue]);
  }

  function handleChange(name, value) {
    setFormValue({
      ...formValue,
      [name]: value,
    });
  }

  if (!movie) {
    return (
      <div className={styles.loading}>
        <Spinner />
        <p>로딩중입니다. 잠시만 기다려주세요.</p>
      </div>
    );
  }

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
            <form className={styles.reviewForm} onSubmit={handleSubmit}>
              <label className={styles.label}>
                성별
                <Dropdown
                  className={styles.dropdown}
                  name="sex"
                  value={formValue.sex}
                  options={[
                    { label: "남성", value: "male" },
                    { label: "여성", value: "female" },
                  ]}
                  onChange={handleChange}
                />
              </label>
              <label className={styles.label}>
                연령
                <Dropdown
                  className={styles.dropdown}
                  name="age"
                  value={formValue.age}
                  options={[
                    { label: "10대", value: 10 },
                    { label: "20대", value: 20 },
                    { label: "30대", value: 30 },
                    { label: "40대", value: 40 },
                    { label: "50대", value: 50 },
                  ]}
                  onChange={handleChange}
                />
              </label>
              <label className={styles.label}>
                별점
                <Dropdown
                  className={styles.dropdown}
                  name="starRating"
                  value={formValue.starRating}
                  options={[
                    { label: "★☆☆☆☆", value: 1 },
                    { label: "★★☆☆☆", value: 2 },
                    { label: "★★★☆☆", value: 3 },
                    { label: "★★★★☆", value: 4 },
                    { label: "★★★★★", value: 5 },
                  ]}
                  onChange={handleChange}
                />
              </label>
              <Button className={styles.submit}>작성하기</Button>
            </form>
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

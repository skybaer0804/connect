import { useRouter } from "next/router";
import MovieList from "@/components/MovieList";
import SearchForm from "@/components/SearchForm";
import styles from "@/styles/Search.module.css";
import Container from "@/components/Container";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Search() {
  const router = useRouter();
  const q = router.query["q"];

  const [movies, setMovies] = useState([]);

  async function getMovies(query) {
    const res = await axios.get(`/movies/?q=${query}`);
    console.info("res : ", res);
    const nextMovies = res.data.results ?? [];
    setMovies(nextMovies);
  }

  useEffect(() => {
    getMovies(q);
  }, [q]);

  return (
    <>
      <Head>
        <title>{q} 검색 결과 - watchit</title>
      </Head>
      <Container page>
        <SearchForm initialValue={q} />
        <h2 className={styles.title}>
          <span className={styles.keyword}>{q}</span> 검색 결과
        </h2>
        <MovieList movies={movies} />
      </Container>
    </>
  );
}

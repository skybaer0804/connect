import SearchForm from "@/components/SearchForm";
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";
import Container from "@/components/Container";
import MovieList from "@/components/MovieList";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export async function getStaticProps() {
  const res = await axios.get("/movies");
  const movies = res.data.results ?? [];

  return { props: { movies } };
}

export default function Home({ movies }) {
  return (
    <>
      <Container page>
        <SearchForm />
        <MovieList className={styles.movieList} movies={movies} />
      </Container>
    </>
  );
}

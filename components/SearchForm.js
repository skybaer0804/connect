import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./SearchForm.module.css";

export default function SearchForm({ initialValue = "" }) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  function handleChange(e) {
    setValue(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!value) {
      return router.push("/");
    }
    return router.push(`/search?q=${value}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={styles.input}
        name="q"
        value={value}
        placeholder="영화를 검색해보세요."
        onChange={handleChange}
      />
      <button className={styles.button}>검색</button>
    </form>
  );
}

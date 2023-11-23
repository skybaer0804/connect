import styles from "./StarRating.module.css";

const RATINGS = [1, 2, 3, 4, 5];

export default function StarRating({ value = 1 }) {
  return (
    <span className={styles.starRating}>
      {RATINGS.map((rating) => (value >= rating ? "★" : "✩"))}
    </span>
  );
}

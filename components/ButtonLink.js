import Link from "next/link";
import buttonStyles from "./Button.module.css";
import styles from "./ButtonLink.module.css";

export default function ButtonLink({ className = "", ...props }) {
  return (
    <Link
      className={`${buttonStyles.button} ${styles.buttonLink} ${className}`}
      {...props}
    />
  );
}

// components/NavBar.js
import Link from "next/link";

const styles = {
  nav: {
    background: "#333",
    padding: "1rem",
    position: "fixed", // fixed across pages
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
  },
  navList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginRight: "1rem",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
  },
};

export default function NavBar() {
  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link href="/home" style={styles.navLink}>Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/profile" style={styles.navLink}>Profile</Link>
        </li>
      </ul>
    </nav>
  );
}



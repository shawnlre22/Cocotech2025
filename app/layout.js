import NavBar from "./components/NavBar";

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main style={{ paddingTop: "60px" }}> {/* space for fixed navbar */}
          {children}
        </main>
      </body>
    </html>
  );
}

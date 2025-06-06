import "./globals.css";
import Navbar from "../app/Navbar";

export const metadata = {
  title: "MarketLab",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <div style={{ paddingTop: "56px" }}></div>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}

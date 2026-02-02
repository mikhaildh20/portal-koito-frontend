import { Inter, Roboto_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400","500","600","700"], // optional, biar bervariasi
});

const mono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400","500","700"],
});

export const metadata = {
  title: "Indonesia Koito Portal Site",
  description: "Portal site for Indonesia Koito employees and stakeholders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}

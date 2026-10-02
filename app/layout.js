import "./globals.css";

export const metadata = {
  title: "BOOKLOG | 나만의 독서 기록",
  description: "책을 검색하고 나만의 독서 기록을 관리하는 서비스",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

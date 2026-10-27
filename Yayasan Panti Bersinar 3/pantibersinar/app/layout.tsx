import "./globals.css";

export const metadata = {
  title: "Pantibersinar",
  description: "Platform organisasi dan donasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

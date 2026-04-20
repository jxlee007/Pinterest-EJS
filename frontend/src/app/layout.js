import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import '@/app/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#27272a] text-white">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

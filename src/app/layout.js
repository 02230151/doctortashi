import './globals.css';
import SessionProviderWrapper from './SessionProviderWrapper';

export const metadata = {
  title: 'CureLink',
  description: 'Healthcare Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import './globals.css';
import I18nProvider from './components/I18nProvider';
import DemoBanner from './components/DemoBanner';
import DemoFooter from './components/DemoFooter';

export const metadata: Metadata = {
  title: 'Civic Companion | Government services, made simple',
  description: 'Personalized guidance for government services in India.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <div className="flex min-h-screen flex-col">
            <DemoBanner />
            <div className="flex-1">
              {children}
            </div>
            <DemoFooter />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}

import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/styles";
import "overlayscrollbars/overlayscrollbars.css";
import "swiper/css";
import "swiper/css/free-mode";
import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { AriaProviders } from "@/shared/components/aria-providers";
import { AppShell } from "@/shared/components/app-shell";

export const metadata = {
  title: "Our Memory Map",
  description: "Không gian kỷ niệm riêng tư dành cho hai người.",
  applicationName: "Our Memory Map",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Our Memory"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport = {
  themeColor: "#ffffff"
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <AriaProviders>
          <AppShell>{children}</AppShell>
        </AriaProviders>
      </body>
    </html>
  );
}

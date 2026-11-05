import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSessionUser } from "@/lib/auth";
import { NEWSLETTER_COOKIE } from "@/lib/newsletter";

export const metadata: Metadata = {
  title: { default: "Gauntlet Shop — gear for everyday riders", template: "%s · Gauntlet Shop" },
  description: "Gloves, apparel, bags, lights and tools for people who ride every day.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b2a41",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();
  const store = await cookies();
  const subscribedEmail = store.get(NEWSLETTER_COOKIE)?.value ?? null;

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header user={user} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer subscribedEmail={subscribedEmail} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

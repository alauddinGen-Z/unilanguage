import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
    title: "UNI Language Hub - Impossible is possible with U",
    description: "International teachers, modern methodology, individual approach. IELTS, SAT, General English courses in Bishkek.",
    openGraph: {
        title: "UNI Language Hub",
        description: "Achieve your language goals with UNI Language Hub. IELTS, SAT, and General English.",
        type: "website",
        locale: "en_US",
        siteName: "UNI Language Hub",
    },
    twitter: {
        card: "summary_large_image",
        title: "UNI Language Hub",
        description: "Impossible is possible with U. Join us for IELTS, SAT, and English courses.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="font-sans antialiased">
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Container>
        <Header />
        {children}
        <Footer />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
            },
            // className: "sonner-toast",
          }}
        />
      </Container>
    </>
  );
}

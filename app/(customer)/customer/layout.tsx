
import CustomerNavbar from "./components/CustomerNavbar";
import Footer from "@/app/components/layout/Footer";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFF9F0]">
      <CustomerNavbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

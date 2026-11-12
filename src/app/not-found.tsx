import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotFoundContent from "./NotFoundContent";

export const metadata = {
  title: "404 - Page Not Found | Tarek Rahaman",
  description: "The page you are looking for does not exist on Tarek Rahaman's portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050811] text-white flex flex-col justify-between selection:bg-[#00d2ff] selection:text-[#050811]">
      <Navbar />
      <NotFoundContent />
      <Footer />
    </div>
  );
}

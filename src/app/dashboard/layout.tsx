import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import "react-loading-skeleton/dist/skeleton.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

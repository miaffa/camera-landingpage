import Link from "next/link";
import { appConfig } from "@/lib/config";

const FooterSection = () => {
  return (
    <section className="mx-auto w-full p-4 flex flex-col items-center">
      <div className="rounded-full border border-white/30 bg-white/20 px-6 py-4 shadow-lg backdrop-blur-md supports-backdrop-filter:bg-white/20 max-w-(--breakpoint-xl) w-full">
        <div className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-gray-900">
              {appConfig.projectName}
            </Link>
            <span className="text-gray-600">
              © {new Date().getFullYear()}
            </span>
          </div>

          <nav className="flex items-center gap-6 text-gray-600">
            <Link href="/about" className="hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;

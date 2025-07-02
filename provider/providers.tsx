"use client";
import { useThemeStore } from "@/store";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { Toaster as ReactToaster } from "@/components/ui/toaster";
import { Toaster } from "react-hot-toast";
import { SonnToaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
// Use a generic sans-serif font to avoid network font downloads during build
export const NotoSansThai = localFont({
  src: [
    {
      path: "../public/fonts/NotoSansThai/NotoSansThai-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NotoSansThai/NotoSansThai-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans-thai", // optional if using CSS variables
  display: "swap", // optional
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  const { theme, radius } = useThemeStore();
  const location = usePathname();

  if (location === "/") {
    return (
      <body className={cn("dash-tail-app ", NotoSansThai.className)}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
        >
          <div className={cn("h-full  ")}>
            {children}
            <ReactToaster />
          </div>
          <Toaster />
          <SonnToaster />
        </ThemeProvider>
      </body>
    );
  }
  return (
    <body
      className={cn("dash-tail-app ", NotoSansThai.className, "theme-" + theme)}
      style={{
        "--radius": `${radius}rem`,
      } as React.CSSProperties
      }
    >
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="light"
      >
        <div className={cn("h-full  ")}>
          {children}
          <ReactToaster />
        </div>
        <Toaster />
        <SonnToaster />
      </ThemeProvider>
    </body>
  );
};

export default Providers;

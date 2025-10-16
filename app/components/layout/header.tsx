import { MagnifyingGlassIcon, UserIcon } from "@phosphor-icons/react";
import { useThemeSettings } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { Suspense } from "react";
import {
  Await,
  useLocation,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import useWindowScroll from "react-use/esm/useWindowScroll";
import Link from "~/components/link";
import { Logo } from "~/components/logo";
import type { RootLoader } from "~/root";
import { cn } from "~/utils/cn";
import { DEFAULT_LOCALE } from "~/utils/const";
import { CartDrawer } from "./cart-drawer";
import { DesktopMenu } from "./desktop-menu";
import { MobileMenu } from "./mobile-menu";
import { PredictiveSearchButton } from "./predictive-search";

const variants = cva("", {
  variants: {
    width: {
      full: "h-full w-full",
      stretch: "h-full w-full",
      fixed: "mx-auto h-full w-full max-w-(--page-width)",
    },
    padding: {
      full: "",
      stretch: "px-4 md:px-10 lg:px-16",
      fixed: "mx-auto px-4 md:px-6 lg:px-8",
    },
  },
});

function useIsHomeCheck() {
  const { pathname } = useLocation();
  const rootData = useRouteLoaderData<RootLoader>("root");
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  return pathname.replace(selectedLocale.pathPrefix, "") === "/";
}

export function Header() {
  const { enableTransparentHeader, headerWidth } = useThemeSettings();
  const isHome = useIsHomeCheck();
  const { y } = useWindowScroll();
  const routeError = useRouteError();

  const scrolled = y >= 50;
  const enableTransparent = enableTransparentHeader && isHome && !routeError;
  const isTransparent = enableTransparent && !scrolled;

  return (
    <header
      className={cn(
        "z-30 w-full transition-all duration-300 ease-in-out border-b border-gray-200",
        "bg-white text-gray-800",
        "shadow-none hover:shadow-sm",
        "sticky top-0",
        variants({ padding: headerWidth }),
        scrolled && "shadow-md",
        enableTransparent && [
          "group/header fixed w-screen",
          "top-(--topbar-height,var(--initial-topbar-height))",
        ],
        isTransparent && [
          "bg-transparent border-transparent text-white",
          "hover:text-gray-100",
        ]
      )}
      style={{ height: "72px" }}
    >
      <div
        className={cn(
          "flex h-full items-center justify-between gap-2 lg:gap-8",
          variants({ width: headerWidth })
        )}
      >
        {/* 左侧菜单与移动端搜索 */}
        <div className="flex items-center gap-2">
          <MobileMenu />
          <Link
            to="/search"
            className="p-2 text-gray-700 hover:text-[#8B1C1C] transition-colors lg:hidden"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </Link>
        </div>

        {/* 中间 Logo */}
        <Logo />

        {/* 桌面菜单 */}
        <DesktopMenu />

        {/* 右侧功能按钮 */}
        <div className="flex items-center gap-3">
          <PredictiveSearchButton />
          <AccountLink className="relative flex h-8 w-8 items-center justify-center hover:text-[#8B1C1C]" />
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}

function AccountLink({ className }: { className?: string }) {
  const rootData = useRouteLoaderData<RootLoader>("root");
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Link to="/account" className={clsx("transition-none", className)}>
      <Suspense fallback={<UserIcon className="h-5 w-5" />}>
        <Await
          resolve={isLoggedIn}
          errorElement={<UserIcon className="h-5 w-5" />}
        >
          {(loggedIn) => <UserIcon className="h-5 w-5" />}
        </Await>
      </Suspense>
    </Link>
  );
}

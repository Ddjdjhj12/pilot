// Supports weights 400–700
import "@fontsource-variable/cabin";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { SeoConfig } from "@shopify/hydrogen";
import { Analytics, getSeoMeta, useNonce } from "@shopify/hydrogen";
import { Link } from "react-router-dom";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaArgs,
} from "@shopify/remix-oxygen";
import { useThemeSettings, withWeaverse } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";
import { ScrollingAnnouncement } from "./components/layout/scrolling-announcement";
import {
  NewsletterPopup,
  useShouldRenderNewsletterPopup,
} from "./components/newsletter-popup";
import { CustomAnalytics } from "./components/root/custom-analytics";
import { GenericError } from "./components/root/generic-error";
import { GlobalLoading } from "./components/root/global-loading";
import { NotFound } from "./components/root/not-found";
import styles from "./styles/app.css?url";
import { DEFAULT_LOCALE } from "./utils/const";
import { loadCriticalData, loadDeferredData } from "./utils/root.server";
import { GlobalStyle } from "./weaverse/style";

/* ✅ 替换为 Phosphor Icons */
import {
  House,
  SquaresFour,
  MagnifyingGlass,
  ShoppingCartSimple,
  User,
} from "@phosphor-icons/react";

export type RootLoader = typeof loader;

// ✅ favicon + 预连接优化
export const links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://cdn.shopify.com" },
    { rel: "preconnect", href: "https://shop.app" },
    { rel: "icon", type: "image/png", href: "/favicon1.png" },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {
    ...deferredData,
    ...criticalData,
  };
}

// ✅ 优化 SEO 默认标题与描述
export const meta = ({ data }: MetaArgs<typeof loader>) => {
  const baseMeta = getSeoMeta(data?.seo as SeoConfig) || [];

  const defaultTitle = "Entropy Bright – Tiffany Lamps & Vintage Lighting";
  const defaultDescription =
    "Discover handcrafted Tiffany lamps and vintage lighting by Entropy Bright. Artistic illumination for timeless interiors.";

  const processedMeta = baseMeta.map((item: any) => {
    if (item.title && item.title.includes("Weaverse")) {
      return { ...item, title: defaultTitle };
    }
    if (item.name === "description" && !item.content) {
      return { ...item, content: defaultDescription };
    }
    return item;
  });

  const hasTitle = processedMeta.some((m: any) => m.title);
  if (!hasTitle) {
    processedMeta.push({ title: defaultTitle });
  }

  return processedMeta;
};

function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  const routeError: { status?: number; data?: any } = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  let pageType = "page";
  if (isRouteError && routeError.status === 404) {
    pageType = routeError.data || pageType;
  }

  return isRouteError ? (
    routeError.status === 404 ? (
      <NotFound type={pageType} />
    ) : (
      <GenericError
        error={{ message: `${routeError.status} ${routeError.data}` }}
      />
    )
  ) : (
    <GenericError error={error instanceof Error ? error : undefined} />
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>("root");
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;
  const { topbarHeight, topbarText } = useThemeSettings();
  const shouldShowNewsletterPopup = useShouldRenderNewsletterPopup();

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={styles} />
        <link rel="icon" type="image/png" href="/favicon1.png" />
        <Meta />
        <Links />
        <GlobalStyle />

        {/* ✅ 全局样式 */}
        <style>{`
          body {
            font-family: "Cabin Variable", sans-serif;
            font-weight: 400;
            color: #1a1a1a;
            letter-spacing: 0.01em;
          }
          h1, h2, h3, h4, h5 {
            font-weight: 600;
          }
          header {
            background-color: #9E2B1E !important;
            height: 72px !important;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
          }
          header svg {
            color: white !important;
          }

          /* ✅ 移动端底部导航栏 */
          .mobile-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e5e5e5;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 6px 0;
            z-index: 50;
          }
          .mobile-nav a {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            color: #333;
          }
          .mobile-nav svg {
            width: 22px;
            height: 22px;
          }
        `}</style>
      </head>

      <body
        style={
          {
            opacity: 0,
            "--initial-topbar-height": `${topbarText ? topbarHeight : 0}px`,
          } as CSSProperties
        }
        className="bg-background text-body antialiased opacity-100! transition-opacity duration-300 pb-16 lg:pb-0"
      >
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <TooltipProvider disableHoverableContent>
              <div
                className="flex min-h-screen flex-col"
                key={`${locale.language}-${locale.country}`}
              >
                <ScrollingAnnouncement />
                <Header />
                <main id="mainContent" className="grow">
                  {children}
                </main>
                <Footer />
              </div>
              {shouldShowNewsletterPopup && <NewsletterPopup />}

              {/* ✅ 移动底部导航 */}
              <nav className="mobile-nav lg:hidden">
                <Link to="/">
                  <House size={22} weight="duotone" />
                  <span>Home</span>
                </Link>
                <Link to="/collections">
                  <SquaresFour size={22} weight="duotone" />
                  <span>Menu</span>
                </Link>
                <Link to="/search">
                  <MagnifyingGlass size={22} weight="duotone" />
                  <span>Search</span>
                </Link>
                <Link to="/cart">
                  <ShoppingCartSimple size={22} weight="duotone" />
                  <span>Cart</span>
                </Link>
                <Link to="/account">
                  <User size={22} weight="duotone" />
                  <span>Account</span>
                </Link>
              </nav>
            </TooltipProvider>
            <CustomAnalytics />
          </Analytics.Provider>
        ) : (
          children
        )}

        <GlobalLoading />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />

        {/* ✅ Judge.me 评论系统 */}
        <script
          async
          id="judgeme_shopify_script"
          type="text/javascript"
          src="https://cdn.judge.me/shopify_v2.js"
        ></script>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              window.jdgm = window.jdgm || {};
              window.jdgm.SHOP_DOMAIN = "cf30b9-d4.myshopify.com";
              window.jdgm.PLATFORM = "hydrogen";
              window.jdgm.PUBLIC_TOKEN = "7KoNZxek3nZ982H_Cv-YjduopSE";
              console.log("✅ Judge.me initialized for:", window.jdgm.SHOP_DOMAIN);
            `,
          }}
        />
      </body>
    </html>
  );
}

export default withWeaverse(App);



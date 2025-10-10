// Supports weights 400-700 
import "@fontsource-variable/cabin";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { SeoConfig } from "@shopify/hydrogen";
import { Analytics, getSeoMeta, useNonce } from "@shopify/hydrogen";
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

export type RootLoader = typeof loader;

// ✅ 新增 favicon 引用（改用 PNG 图标）
export const links: LinksFunction = () => {
  return [
    {
      rel: "preconnect",
      href: "https://cdn.shopify.com",
    },
    {
      rel: "preconnect",
      href: "https://shop.app",
    },
    { rel: "icon", type: "image/png", href: "/favicon1.png" }, // ← 修改为 PNG
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

// ✅ 优化 SEO 标题与描述（可中英文切换）
export const meta = ({ data }: MetaArgs<typeof loader>) => {
  // 调用 Hydrogen 默认 SEO
  const baseMeta = getSeoMeta(data?.seo as SeoConfig) || [];

  // 定义品牌默认标题与描述
  const defaultTitle = "Entropy Bright – Tiffany Lamps & Vintage Lighting";
  const defaultDescription =
    "Discover handcrafted Tiffany lamps and vintage lighting by Entropy Bright. Artistic illumination for timeless interiors.";

  // 处理默认 SEO 值
  const processedMeta = baseMeta.map((item: any) => {
    if (item.title && item.title.includes("Weaverse")) {
      return { ...item, title: defaultTitle };
    }
    if (item.name === "description" && !item.content) {
      return { ...item, content: defaultDescription };
    }
    return item;
  });

  // 如果没有标题则添加一个默认的
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

        {/* ✅ 新增 favicon 链接 */}
        <link rel="icon" type="image/png" href="/favicon1.png" />

        {/* ✅ 自动 SEO meta */}
        <Meta />
        <Links />
        <GlobalStyle />
      </head>
      <body
        style={
          {
            opacity: 0,
            "--initial-topbar-height": `${topbarText ? topbarHeight : 0}px`,
          } as CSSProperties
        }
        className="bg-background text-body antialiased opacity-100! transition-opacity duration-300"
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
                <div className="">
                  <a href="#mainContent" className="sr-only">
                    Skip to content
                  </a>
                </div>
                <ScrollingAnnouncement />
                <Header />
                <main id="mainContent" className="grow">
                  {children}
                </main>
                <Footer />
              </div>
              {shouldShowNewsletterPopup && <NewsletterPopup />}
            </TooltipProvider>
            <CustomAnalytics />
          </Analytics.Provider>
        ) : (
          children
        )}
        <GlobalLoading />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default withWeaverse(App);

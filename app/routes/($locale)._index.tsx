import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import type { PageType } from "@weaverse/hydrogen";
import type { ShopQuery } from "storefront-api.generated";
import { routeHeaders } from "~/utils/cache";
import { seoPayload } from "~/utils/seo.server";
import { validateWeaverseData, WeaverseContent } from "~/weaverse";
import { AnalyticsPageType } from "@shopify/hydrogen"; // 确保定义 pageType

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const { params, context } = args;
  const { pathPrefix } = context.storefront.i18n;
  const locale = pathPrefix.slice(1);
  let type: PageType = "INDEX";

  if (params.locale && params.locale.toLowerCase() !== locale) {
    // Update for Weaverse: if it not locale, it probably is a custom page handle
    type = "CUSTOM";
  }

  // Calculate SEO payload synchronously
  const seo = seoPayload.home();

  // Load async data in parallel for better performance
  const [weaverseData, { shop }] = await Promise.all([
    context.weaverse.loadPage({ type }),
    context.storefront.query<ShopQuery>(SHOP_QUERY),
  ]);

  // Check weaverseData after parallel loading
  validateWeaverseData(weaverseData);

  return {
    shop,
    weaverseData,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  };
}

// ✅ 移到这里，且只导入一次（避免重复）
import type { MetaArgs } from "@shopify/remix-oxygen";
import { getSeoMeta } from "@shopify/hydrogen";
import type { SeoConfig } from "@shopify/hydrogen";

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

export default function Homepage() {
  return <WeaverseContent />;
}

const SHOP_QUERY = `#graphql
  query shop($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    shop {
      name
      description
    }
  }
` as const;

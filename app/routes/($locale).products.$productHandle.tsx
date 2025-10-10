import {
  Analytics,
  getAdjacentAndFirstAvailableVariants,
  getSeoMeta,
  useOptimisticVariant,
} from "@shopify/hydrogen";
import type { LoaderFunctionArgs, MetaArgs } from "@shopify/remix-oxygen";
import { getSelectedProductOptions } from "@weaverse/hydrogen";
import { useEffect } from "react";
import { useLoaderData } from "react-router";
import type { ProductQuery } from "storefront-api.generated";
import invariant from "tiny-invariant";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { routeHeaders } from "~/utils/cache";
import {
  COMBINED_LISTINGS_CONFIGS,
  isCombinedListing,
} from "~/utils/combined-listings";
import { getRecommendedProducts } from "~/utils/product";
import {
  redirectIfCombinedListing,
  redirectIfHandleIsLocalized,
} from "~/utils/redirect";
import { seoPayload } from "~/utils/seo.server";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

// ✅ Loader：加载商品详情 + 推荐商品 + Weaverse 数据
export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { productHandle: handle } = params;
  invariant(handle, "Missing productHandle param, check route filename");

  const { storefront, weaverse } = context;
  const selectedOptions = getSelectedProductOptions(request);

  const [{ shop, product }, weaverseData] = await Promise.all([
    storefront.query<ProductQuery>(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    }),
    weaverse.loadPage({ type: "PRODUCT", handle }),
  ]);

  if (!product?.id) {
    throw new Response("product", { status: 404 });
  }

  redirectIfHandleIsLocalized(request, { handle, data: product });

  if (COMBINED_LISTINGS_CONFIGS.redirectToFirstVariant) {
    redirectIfCombinedListing(request, product);
  }

  const recommended = getRecommendedProducts(storefront, product.id);

  return {
    shop,
    product,
    weaverseData,
    storeDomain: shop.primaryDomain.url,
    seo: seoPayload.product({ product, url: request.url }),
    recommended,
    selectedOptions,
  };
}

// ✅ SEO Meta 继承 Hydrogen 默认逻辑
export const meta = ({ matches }: MetaArgs<typeof loader>) => {
  return getSeoMeta(
    ...matches.map((match) => (match.data as any)?.seo).filter(Boolean),
  );
};

// ✅ 主组件
export default function Product() {
  const { product } = useLoaderData<typeof loader>();
  const combinedListing = isCombinedListing(product);

  // ✅ 自动选中第一个可售变体
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // ✅ 同步 URL 参数与选中变体
  useEffect(() => {
    if (!selectedVariant?.selectedOptions || combinedListing) return;

    const currentParams = new URLSearchParams(window.location.search);
    let needsUpdate = false;

    if (window.location.search === "") {
      needsUpdate = true;
    } else {
      for (const option of selectedVariant.selectedOptions) {
        const currentValue = currentParams.get(option.name);
        if (currentValue !== option.value) {
          needsUpdate = true;
          break;
        }
      }
    }

    if (needsUpdate) {
      const updatedParams = new URLSearchParams(currentParams);
      for (const option of selectedVariant.selectedOptions) {
        updatedParams.set(option.name, option.value);
      }

      const newSearch = updatedParams.toString();
      if (newSearch !== window.location.search.slice(1)) {
        window.history.replaceState({}, "", `${location.pathname}?${newSearch}`);
      }
    }
  }, [selectedVariant?.selectedOptions, combinedListing]);

  return (
    <>
      {/* ✅ Weaverse 可视化内容（主要商品详情） */}
      <WeaverseContent />

      {/* ✅ 评论区插入位置 —— 会被 Judge.me 脚本自动识别 */}
      <div id="judgeme_product_reviews" className="mt-8 mb-12"></div>

      {/* ✅ Hydrogen 原生商品浏览埋点 */}
      {selectedVariant && (
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || "0",
                vendor: product.vendor,
                variantId: selectedVariant?.id || "",
                variantTitle: selectedVariant?.title || "",
                quantity: 1,
              },
            ],
          }}
        />
      )}
    </>
  );
}

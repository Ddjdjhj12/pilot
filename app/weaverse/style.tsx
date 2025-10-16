import { useThemeSettings } from "@weaverse/hydrogen";

export function GlobalStyle() {
  const settings = useThemeSettings();
  if (!settings) return null;

  const {
    colorBackground,
    colorText,
    colorTextSubtle,
    colorTextInverse,
    colorLine,
    colorLineSubtle,
    topbarTextColor,
    topbarBgColor,
    headerBgColor,
    headerText,
    transparentHeaderText,
    footerBgColor,
    footerText,
    buttonPrimaryBg,
    buttonPrimaryColor,
    buttonSecondaryBg,
    buttonSecondaryColor,
    buttonOutlineTextAndBorder,
    comparePriceTextColor,
    discountBadge,
    newBadge,
    bestSellerBadge,
    bundleBadgeColor,
    soldOutBadgeColor,
    productReviewsColor,
    bodyBaseSize,
    bodyBaseSpacing,
    bodyBaseLineHeight,
    h1BaseSize,
    headingBaseSpacing,
    headingBaseLineHeight,
    navHeightDesktop,
    navHeightTablet,
    pageWidth,
  } = settings;

  // 给导航高度提供一个稳妥的默认值（移动端 4.5rem）
  const navMobile = (settings as any).navHeightMobile ?? 4.5;

  return (
    <style
      key="global-theme-style"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          :root {
            /* Layout */
            --height-nav: ${navMobile}rem;
            --page-width: ${pageWidth}px;

            /* Colors (general) */
            --color-background: ${colorBackground};
            --color-text: ${colorText};
            --color-text-subtle: ${colorTextSubtle};
            --color-text-inverse: ${colorTextInverse};
            --color-line: ${colorLine};
            --color-line-subtle: ${colorLineSubtle};

            /* Colors (header & footer) */
            --color-topbar-text: ${topbarTextColor};
            --color-topbar-bg: ${topbarBgColor};
            --color-header-bg: ${headerBgColor};
            --color-header-text: ${headerText};
            --color-transparent-header-text: ${transparentHeaderText};
            --color-footer-bg: ${footerBgColor};
            --color-footer-text: ${footerText};

            /* Colors (buttons & links) */
            --btn-primary-bg: ${buttonPrimaryBg};
            --btn-primary-text: ${buttonPrimaryColor};
            --btn-secondary-bg: ${buttonSecondaryBg};
            --btn-secondary-text: ${buttonSecondaryColor};
            --btn-outline-text: ${buttonOutlineTextAndBorder};

            /* Colors (product) */
            --color-compare-price-text: ${comparePriceTextColor};
            --color-discount: ${discountBadge};
            --color-new-badge: ${newBadge};
            --color-best-seller: ${bestSellerBadge};
            --color-bundle-badge: ${bundleBadgeColor};
            --color-sold-out-and-unavailable: ${soldOutBadgeColor};
            --color-product-reviews: ${productReviewsColor};

            /* Typography base */
            --body-base-size: ${bodyBaseSize}px;
            --body-base-spacing: ${bodyBaseSpacing};
            --body-base-line-height: ${bodyBaseLineHeight};

            --heading-scale-ratio: 1.2;
            --heading-mobile-scale-ratio: 1.1;

            --h1-base-size: ${h1BaseSize}px;
            --h2-base-size: round(calc(var(--h1-base-size) / var(--heading-scale-ratio)), 1px);
            --h3-base-size: round(calc(var(--h2-base-size) / var(--heading-scale-ratio)), 1px);
            --h4-base-size: round(calc(var(--h3-base-size) / var(--heading-scale-ratio)), 1px);
            --h5-base-size: round(calc(var(--h4-base-size) / var(--heading-scale-ratio)), 1px);
            --h6-base-size: round(calc(var(--h5-base-size) / var(--heading-scale-ratio)), 1px);

            --h1-mobile-size: round(calc(var(--h1-base-size) / var(--heading-mobile-scale-ratio)), 1px);
            --h2-mobile-size: round(calc(var(--h2-base-size) / var(--heading-mobile-scale-ratio)), 1px);
            --h3-mobile-size: round(calc(var(--h3-base-size) / var(--heading-mobile-scale-ratio)), 1px);
            --h4-mobile-size: round(calc(var(--h4-base-size) / var(--heading-mobile-scale-ratio)), 1px);
            --h5-mobile-size: round(calc(var(--h5-base-size) / var(--heading-mobile-scale-ratio)), 1px);
            --h6-mobile-size: round(calc(var(--h6-base-size) / var(--heading-mobile-scale-ratio)), 1px);

            --heading-base-spacing: ${headingBaseSpacing};
            --heading-base-line-height: ${headingBaseLineHeight};
          }

          /* 全局字体：Cabin Variable（root.tsx 已经 import 了 @fontsource-variable/cabin）*/
          body {
            font-family: "Cabin Variable", system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-size: var(--body-base-size);
            line-height: var(--body-base-line-height);
            letter-spacing: 0.01em; /* 轻微增加可读性 */
            background-color: var(--color-background);
            color: var(--color-text);
          }

          h1, h2, h3, h4, h5, h6 {
            line-height: var(--heading-base-line-height);
            letter-spacing: 0.005em;
          }

          /* 适配平板、桌面端导航高度（保留你主题设置） */
          @media (min-width: 32em) {
            body { --height-nav: ${navHeightTablet}rem; }
          }
          @media (min-width: 48em) {
            body { --height-nav: ${navHeightDesktop}rem; }
          }
        `,
      }}
    />
  );
}

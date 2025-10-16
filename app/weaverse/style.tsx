import { useThemeSettings } from "@weaverse/hydrogen";

export function GlobalStyle() {
  const settings = useThemeSettings();
  if (settings) {
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
      navHeightMobile,
      pageWidth,
    } = settings;

    return (
      <style
        key="global-theme-style"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              /* Layout */
              --height-nav: ${navHeightMobile || 4.5}rem;
              --page-width: ${pageWidth}px;

              /* Global Font */
              --font-family-base: 'Cabin Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI',
                                  Roboto, Helvetica, Arial, sans-serif;
              --font-weight-regular: 400;
              --font-weight-semibold: 600;
              --font-letter-spacing: 0.02em;
              --font-line-height: 1.6;

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
              --color-header-bg: ${headerBgColor || "#ffffff"};
              --color-header-text: ${headerText || "#2a2a2a"};
              --color-transparent-header-text: ${transparentHeaderText || "#ffffff"};
              --color-footer-bg: ${footerBgColor || "#8B1C1C"};
              --color-footer-text: ${footerText || "#ffffff"};

              /* Colors (buttons & links) */
              --btn-primary-bg: ${buttonPrimaryBg || "#8B1C1C"};
              --btn-primary-text: ${buttonPrimaryColor || "#ffffff"};
              --btn-secondary-bg: ${buttonSecondaryBg || "#f3f3f3"};
              --btn-secondary-text: ${buttonSecondaryColor || "#2a2a2a"};
              --btn-outline-text: ${buttonOutlineTextAndBorder || "#8B1C1C"};

              /* Colors (product) */
              --color-compare-price-text: ${comparePriceTextColor};
              --color-discount: ${discountBadge};
              --color-new-badge: ${newBadge};
              --color-best-seller: ${bestSellerBadge};
              --color-bundle-badge: ${bundleBadgeColor};
              --color-sold-out-and-unavailable: ${soldOutBadgeColor};
              --color-product-reviews: ${productReviewsColor};

              /* Typography */
              --body-base-size: ${bodyBaseSize}px;
              --body-base-spacing: ${bodyBaseSpacing};
              --body-base-line-height: ${bodyBaseLineHeight};
              --heading-base-spacing: ${headingBaseSpacing};
              --heading-base-line-height: ${headingBaseLineHeight};

              /* Heading scale */
              --heading-scale-ratio: 1.2;
              --heading-mobile-scale-ratio: 1.1;

              --h1-base-size: ${h1BaseSize}px;
              --h2-base-size: calc(var(--h1-base-size) / var(--heading-scale-ratio));
              --h3-base-size: calc(var(--h2-base-size) / var(--heading-scale-ratio));
              --h4-base-size: calc(var(--h3-base-size) / var(--heading-scale-ratio));
              --h5-base-size: calc(var(--h4-base-size) / var(--heading-scale-ratio));
              --h6-base-size: calc(var(--h5-base-size) / var(--heading-scale-ratio));

              /* Red theme accent (Entropy Bright brand) */
              --brand-accent: #8B1C1C;
            }

            /* Base typography styling */
            body {
              font-family: var(--font-family-base);
              font-weight: var(--font-weight-regular);
              line-height: var(--font-line-height);
              letter-spacing: var(--font-letter-spacing);
              color: var(--color-text);
              background-color: var(--color-background);
            }

            h1, h2, h3, h4, h5, h6 {
              font-weight: var(--font-weight-semibold);
              letter-spacing: 0.01em;
            }

            a {
              color: var(--brand-accent);
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }

            /* Responsive Navigation Heights */
            @media (min-width: 32em) {
              body {
                --height-nav: ${navHeightTablet || 4.5}rem;
              }
            }
            @media (min-width: 48em) {
              body {
                --height-nav: ${navHeightDesktop || 4.5}rem;
              }
            }
          `,
        }}
      />
    );
  }
  return null;
}

// ✅ app/components/layout/footer.tsx
import {
  CaretRightIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import * as Accordion from "@radix-ui/react-accordion";
import { Image } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useFetcher } from "react-router";
import { Button } from "~/components/button";
import { RevealUnderline } from "~/components/reveal-underline";
import { useShopMenu } from "~/hooks/use-shop-menu";
import type { SingleMenuItem } from "~/types/menu";
import { cn } from "~/utils/cn";
import Link from "../link";
import { CountrySelector } from "./country-selector";
import React from "react";

const variants = cva("", {
  variants: {
    width: {
      full: "",
      stretch: "",
      fixed: "mx-auto max-w-(--page-width)",
    },
    padding: {
      full: "",
      stretch: "px-3 md:px-10 lg:px-16",
      fixed: "mx-auto px-3 md:px-4 lg:px-6",
    },
  },
});

export function Footer() {
  const { shopName } = useShopMenu();
  const {
    footerWidth,
    socialFacebook,
    socialInstagram,
    socialLinkedIn,
    socialX,
    footerLogoData,
    footerLogoWidth,
    bio,
    copyright,
    addressTitle,
    storeAddress,
    storeEmail,
    newsletterTitle,
    newsletterDescription,
    newsletterPlaceholder,
    newsletterButtonText,
  } = useThemeSettings();
  const fetcher = useFetcher<{ ok: boolean; error: string }>();

  // ✅ 处理订阅消息
  const message = fetcher.data?.ok ? "Thank you for signing up! 🎉" : "";
  const error =
    fetcher.data && !fetcher.data.ok
      ? fetcher.data.error || "An error occurred while signing up."
      : "";

  const SOCIAL_ACCOUNTS = [
    {
      name: "Instagram",
      to: socialInstagram,
      Icon: InstagramLogoIcon,
    },
    {
      name: "X",
      to: socialX,
      Icon: XLogoIcon,
    },
    {
      name: "LinkedIn",
      to: socialLinkedIn,
      Icon: LinkedinLogoIcon,
    },
    {
      name: "Facebook",
      to: socialFacebook,
      Icon: FacebookLogoIcon,
    },
  ].filter((acc) => acc.to && acc.to.trim() !== "");

  return (
    <footer
      className={cn(
        "w-full bg-(--color-footer-bg) pt-9 text-(--color-footer-text) lg:pt-16",
        variants({ padding: footerWidth }),
      )}
    >
      <div
        className={cn(
          "h-full w-full space-y-9 divide-y divide-line-subtle",
          variants({ width: footerWidth }),
        )}
      >
        {/* ✅ 顶部三列内容 */}
        <div className="space-y-9">
          <div className="grid w-full gap-8 lg:grid-cols-3">
            {/* 左列：Logo + 简介 + 社交链接 */}
            <div className="flex flex-col gap-6">
              {footerLogoData ? (
                <div className="relative" style={{ width: footerLogoWidth }}>
                  <Image
                    data={footerLogoData}
                    sizes="auto"
                    width={500}
                    className="h-full w-full object-contain object-left"
                  />
                </div>
              ) : (
                <div className="font-medium text-base uppercase">
                  {shopName}
                </div>
              )}
              {bio ? <div dangerouslySetInnerHTML={{ __html: bio }} /> : null}
              <div className="flex gap-4">
                {SOCIAL_ACCOUNTS.map(({ to, name, Icon }) => (
                  <Link
                    key={name}
                    to={to}
                    target="_blank"
                    className="flex items-center gap-2 text-lg"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* 中列：地址 */}
            <div className="flex flex-col gap-6">
              <div className="text-base">{addressTitle}</div>
              <div className="space-y-2">
                <p>{storeAddress}</p>
                <p>Email: {storeEmail}</p>
              </div>
            </div>

            {/* 右列：订阅表单 */}
            <div className="flex flex-col gap-6">
              <div className="text-base">{newsletterTitle}</div>
              <div className="space-y-2">
                <p>{newsletterDescription}</p>
                <fetcher.Form
                  action="/api/klaviyo"
                  method="POST"
                  encType="multipart/form-data"
                >
                  <div className="flex">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder={newsletterPlaceholder}
                      className="grow border border-gray-100 px-3 focus-visible:outline-hidden"
                    />
                    <Button
                      variant="custom"
                      type="submit"
                      loading={fetcher.state === "submitting"}
                    >
                      {newsletterButtonText}
                    </Button>
                  </div>
                </fetcher.Form>
                <div className="h-8">
                  {error && (
                    <div className="mb-6 flex w-fit gap-1 bg-red-100 px-2 py-1 text-red-700">
                      <p className="font-semibold">ERROR:</p>
                      <p>{error}</p>
                    </div>
                  )}
                  {message && (
                    <div className="mb-6 w-fit py-1 text-green-500">
                      {message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ 底部菜单 */}
          <FooterMenu />
        </div>

        {/* ✅ 版权 & 货币选择器 */}
        <div className="flex flex-col items-center justify-between gap-4 py-9 lg:flex-row">
          <div className="flex gap-2">
            <CurrencySelectorEnhanced />
          </div>
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}

/* ✅ 加强版 CurrencySelector：支持 fallback 多币种 */
function CurrencySelectorEnhanced() {
  // 原始选择器
  const ShopifyCountrySelector = CountrySelector;

  // 手动追加 fallback 币种
  const fallbackCurrencies = [
    { isoCode: "USD", symbol: "$", name: "United States (USD $)" },
    { isoCode: "EUR", symbol: "€", name: "Germany (EUR €)" },
    { isoCode: "CNY", symbol: "¥", name: "China (CNY ¥)" },
    { isoCode: "AUD", symbol: "$", name: "Australia (AUD $)" },
    { isoCode: "CAD", symbol: "$", name: "Canada (CAD $)" },
    { isoCode: "GBP", symbol: "£", name: "United Kingdom (GBP £)" },
  ];

  // ✅ 显示 Shopify 原生 + fallback
  return (
    <div className="relative flex flex-col items-center text-sm">
      <ShopifyCountrySelector />
      <select
        className="mt-2 w-full border border-gray-200 bg-white px-3 py-2 text-black shadow-sm focus:border-gray-400 focus:outline-none lg:hidden"
        onChange={(e) =>
          alert(`Currency switched to ${e.target.value} (for demo)`)
        }
      >
        {fallbackCurrencies.map((c) => (
          <option key={c.isoCode} value={c.isoCode}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ✅ Footer 菜单部分（原封不动） */
function FooterMenu() {
  const { footerMenu } = useShopMenu();
  const items = footerMenu.items as unknown as SingleMenuItem[];
  return (
    <Accordion.Root
      type="multiple"
      defaultValue={items.map(({ id }) => id)}
      className="grid w-full lg:grid-cols-3 lg:gap-8"
    >
      {items.map(({ id, to, title, items: childItems }) => (
        <Accordion.Item key={id} value={id} className="flex flex-col">
          <Accordion.Trigger className="flex items-center justify-between py-4 text-left font-medium lg:hidden data-[state=open]:[&>svg]:rotate-90">
            {["#", "/"].includes(to) ? (
              <span>{title}</span>
            ) : (
              <Link to={to}>{title}</Link>
            )}
            <CaretRightIcon className="h-4 w-4 rotate-0 transition-transform" />
          </Accordion.Trigger>
          <div className="hidden font-medium text-lg lg:block">
            {["#", "/"].includes(to) ? title : <Link to={to}>{title}</Link>}
          </div>
          <Accordion.Content
            style={
              {
                "--expand-duration": "0.15s",
                "--expand-to": "var(--radix-accordion-content-height)",
                "--collapse-duration": "0.15s",
                "--collapse-from": "var(--radix-accordion-content-height)",
              } as React.CSSProperties
            }
            className={clsx([
              "overflow-hidden",
              "data-[state=closed]:animate-collapse",
              "data-[state=open]:animate-expand",
            ])}
          >
            <div className="flex flex-col gap-2 pb-4 lg:pt-6">
              {childItems.map((child) => (
                <Link
                  to={child.to}
                  key={child.id}
                  className="relative items-center gap-2 group"
                >
                  <RevealUnderline className="[--underline-color:var(--color-footer-text)]">
                    {child.title}
                  </RevealUnderline>
                  {child.isExternal && (
                    <span className="invisible group-hover:visible text-sm">
                      ↗
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

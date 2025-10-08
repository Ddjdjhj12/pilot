import { CaretRightIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "~/components/link";
import { ScrollArea } from "~/components/scroll-area";
import { useShopMenu } from "~/hooks/use-shop-menu";
import type { SingleMenuItem } from "~/types/menu";
import { cn } from "~/utils/cn";

export function MobileMenu() {
  const { headerMenu } = useShopMenu();

  if (!headerMenu) {
    return <MenuTrigger />;
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        asChild
        className="relative flex h-8 w-8 items-center justify-center focus-visible:outline-hidden lg:hidden"
      >
        <MenuTrigger />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-10 bg-black/50 data-[state=open]:animate-fade-in"
          style={{ "--fade-in-duration": "100ms" } as React.CSSProperties}
        />
        <Dialog.Content
          className={cn([
            "fixed inset-0 z-10 h-screen-no-topbar bg-(--color-header-bg) pt-4 pb-2",
            "-translate-x-full left-0 data-[state=open]:translate-x-0 data-[state=open]:animate-enter-from-left",
            "focus-visible:outline-hidden",
            "uppercase",
          ])}
          style={
            { "--enter-from-left-duration": "200ms" } as React.CSSProperties
          }
          aria-describedby={undefined}
        >
          <Dialog.Title asChild>
            <div className="px-6 text-xl font-semibold tracking-wide">
              MENU
            </div>
          </Dialog.Title>
          <Dialog.Close asChild>
            <XIcon className="fixed top-4 right-4 h-5 w-5" />
          </Dialog.Close>
          <div className="mt-4 border-t border-line-subtle" />
          <div className="py-2">
            <ScrollArea className="h-[calc(100vh-5rem)]">
              {/* 调整这里的布局 */}
              <div className="flex flex-col gap-3 px-6 py-4 text-base font-medium tracking-wide">
                {headerMenu.items.map((item) => (
                  <CollapsibleMenuItem
                    key={item.id}
                    item={item as unknown as SingleMenuItem}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CollapsibleMenuItem({ item }: { item: SingleMenuItem }) {
  const { title, to, items } = item;

  if (!items?.length) {
    return (
      <Dialog.Close asChild>
        <Link
          to={to}
          className="block w-full py-3 border-b border-gray-200 hover:text-gray-700 transition-colors"
        >
          {title}
        </Link>
      </Dialog.Close>
    );
  }

  return (
    <Collapsible.Root>
      <Collapsible.Trigger asChild>
        <button
          type="button"
          className='flex w-full items-center justify-between gap-4 py-3 font-semibold uppercase data-[state="open"]:[&>svg]:rotate-90'
        >
          <span>{title}</span>
          <CaretRightIcon className="h-4 w-4 transition-transform" />
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="ml-4 border-l border-gray-300 pl-4 text-sm font-normal space-y-2">
        {items.map((childItem) => (
          <CollapsibleMenuItem key={childItem.id} item={childItem} />
        ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function MenuTrigger(
  props: Dialog.DialogTriggerProps & { ref?: React.Ref<HTMLButtonElement> },
) {
  const { ref, ...rest } = props;
  return (
    <button ref={ref} type="button" {...rest}>
      <ListIcon className="h-5 w-5" />
    </button>
  );
}

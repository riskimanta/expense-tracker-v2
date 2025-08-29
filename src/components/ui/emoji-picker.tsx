"use client";

import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Portal } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Emoji } from "./Emoji";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

// Emoji data - common emojis
const EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
  "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
  "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
  "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
  "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😯", "😦", "😧",
  "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢",
  "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "💩", "👻", "💀",
  "☠️", "👽", "👾", "🤖", "🎃", "👺", "👹", "👿", "😈", "🤡",
  "💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💬", "🗨️", "🗯️",
  "💭", "💤", "💋", "💌", "💘", "💝", "💖", "💗", "💓", "💞",
  "💕", "💟", "❣️", "💔", "❤️", "🧡", "💛", "💚", "💙", "💜",
  "🖤", "🤍", "🤎", "💯", "💢", "💥", "💫", "💦", "💨", "🕳️",
  "🎉", "🎊", "🎈", "🎂", "🎁", "🎀", "🎗️", "🎟️", "🎫", "🎠",
  "🎡", "🎢", "🎪", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹",
  "🥁", "🎷", "🎺", "🎸", "🪕", "🎻", "🎲", "♟️", "🎯", "🎳",
  "🎮", "🎰", "🧩", "🎨", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️",
  "🖱️", "🖲️", "🕹️", "🎮", "🎲", "♟️", "🎯", "🎳", "🎮", "🎰"
];

export function EmojiPicker({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search) return EMOJIS;
    return EMOJIS.filter((e) => e.includes(search));
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 text-left text-sm",
            "border border-border rounded-lg bg-background",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
          aria-label="Pilih emoji"
        >
          {value ? (
            <Emoji char={value} size={24} />
          ) : (
            <Emoji char="🙂" size={24} />
          )}
          <span className="text-sm text-[color:var(--txt-3)]">Pilih emoji…</span>
        </button>
      </PopoverTrigger>

      <Portal>
        <PopoverContent
          className="w-[360px] p-0 z-[9999]"
          align="start"
          side="top"
        >
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari emoji..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="max-h-[260px] overflow-auto p-3">
            <div className="grid grid-cols-10 gap-1">
              {filtered.map((e, i) => (
                <button
                  key={`${e}-${i}`}
                  type="button"
                  onClick={() => {
                    onChange(e);
                    setOpen(false);
                  }}
                  className={cn(
                    "h-8 w-8 grid place-items-center rounded-md",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                    "transition-colors duration-200"
                  )}
                  aria-label={`Emoji ${e}`}
                >
                  <Emoji char={e} size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[color:var(--border)] bg-[color:var(--surface-2)]/30">
            <p className="text-xs text-[color:var(--txt-2)] text-center">
              Pilih emoji yang sesuai dengan kategori
            </p>
          </div>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

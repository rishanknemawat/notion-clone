"use client";

import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface ItemProps {
    id?: Id<"documents">;
    label: string;
    documentIcon?: string;
    icon: LucideIcon;
    isSearch?: boolean;
    active?: boolean;
    expanded?: boolean;
    level?: number;
    onExpand?: () => void;
    onClick: () => void;
}

export const Item = ({
    label,
    icon: Icon,
    onClick,
    id,
    documentIcon,
    active,
    expanded,
    onExpand,
    level = 0,
    isSearch,
}: ItemProps) => {
    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    return (
        <div 
            role="button"
            onClick={onClick}
            style={{ paddingLeft: `${(level * 12) + 12}px` }}
            className={cn(
                "group min-h-[27] flex text-muted-foreground text-sm py-1 pr-3 w-full hover:bg-primary/5 items-center font-medium",
                active && "bg-primary/5 text-primary"
            )}
        >
            {!!id && (
                <div
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
                    onClick={() => {}}
                >
                    <ChevronIcon className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {documentIcon}
                </div>
            ) : (
                <Icon 
                    className="shrink-0 text-muted-foreground h-[18px] mr-2" 
                />
            )
            }
            <span className="truncate">{label}</span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex 
                h-5 select-none gap-1 items-center rounded border bg-muted px-1.5 
                font-mono font-medium text-[10px] text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            )}
        </div>
    );
};

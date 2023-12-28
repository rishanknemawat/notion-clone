"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

import { useMutation } from "convex/react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
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
    onClick?: () => void;
}

export const Item = ({
    id,
    label,
    icon: Icon,
    documentIcon,
    active,
    expanded,
    onClick,
    onExpand,
    level = 0,
    isSearch,
}: ItemProps) => {
    const { user } = useUser();
    const router = useRouter();
    const create = useMutation(api.documents.create);
    const archieve = useMutation(api.documents.archieve);

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        onExpand?.();
    }

    const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (!id) return;
        const promise = create({ title: "Untitled", parentDocument: id })
            .then((documentId) => {
                if (!expanded) {
                    onExpand?.();
                }
                router.push(`/documents/${documentId}`);
            })
        
        toast.promise(promise, {
            loading: "Creating new note...",
            success: "New note successfully created",
            error: "Failed to create new note",
        })
    }

    const onArchieve = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        if (!id) return;

        const promise = archieve({ id })
                .then(() => router.push('/documents'));
        
        toast.promise(promise, {
            loading: "Moving to Trash...",
            success: "Note successfully deleted.",
            error: "Failed to delete the note",
        })
    }

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
                    className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
                    onClick={handleExpand}
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
                    className="shrink-0 text-muted-foreground h-[18px] w-[18px] mr-2" 
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
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger 
                            asChild 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div 
                                role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto
                                rounded-sm hover:bg-neutral-300 dark:bg-neutral-600"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onArchieve} >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div
                                className="text-xs p-2 text-muted-foreground"
                            >
                                Last Edited by: {user?.fullName || user?.username}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                        role="button"
                        onClick={onCreate}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto
                        rounded-sm hover:bg-neutral-300 dark:bg-neutral-600"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            )}
        </div>
    );
};

Item.Skeleton = function ItemSkeleton({ level }: {
    level?: number;
}) {
    return (
        <div
            style={{
                paddingLeft: level ? `${level * 12 + 25}px` : "12px"
            }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    )
};
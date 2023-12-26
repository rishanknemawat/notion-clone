"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash } from "lucide-react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuProps {
    documentId: Id<"documents">;
}

export const Menu = ({
    documentId
}: MenuProps) => {
    const router = useRouter();
    const { user } = useUser();
    const archieve = useMutation(api.documents.archieve);

    const onArchieve = () => {
        const promise = archieve({ id: documentId });
        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note successfully moved to trash.",
            error: "Failed to delete the note."
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size={"sm"} variant={"ghost"}>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-60"
                align="end"
                alignOffset={8}
                forceMount
            >
                <DropdownMenuItem onClick={onArchieve}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                    Last edited by: {user?.fullName || user?.username}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

Menu.Skeleton = function MenuSkeleton () {
    return(
        <Skeleton className="h-10 w-10" />
    );
};

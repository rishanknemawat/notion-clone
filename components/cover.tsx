"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { ImageIcon, X } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";

import { useCoverImage } from "@/hooks/use-cover-image";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface CoverProps {
    url?: string; 
    preview?: boolean;
};

export const Cover = ({
    url,
    preview,
}: CoverProps) => {
    const params = useParams();
    const coverImage = useCoverImage();
    const removeCoverImage = useMutation(api.documents.removeCoverImage);
    const { edgestore } = useEdgeStore();

    const onRemove = async () => {
        if (url) {
            await edgestore.publicFiles.delete({
                url: url,
            });
        };

        removeCoverImage({ id: params.documentId as Id<"documents"> });
    }

    return (
        <div className={cn(
            "relative w-full h-[35vh] group",
            !url && "h-[12vh]",
            url && "bg-muted"
        )}>
            {!!url && (
                <Image
                    src={url}
                    fill
                    className="object-cover"
                    alt="Cover"
                />
            )}
            {url && !preview && (
                <div className="opacity-0 group-hover:opacity-100 absolute
                    bottom-5 right-5 flex items-center gap-x-2">
                        <Button
                            className="text-muted-foreground text-xs"
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => coverImage.onReplace(url)}
                        > 
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Change Cover
                        </Button>
                        <Button
                            className="text-muted-foreground text-xs"
                            variant={"outline"}
                            size={"sm"}
                            onClick={onRemove}
                        > 
                            <X className="h-4 w-4 mr-2" />
                            Remove
                        </Button>
                </div>
            )}
        </div>
    );
};

Cover.Skeleton = function CoverSkeleton() {
    return (
      <Skeleton className="w-full h-[12vh]" />
    )
};

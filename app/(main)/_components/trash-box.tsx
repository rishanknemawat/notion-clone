"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/spinner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    const [search, setSearch] = useState("");
    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">
    ) => {
        event.stopPropagation();
        const promise = restore({ id: documentId });
        toast.promise(promise, {
            loading: "Restoring Note...",
            success: "Note successfully restored!",
            error: "Failed to restore note."
        })
    };

    const onRemove = (
        documentId: Id<"documents">
    ) => {
        const promise = remove({ id: documentId });
        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted permanantly!",
            error: "Failed to delete note."
        });

        if (params.documentId === documentId) {
            router.push("/documents");
        }
    };

    // Documents still loading...
    if (documents === undefined) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <Spinner size={"lg"} />
            </div>
        );
    }

    return (
        <div className="text-sm">
            <div className="items-center flex gap-x-1 p-2">
                <Search className="h-4 w-4" />
                <Input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 p-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filter by Page Title"
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p 
                    className="hidden last:block text-xs text-center 
                    text-muted-foreground pb-2">
                    No Documents Found.
                </p>
                {filteredDocuments?.map((document) => (
                    <div 
                        key={document._id}
                        role="button"
                        onClick={() => onClick(document._id)}
                        className="text-sm rounded-sm w-full hover:bg-primary/5 flex
                            items-center justify-between text-primary"
                    >
                        <span>
                            {document.title}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

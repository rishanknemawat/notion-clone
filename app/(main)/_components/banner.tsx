"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";

interface BannerProps {
    documentId: Id<"documents">;
}

export const Banner = ({
    documentId
}: BannerProps) => {
    const router = useRouter();
    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);

    const onRemove = () => {
        const promise = remove({ id: documentId});

        toast.promise(promise, {
            loading: "Deleting the note...",
            success: "Note successfully deleted.",
            error: "Failed to delete note."
        })

        router.push('/documents');
    };

    const onRestore = () => {
        const promise = restore({ id: documentId});
        toast.promise(promise, {
            loading: "Restoring the note...",
            success: "Note successfully restored.",
            error: "Failed to restore note."
        })
    };

    return (
        <div className="w-full bg-rose-500 text-sm text-center
                p-2 text-white flex items-center gap-x-2 justify-center">
            <p>
                This Page is in Trash.
            </p>
            <Button
                onClick={onRestore}
                size={"sm"}
                variant={"outline"}
                className="bg-transparent border-white hover:bg-primary/5
                text-white hover:text-white p-1 px-2 h-[27px] font-normal"
            >
                Restore
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button
                    size={"sm"}
                    variant={"outline"}
                    className="bg-transparent border-white hover:bg-primary/5
                    text-white hover:text-white p-1 px-2 h-[27px] font-normal"
                >
                    Delete
                </Button>
            </ConfirmModal>
        </div>
    )
};

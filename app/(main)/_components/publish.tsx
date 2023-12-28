"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PublishProps {
    initialData: Doc<"documents">;
};

const Publish = ({
    initialData
}: PublishProps) => {
    const origin = useOrigin();
    const update = useMutation(api.documents.update);
    const url = `${origin}/preview/${initialData._id}`

    const [copied, setCopied] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const onPublish = () => {
        setSubmitting(true);
        const promise = update({
            id: initialData._id,
            isPublished: true,
        }).finally(() => setSubmitting(false));

        toast.promise(promise, {
            loading: "Publishing your note...",
            success: "Note successfully published.",
            error: "Failed to publish the note."
        })
    };

    const onUnpublish = () => {
        setSubmitting(false);
        const promise = update({
            id: initialData._id,
            isPublished: false,
        }).finally(() => setSubmitting(false));

        toast.promise(promise, {
            loading: "Unpublishing your note...",
            success: "Note successfully unpublished.",
            error: "Failed to unpublish the note."
        })
    };

    const onCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText(url);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    return ( 
        <Popover>
            <PopoverTrigger asChild>
                <Button size={"sm"} variant={"ghost"}>
                    Publish
                    {!!initialData.isPublished && (
                        <Globe
                            className="text-sky-500 w-4 h-4 ml-2"
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-100"
                alignOffset={8}
                forceMount
            >
                { initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Globe className="text-sky-500 h-4 w-4 animate-pulse"/>
                            <p className="text-xs font-medium text-sky-500">
                                This note is live on web.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input
                                className="flex px-2 text-xs rounded-l-md
                                    border h-8 bg-muted truncate"
                                value={url}
                                disabled
                            />
                            <Button
                                onClick={onCopy}
                                disabled={copied}
                                className="rounded-l-none h-8"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4"/>
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <Button
                            className="text-xs w-full"
                            size={"sm"}
                            disabled={submitting}
                            onClick={onUnpublish}
                        >
                             Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe
                            className="w-8 h-8 text-muted-foreground mb-2"
                        />
                        <p className="text-sm mb-2 font-medium">
                            Publish this note
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Share your work with others
                        </span>
                        <Button 
                            disabled={submitting}
                            onClick={onPublish}
                            className="text-xs w-full"
                            size={"sm"}
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
 
export default Publish;
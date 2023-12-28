"use client";

import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";

import Image from "next/image";
import { toast } from "sonner";

import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const DocumentsPage = () => {
    const { user } = useUser();
    const route = useRouter();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
        const promise = create({ title: "Untitled" })
            .then((documentId: string) => {
                route.push(`/documents/${documentId}`);
            });
        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note successfully created.",
            error: "Failed to create new note."
        })
    }

    return ( 
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image 
                src="/empty.png" 
                alt="Empty"
                height={300}
                width={300}
                className="dark:hidden"
            />
            <Image 
                src="/empty-dark.png" 
                alt="Empty"
                height={300}
                width={300}
                className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">
                Welcome to {user?.firstName || user?.username}&apos;s Notion
            </h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2"/>
                Create a note
            </Button>
        </div>
     );
}
 
export default DocumentsPage;
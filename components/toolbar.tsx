"use client";

import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ImageIcon, Smile, X } from "lucide-react";
import TextareaAutoSize from "react-textarea-autosize";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import IconPicker from "./icon-picker";
import { Button } from "./ui/button";

interface ToolBarProps {
    initialData: Doc<"documents">;
    preview?: boolean;
};

const Toolbar = ({
    initialData,
    preview
}: ToolBarProps) => {
    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [ isEditing, setIsEditing ] = useState(false);
    const [ value, setValue ] = useState(initialData.title);

    const update = useMutation(api.documents.update);
    
    const enableInput = () => {
        if (preview) return;

        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
        }, 0);
    };

    const disableInput = () => {
        setIsEditing(false);
    };

    const onInput = (value: string) => {
        setValue(value);
        update({
            id: initialData._id,
            title: value || "Untitled",
        });
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            disableInput();
        }
    }

    return (
        <div className="pl-[54px] group relative">
            {!!initialData.icon && !preview && (
                <div className="flex items-center group/icon gap-x-2 pt-6">
                    <IconPicker onChange={() => {}}>
                        <p className="text-6xl hover:opacity-75 transition">
                            {initialData.icon}
                        </p>
                    </IconPicker>
                    <Button
                        onClick={() => {}}
                        className="rounded-full opacity-0 group-hover/icon:opacity-100
                            transition text-muted-foreground text-xs"
                        variant={"outline"}
                        size={"icon"}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            {!!initialData.icon && preview && (
                <p className="text-6xl pt-6">
                    {initialData.icon}
                </p>
            )}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
            {!initialData.icon && !preview && (
                <IconPicker asChild onChange={() => {}}>
                    <Button
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <Smile className="h-4 w-4 mr-2" />
                            Add icon
                    </Button>
                </IconPicker>
            )}
            {!initialData.coverImage && !preview && (
                <Button
                    onClick={() => {}}
                    className="text-muted-foreground text-xs"
                    variant="outline"
                    size="sm"
                >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Add cover
                </Button>
                )}
            </div>
            {isEditing && !preview ? (
                <TextareaAutoSize
                    ref={inputRef}
                    value={value}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                    onChange={e => onInput(e.target.value)}
                    className="text-5xl bg-transparent font-bold break-words outline-none 
                        text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
                />
            ) : (
                <div
                    onClick={enableInput}
                    className="pb-[11.5px] text-5xl font-bold break-words
                        outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
                >
                    {initialData.title}
                </div>
            )}
        </div>
     );
}
 
export default Toolbar;
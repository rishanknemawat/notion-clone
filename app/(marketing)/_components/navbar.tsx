"use client";

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const scrolled = useScrollTop();
    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-4",
            scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                {isLoading && (
                    <>
                        <Spinner />
                        <ModeToggle />
                    </>
                )}
                {!isAuthenticated && !isLoading && (
                    <>
                        <SignInButton mode="modal">
                            <Button variant={'ghost'} size={'sm'}>
                                Log in
                            </Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <Button size={'sm'}>
                                Get Note Creator Free
                            </Button>
                        </SignInButton>
                        <ModeToggle />
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant={'ghost'} size={'sm'} asChild>
                            <Link href={'/documents'}>Enter Note Creator</Link>
                        </Button>
                        <span className="flex flex-row justify-end gap-x-2">
                            <UserButton afterSignOutUrl="/" />
                            <ModeToggle />
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

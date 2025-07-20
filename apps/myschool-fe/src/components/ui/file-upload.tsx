import * as React from "react"
import { cn } from "@/lib/utils"
import { useUploadFile } from "@/services/mutation/file";
import type { FileUploadResponse } from "@/schema/file";


interface Props {
    onSuccess: (data: FileUploadResponse, variables?: { file: File }, context?: unknown) => void;
    className?: string,
}

function FileUpload({ className, onSuccess }: Props) {

    const uploadFile = useUploadFile();
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]
        if (!file) return
        
        uploadFile.mutate(
            { file },
            {
                onSuccess
            }
        )
    }


    return (
        <input
            type="file"
            onChange={(e) => { onChange(e) }}
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
        />
    )
}

export { FileUpload }

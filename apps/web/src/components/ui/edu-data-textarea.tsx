import * as React from "react"

import { cn } from "@/lib/utils"

function EduDataTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "edu-input font-data",
        className
      )}
      {...props}
    />
  )
}

export { EduDataTextarea }
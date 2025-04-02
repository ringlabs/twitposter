
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  noPulse = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { noPulse?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted", 
        { "animate-pulse": !noPulse },
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }

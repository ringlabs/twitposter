
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"
import { X } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const isMobile = useIsMobile()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={isMobile ? "bottom-center" : "bottom-right"}
      closeButton
      richColors
      expand={false}
      toastOptions={{
        duration: 4000,
        className: "group",
        classNames: {
          toast: "group rounded-lg border-border py-3 shadow-sm",
          title: "text-foreground text-base font-medium",
          description: "text-foreground text-sm",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          closeButton: "text-foreground relative ml-auto inline-flex",
        },
        descriptionClassName: "text-foreground text-sm",
        icon: null,
      }}
      {...props}
    />
  )
}

export { Toaster }

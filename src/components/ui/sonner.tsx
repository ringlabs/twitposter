
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const isMobile = useIsMobile()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={isMobile ? "top-center" : "bottom-right"}
      closeButton
      richColors
      expand={false}
      toastOptions={{
        duration: 4000,
        className: "group",
        classNames: {
          toast: "group rounded-lg border-border",
          title: "text-foreground text-base font-medium",
          description: "text-foreground text-sm",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          closeButton: "text-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

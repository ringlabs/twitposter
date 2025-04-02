
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
        // Using custom exit animations
        descriptionClassName: "text-foreground text-sm",
        exitAnimation: isMobile ? "slide-up" : "slide-right",
        customAnimation: {
          enter: {
            opacity: [0, 1],
            transform: ["translateX(8px)", "translateX(0)"]
          },
          exit: {
            opacity: [1, 0],
            transform: ["translateX(0)", isMobile ? "translateY(-8px)" : "translateX(8px)"]
          }
        },
        swipeDirection: isMobile ? "up" : "right",
      }}
      {...props}
    />
  )
}

export { Toaster }

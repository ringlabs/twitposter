
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
        descriptionClassName: "text-foreground text-sm",
        // Remove the 'icon' property as it doesn't exist in ToastOptions type
      }}
      {...props}
    />
  )
}

export { Toaster }

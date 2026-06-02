"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { ShoppingBag, CheckCircle2 } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} duration={2000} {...props}>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div className="grid gap-0.5">
                {title && <ToastTitle className="text-left text-[13px] font-bold text-gray-900">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-left text-[11px] text-gray-400 font-medium">{description}</ToastDescription>
                )}
              </div>
            </div>
            <div className="shrink-0">
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

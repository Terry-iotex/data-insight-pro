import * as React from "react"
import { cn } from "../../lib/utils"

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, onChange, disabled, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e)
      if (onCheckedChange) {
        onCheckedChange(e.target.checked)
      }
    }

    return (
      <label className={cn("relative inline-flex items-center", className)}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            "peer h-6 w-11 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            checked
              ? "bg-primary"
              : "bg-secondary"
          )}
        >
          <div
            className={cn(
              "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform duration-200",
              checked ? "left-6 translate-x-0" : "left-1 translate-x-0"
            )}
            style={{
              transform: checked ? 'translateX(20px)' : 'translateX(0)',
            }}
          />
        </div>
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }

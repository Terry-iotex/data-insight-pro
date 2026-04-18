
import { useEffect, useState } from "react"
import { Button } from "../v0-ui/Button"
import { Zap, Menu } from "lucide-react"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [aiConfigured, setAiConfigured] = useState(false)

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.store.get('ai_config').then((config: any) => {
        setAiConfigured(!!(config?.apiKey))
      }).catch(() => setAiConfigured(false))
    }
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">打开菜单</span>
        </Button>

        {aiConfigured && (
          <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5">
            <Zap className="h-4 w-4 text-accent" />
            <span className="hidden text-sm font-medium text-accent sm:inline">AI 增强模式</span>
          </div>
        )}
      </div>
    </header>
  )
}

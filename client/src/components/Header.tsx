import { Menu, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left: Menu */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        className="md:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Center: Title */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-lg font-bold">Crypto Futures Dashboard</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}

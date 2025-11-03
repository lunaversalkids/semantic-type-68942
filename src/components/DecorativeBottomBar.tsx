import { Button } from '@/components/ui/button';
import avatarImage from '@/assets/avatar-button.png';

interface DecorativeBottomBarProps {
  onClick?: () => void;
}

export const DecorativeBottomBar = ({ onClick }: DecorativeBottomBarProps) => {
  return (
    <div className="h-[86px] border-t border-sidebar-border bg-background flex items-center justify-center">
      <Button
        variant="ghost"
        className="h-[70px] w-[70px] rounded-full p-0 hover:opacity-80 transition-opacity"
        onClick={onClick}
      >
        <img 
          src={avatarImage} 
          alt="Avatar" 
          className="h-full w-full rounded-full object-cover"
        />
      </Button>
    </div>
  );
};

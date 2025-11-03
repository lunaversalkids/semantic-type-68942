import avatarImage from '@/assets/avatar-center.png';

export const AvatarBottomBar = () => {
  return (
    <div className="h-16 border-t border-sidebar-border bg-background px-6 flex items-center justify-center">
      <button className="flex items-center justify-center">
        <img 
          src={avatarImage} 
          alt="Avatar" 
          className="h-14 w-14 rounded-full object-cover"
        />
      </button>
    </div>
  );
};

import avatarButton from '@/assets/avatar-button.png';

export const DecorativeBottomBar = () => {
  const handleAvatarClick = () => {
    console.log('Avatar button clicked');
    // Add your custom functionality here
  };

  return (
    <div className="h-16 border-t border-sidebar-border bg-background px-6 flex items-center justify-center">
      <button 
        onClick={handleAvatarClick}
        className="w-12 h-12 rounded-full overflow-hidden hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <img 
          src={avatarButton} 
          alt="Avatar" 
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
};

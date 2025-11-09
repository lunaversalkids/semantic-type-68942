import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import infinityLogo from '@/assets/infinity-logo.png';
import sparklesIcon from '@/assets/sparkles-icon.png';

interface RecentDocument {
  id: string;
  title: string;
  thumbnail?: string;
  lastOpened: number;
}

const Documents = () => {
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);

  useEffect(() => {
    // Load recent documents from localStorage
    const stored = localStorage.getItem('recentDocuments');
    if (stored) {
      const docs = JSON.parse(stored) as RecentDocument[];
      setRecentDocs(docs.sort((a, b) => b.lastOpened - a.lastOpened));
    }
  }, []);

  const handleOpenRecent = (docId: string) => {
    navigate(`/editor?doc=${docId}`);
  };

  const handleStartNew = () => {
    navigate('/editor');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Top left icon - sparkles */}
      <div className="absolute top-8 left-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/80 to-[hsl(253,100%,95%)] flex items-center justify-center border-2 border-[hsl(253,80%,85%)] shadow-[0_4px_24px_hsl(253,100%,64%,0.2)]">
          <img src={sparklesIcon} alt="Sparkles" className="w-full h-full p-1" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center space-y-12 max-w-5xl w-full">
        {/* Logo and title section */}
        <div className="flex flex-col items-center space-y-2">
          {/* Infinity logo */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            <img 
              src={infinityLogo}
              alt="Doc One Infinity Logo" 
              className="w-80 h-80 object-contain"
              style={{ backgroundColor: 'transparent', mixBlendMode: 'multiply' }}
            />
            {/* Bottom glow effect */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-32 rounded-full bg-gradient-to-b from-[hsl(253,100%,64%,0.4)] to-transparent blur-3xl -z-10"></div>
          </div>

          {/* App title */}
          <div className="flex flex-col items-center space-y-3 -mt-[360px]">
            <h1 
              className="text-[5.5rem] font-extrabold tracking-tight leading-none" 
              style={{ 
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                color: '#3730a3',
                WebkitTextStroke: '3px white',
                paintOrder: 'stroke fill',
                textShadow: '0 4px 12px hsl(253 100% 64% / 0.15)',
                fontWeight: '700'
              }}
            >
              Doc One
            </h1>
            <p className="text-xl text-[hsl(253,28%,40%)] font-medium tracking-wide">
              Your Documents
            </p>
          </div>

          {/* New Document button */}
          <button 
            onClick={handleStartNew}
            className="relative px-16 py-5 bg-[hsl(253,100%,64%)] hover:bg-[hsl(253,100%,60%)] text-white text-xl font-bold rounded-[20px] shadow-[0_12px_40px_hsl(253,100%,64%,0.5)] hover:shadow-[0_16px_48px_hsl(253,100%,64%,0.7)] transition-all duration-300 hover:scale-105 border-2 border-[hsl(253,100%,74%)] overflow-hidden group"
          >
            <span className="relative z-10">New Document</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          {/* Divider text */}
          <p className="text-base text-[hsl(253,28%,40%)] font-semibold pt-2">
            Recent & Saved Documents
          </p>

          {/* Chevron arrow */}
          <svg 
            className="w-10 h-10 text-[hsl(253,100%,64%)] animate-bounce drop-shadow-[0_4px_8px_hsl(253,100%,64%,0.3)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Documents section */}
        <div className="w-full bg-gradient-to-br from-white/70 via-[hsl(253,100%,98%)] to-[hsl(253,100%,96%)] rounded-[28px] p-10 shadow-[0_0_60px_hsl(253,100%,64%,0.25),0_8px_48px_hsl(253,100%,64%,0.15),inset_0_1px_0_white] border-2 border-[hsl(253,80%,90%)] backdrop-blur-xl">
          {/* Documents grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-[hsl(253,47%,18%)]">All Documents</h2>
            </div>
            
            {recentDocs.length > 0 ? (
              <div className="grid grid-cols-4 gap-6">
                {recentDocs.map((doc, index) => (
                  <button
                    key={index}
                    onClick={() => handleOpenRecent(doc.id)}
                    className="group relative aspect-[3/4] rounded-[22px] overflow-hidden border-[3px] border-[hsl(253,80%,88%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_hsl(253,100%,64%,0.12)] hover:shadow-[0_0_40px_hsl(253,100%,64%,0.35),0_12px_40px_hsl(253,100%,64%,0.3)]"
                  >
                    <div className="w-full h-full bg-white p-8 overflow-hidden flex flex-col">
                      <div className="text-left text-[15px] leading-relaxed text-[hsl(253,47%,18%)] whitespace-pre-line font-serif line-clamp-[20]">
                        {doc.thumbnail || doc.title}
                      </div>
                    </div>
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-bold text-center truncate drop-shadow-md">
                        {doc.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-2xl text-[hsl(253,28%,40%)] font-medium">No documents yet</p>
                <p className="text-lg text-[hsl(253,28%,50%)] mt-2">Start writing to create your first document</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;

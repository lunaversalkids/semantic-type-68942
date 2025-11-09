import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import infinityLogo from '@/assets/infinity-logo.png';

interface RecentDocument {
  id: string;
  title: string;
  thumbnail?: string;
  lastOpened: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [activeTab, setActiveTab] = useState('Recents');

  useEffect(() => {
    // Load recent documents from localStorage
    const stored = localStorage.getItem('recentDocuments');
    if (stored) {
      const docs = JSON.parse(stored) as RecentDocument[];
      // Ensure "Insects" document exists and is first with default content
      const insectsDoc = docs.find(doc => doc.id === 'insects-document');
      const defaultInsectsContent = `Insects

Arthropods

Insects are an ind-isub sclass units of the class Hexapoda – In from novellisms them from other arthropods by their three-part body, compound eyes, and external skeleton, in an abusant serza.

Hexapoda

Arthroprod soptrtrice Hexapoda

Insects comprise the most diverse group of animals on Earth.

Classification and Evolution

Insects comprise the most diverse group of animals on Earth.

Insects are the largest group of arthropods. The evolution, their evolution, Murninary endurseries, during the De-vonian period after thorough.`;
      
      if (insectsDoc) {
        insectsDoc.title = 'Insects';
        if (!insectsDoc.thumbnail) {
          insectsDoc.thumbnail = defaultInsectsContent;
        }
        const otherDocs = docs.filter(doc => doc.id !== 'insects-document');
        const sortedDocs = [insectsDoc, ...otherDocs.sort((a, b) => b.lastOpened - a.lastOpened)];
        localStorage.setItem('recentDocuments', JSON.stringify(sortedDocs));
        setRecentDocs(sortedDocs.slice(0, 4));
      } else {
        // Add Insects document with default content
        const defaultDoc: RecentDocument = {
          id: 'insects-document',
          title: 'Insects',
          thumbnail: defaultInsectsContent,
          lastOpened: Date.now()
        };
        const sortedDocs = [defaultDoc, ...docs.sort((a, b) => b.lastOpened - a.lastOpened)];
        localStorage.setItem('recentDocuments', JSON.stringify(sortedDocs));
        setRecentDocs(sortedDocs.slice(0, 4));
      }
    } else {
      // Initialize with default "Insects" document
      const defaultInsectsContent = `Insects

Arthropods

Insects are an ind-isub sclass units of the class Hexapoda – In from novellisms them from other arthropods by their three-part body, compound eyes, and external skeleton, in an abusant serza.

Hexapoda

Arthroprod soptrtrice Hexapoda

Insects comprise the most diverse group of animals on Earth.

Classification and Evolution

Insects comprise the most diverse group of animals on Earth.

Insects are the largest group of arthropods. The evolution, their evolution, Murninary endurseries, during the De-vonian period after thorough.`;
      
      const defaultDoc: RecentDocument = {
        id: 'insects-document',
        title: 'Insects',
        thumbnail: defaultInsectsContent,
        lastOpened: Date.now()
      };
      localStorage.setItem('recentDocuments', JSON.stringify([defaultDoc]));
      setRecentDocs([defaultDoc]);
    }
  }, []);

  const handleStartWriting = () => {
    navigate('/editor');
  };

  const handleOpenRecent = (docId: string) => {
    navigate(`/editor?doc=${docId}`);
  };

  const templates = [
    { 
      name: 'Blank', 
      id: 'insects-document',
      thumbnail: 'content',
      isRecent: true
    },
    { 
      name: 'Simple Novel', 
      thumbnail: 'gradient',
      gradient: 'linear-gradient(135deg, hsl(210 100% 45%), hsl(220 100% 55%))',
    },
    { 
      name: 'Contemporary Novel', 
      thumbnail: 'image',
      bgColor: 'hsl(220 20% 15%)',
    },
    { 
      name: 'Blank Book Portrait', 
      thumbnail: 'blank',
    },
  ];

  const tabs = ['Recents', 'Basic', 'Reports', 'Books', 'Study Books', 'Letters'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Top left icon - sparkles */}
      <div className="absolute top-8 left-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/80 to-[hsl(253,100%,95%)] flex items-center justify-center border-2 border-[hsl(253,80%,85%)] shadow-[0_4px_24px_hsl(253,100%,64%,0.2)]">
          <svg className="w-7 h-7 text-[hsl(253,100%,64%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
          </svg>
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
            {/* Bottom glow effect - starts from bottom and fades down */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-32 rounded-full bg-gradient-to-b from-[hsl(253,100%,64%,0.4)] to-transparent blur-3xl -z-10"></div>
          </div>

          {/* App title */}
          <div className="flex flex-col items-center space-y-3 -mt-64">
            <h1 
              className="text-[5.5rem] font-extrabold tracking-tight leading-none" 
              style={{ 
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                color: '#3730a3',
                WebkitTextStroke: '2px white',
                paintOrder: 'stroke fill',
                textShadow: '0 2px 8px hsl(253 100% 64% / 0.1)'
              }}
            >
              Doc One
            </h1>
            <p className="text-xl text-[hsl(253,28%,40%)] font-medium tracking-wide">
              Create. Teach. Publish. Evolve.
            </p>
          </div>

          {/* Start Writing button */}
          <button 
            onClick={handleStartWriting}
            className="relative px-16 py-5 bg-[hsl(253,100%,64%)] hover:bg-[hsl(253,100%,60%)] text-white text-xl font-bold rounded-[20px] shadow-[0_12px_40px_hsl(253,100%,64%,0.5)] hover:shadow-[0_16px_48px_hsl(253,100%,64%,0.7)] transition-all duration-300 hover:scale-105 border-2 border-[hsl(253,100%,74%)] overflow-hidden group"
          >
            <span className="relative z-10">Start Writing</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          {/* Divider text */}
          <p className="text-base text-[hsl(253,28%,40%)] font-semibold pt-2">
            Choose Your Template.
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

        {/* Templates section */}
        <div className="w-full bg-gradient-to-br from-white/70 via-[hsl(253,100%,98%)] to-[hsl(253,100%,96%)] rounded-[28px] p-10 shadow-[0_0_60px_hsl(253,100%,64%,0.25),0_8px_48px_hsl(253,100%,64%,0.15),inset_0_1px_0_white] border-2 border-[hsl(253,80%,90%)] backdrop-blur-xl">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-8 bg-transparent gap-3 h-auto p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="px-7 py-3 rounded-[16px] text-[hsl(253,28%,40%)] data-[state=active]:text-[hsl(253,100%,64%)] data-[state=active]:bg-white data-[state=active]:shadow-[0_4px_20px_hsl(253,100%,64%,0.3),inset_0_1px_0_white] transition-all duration-200 font-semibold hover:text-[hsl(253,100%,64%)] border-2 border-transparent data-[state=active]:border-[hsl(253,100%,64%)]"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {/* Recent documents grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-[hsl(253,47%,18%)]">{activeTab}</h2>
                </div>
                
                <div className="grid grid-cols-4 gap-6">
                  {templates.map((template, index) => {
                    const doc = recentDocs.find(d => d.id === template.id);
                    return (
                      <button
                        key={index}
                        onClick={() => template.id ? handleOpenRecent(template.id) : handleStartWriting()}
                        className="group relative aspect-[3/4] rounded-[22px] overflow-hidden border-[3px] border-[hsl(253,80%,88%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_hsl(253,100%,64%,0.12)] hover:shadow-[0_0_40px_hsl(253,100%,64%,0.35),0_12px_40px_hsl(253,100%,64%,0.3)]"
                      >
                        {template.thumbnail === 'content' && doc?.thumbnail ? (
                          <div className="w-full h-full bg-white p-8 overflow-hidden flex flex-col">
                            <div className="text-left text-[15px] leading-relaxed text-[hsl(253,47%,18%)] whitespace-pre-line font-serif line-clamp-[20]">
                              {doc.thumbnail}
                            </div>
                          </div>
                        ) : template.thumbnail === 'gradient' ? (
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: template.gradient }}
                          >
                            <h3 className="text-white text-2xl font-bold uppercase tracking-wider px-4 text-center drop-shadow-lg">
                              {template.name}
                            </h3>
                          </div>
                        ) : template.thumbnail === 'image' ? (
                          <div 
                            className="w-full h-full flex items-center justify-center relative"
                            style={{ backgroundColor: template.bgColor }}
                          >
                            {/* City lights effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[hsl(220,30%,20%)]"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[hsl(220,20%,10%)] to-transparent"></div>
                            {/* Scattered light dots for city lights */}
                            <div className="absolute inset-0">
                              {[...Array(30)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-70"
                                  style={{
                                    left: `${Math.random() * 100}%`,
                                    bottom: `${Math.random() * 40 + 10}%`,
                                    boxShadow: '0 0 4px hsl(45 100% 70%)',
                                  }}
                                ></div>
                              ))}
                            </div>
                            <h3 className="relative z-10 text-white text-2xl font-bold uppercase tracking-wider px-4 text-center drop-shadow-lg">
                              {template.name}
                            </h3>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-white to-[hsl(253,100%,98%)] flex items-center justify-center">
                            <div className="text-[hsl(253,60%,88%)] text-6xl">📄</div>
                          </div>
                        )}
                        
                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm font-bold text-center truncate drop-shadow-md">
                            {template.name}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* See all button */}
              <div className="flex justify-center pt-6">
                <button className="text-[hsl(253,28%,40%)] hover:text-[hsl(253,100%,64%)] font-semibold flex items-center gap-2 transition-all duration-200 hover:gap-3">
                  See All
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Home;

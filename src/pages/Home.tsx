import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import infinityLogo from '@/assets/infinity-logo.png';
import sparklesIcon from '@/assets/sparkles-icon.png';

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
  const [isTemplatesExpanded, setIsTemplatesExpanded] = useState(false);

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
  ];

  const bookTemplates = [
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
          <img src={sparklesIcon} alt="Sparkles" className="w-full h-full p-1" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center space-y-12 max-w-5xl w-full">
        {/* Logo and title section */}
        <div className="flex flex-col items-center space-y-6">
          {/* Infinity logo */}
          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            <div className="w-[280px] h-[280px] rounded-full bg-gradient-to-br from-[hsl(265,100%,75%)] to-[hsl(265,85%,65%)] flex items-center justify-center shadow-[0_20px_60px_rgba(139,92,246,0.4)]">
              <img 
                src={infinityLogo}
                alt="Doc One Infinity Logo" 
                className="w-32 h-32 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </div>

          {/* App title */}
          <div className="flex flex-col items-center space-y-1 -mt-4">
            <h1 
              className="text-[5.5rem] font-bold tracking-tight leading-none" 
              style={{ 
                color: '#3730a3',
                fontWeight: '700'
              }}
            >
              Doc One
            </h1>
            <p className="text-[1.35rem] font-normal" style={{ color: '#8b7bc7' }}>
              Create. Teach. Publish. Evolve.
            </p>
          </div>

          {/* Start Writing button */}
          <button 
            onClick={handleStartWriting}
            className="relative px-24 py-5 text-white text-[1.35rem] font-bold rounded-[28px] transition-all duration-300 hover:scale-105 mt-4"
            style={{
              background: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 16px 48px rgba(99,102,241,0.4)'
            }}
          >
            Start Writing
          </button>

          {/* Divider text */}
          <p className="text-[1.1rem] font-medium pt-2" style={{ color: '#8b7bc7' }}>
            Choose Your Template.
          </p>

          {/* Chevron arrow */}
          <svg 
            className="w-12 h-12 mt-2" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: '#6366f1' }}
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
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
                  {activeTab === 'Recents' ? (
                    recentDocs.slice(0, 1).map((doc, index) => (
                      <button
                        key={index}
                        onClick={() => handleOpenRecent(doc.id)}
                        className="group relative aspect-[3/4] rounded-[22px] overflow-hidden border-[3px] border-[hsl(253,80%,88%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_hsl(253,100%,64%,0.12)] hover:shadow-[0_0_40px_hsl(253,100%,64%,0.35),0_12px_40px_hsl(253,100%,64%,0.3)]"
                      >
                        <div className="w-full h-full bg-white p-8 overflow-hidden flex flex-col">
                          <div className="text-left text-[15px] leading-relaxed text-[hsl(253,47%,18%)] whitespace-pre-line font-serif line-clamp-[20]">
                            {doc.thumbnail}
                          </div>
                        </div>
                        
                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm font-bold text-center truncate drop-shadow-md">
                            {doc.title}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    bookTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleStartWriting()}
                        className="group relative aspect-[3/4] rounded-[22px] overflow-hidden border-[3px] border-[hsl(253,80%,88%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_hsl(253,100%,64%,0.12)] hover:shadow-[0_0_40px_hsl(253,100%,64%,0.35),0_12px_40px_hsl(253,100%,64%,0.3)]"
                      >
                        {template.thumbnail === 'gradient' ? (
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
                    ))
                  )}
                </div>
              </div>

              {/* See all button and templates section - only show in Recents tab */}
              {activeTab === 'Recents' && (
                <>
                  <div className="flex justify-center pt-6">
                    <button 
                      onClick={() => setIsTemplatesExpanded(!isTemplatesExpanded)}
                      className="text-[hsl(253,28%,40%)] hover:text-[hsl(253,100%,64%)] font-semibold flex items-center gap-2 transition-all duration-200"
                    >
                      See All Templates
                      <svg 
                        className={`w-5 h-5 transition-transform duration-200 ${isTemplatesExpanded ? 'rotate-180' : 'rotate-90'}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Template options below See All */}
                  {isTemplatesExpanded && (
                    <div className="grid grid-cols-4 gap-6 pt-6">
                    {bookTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleStartWriting()}
                        className="group relative aspect-[3/4] rounded-[22px] overflow-hidden border-[3px] border-[hsl(253,80%,88%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_hsl(253,100%,64%,0.12)] hover:shadow-[0_0_40px_hsl(253,100%,64%,0.35),0_12px_40px_hsl(253,100%,64%,0.3)]"
                      >
                        {template.thumbnail === 'gradient' ? (
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
                    ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Home;

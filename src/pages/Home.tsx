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
    // Set up hardcoded recent documents
    const hardcodedDocs: RecentDocument[] = [
      {
        id: 'blank-document',
        title: 'Blank',
        lastOpened: Date.now()
      },
      {
        id: 'tales-of-blue',
        title: 'Tales of Blue',
        lastOpened: Date.now() - 1000
      },
      {
        id: 'city-lights',
        title: 'City Lights',
        lastOpened: Date.now() - 2000
      },
      {
        id: 'blank-book-portrait',
        title: 'Blank Book Portrait',
        lastOpened: Date.now() - 3000
      }
    ];
    setRecentDocs(hardcodedDocs);
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
    <div className="min-h-screen flex flex-col items-center justify-start font-poppins" style={{ background: 'radial-gradient(circle at top, #e8defc, #faf7ff)' }}>
      {/* Main content */}
      <div className="flex flex-col items-center w-full max-w-[600px] pt-12 px-4">
        {/* Logo and title section */}
        <div className="flex flex-col items-center space-y-4">
          {/* Infinity logo */}
          <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center" style={{ 
            background: 'radial-gradient(circle at 40% 40%, #a57cff, #6e3bce)',
            boxShadow: '0 0 40px rgba(168, 132, 255, 0.5)'
          }}>
            <div className="text-[70px] text-white" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))' }}>
              ∞
            </div>
          </div>

          {/* App title */}
          <div className="flex flex-col items-center space-y-1">
            <h1 className="text-5xl font-semibold" style={{ color: '#3b2061' }}>
              Doc One
            </h1>
            <p className="text-lg" style={{ color: '#7a63c7' }}>
              Create. Teach. Publish. Evolve.
            </p>
          </div>

          {/* Start Writing button */}
          <button 
            onClick={handleStartWriting}
            className="mt-6 px-[60px] py-[14px] text-lg text-white rounded-2xl border-none cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(155,99,255,0.8)]"
            style={{ 
              background: 'linear-gradient(180deg, #7a45ff, #6432db)',
              boxShadow: '0 6px 20px rgba(120, 60, 255, 0.6)'
            }}
          >
            Start Writing
          </button>

          {/* Divider text */}
          <p className="mt-4 text-base font-normal" style={{ color: '#7f67d5' }}>
            Choose Your Template.
          </p>

          {/* Chevron arrow */}
          <div className="text-[28px] mt-2 animate-pulse-arrow" style={{ 
            color: '#8b70f7',
            filter: 'drop-shadow(0 4px 10px rgba(150, 90, 255, 0.5))'
          }}>
            ⌄
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mt-10 text-[15px]" style={{ color: '#7b6dc9' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 transition-all ${activeTab === tab ? 'font-semibold border-b-2' : ''}`}
              style={{ 
                color: activeTab === tab ? '#6e3bce' : '#7b6dc9',
                borderColor: activeTab === tab ? '#6e3bce' : 'transparent'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Templates section */}
        <div className="w-full mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

            <TabsContent value={activeTab} className="mt-4">
              {/* Recent documents grid */}
              <div>
                <h2 className="text-xl font-medium mb-4" style={{ color: '#3b2061' }}>{activeTab}</h2>
                
                <div className="flex justify-center gap-[18px]">
                  {activeTab === 'Recents' ? (
                    recentDocs.map((doc, index) => {
                      const getDocumentStyle = (title: string) => {
                        switch(title) {
                          case 'Blank':
                            return { background: 'white', color: '#6e3bce', border: 'none' };
                          case 'Tales of Blue':
                            return { background: 'linear-gradient(180deg, #4a7dfc, #2a57d6)', color: 'white', border: 'none' };
                          case 'City Lights':
                            return { background: 'linear-gradient(180deg, #1f2235, #33405b)', color: 'white', border: 'none' };
                          case 'Blank Book Portrait':
                            return { background: 'white', color: '#6e3bce', border: '2px solid #c5a9ff' };
                          default:
                            return { background: 'white', color: '#6e3bce', border: 'none' };
                        }
                      };
                      
                      const style = getDocumentStyle(doc.title);
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleOpenRecent(doc.id)}
                          className="w-[90px] h-[130px] rounded-[10px] flex flex-col items-center justify-center text-[13px] font-medium transition-all"
                          style={{ 
                            background: style.background,
                            color: style.color,
                            border: style.border,
                            boxShadow: '0 0 15px rgba(160, 120, 255, 0.3)'
                          }}
                        >
                          {doc.title}
                        </button>
                      );
                    })
                  ) : (
                    bookTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleStartWriting()}
                        className="w-[90px] h-[130px] rounded-[10px] flex items-center justify-center text-[13px] font-medium transition-all"
                        style={{ 
                          background: template.thumbnail === 'gradient' ? template.gradient : 
                                    template.thumbnail === 'image' ? template.bgColor : 'white',
                          color: 'white',
                          boxShadow: '0 0 15px rgba(160, 120, 255, 0.3)'
                        }}
                      >
                        {template.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Home;

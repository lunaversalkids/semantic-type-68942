import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    let docs: RecentDocument[] = [];
    
    if (stored) {
      docs = JSON.parse(stored) as RecentDocument[];
    }
    
    // Add default recent document if none exists
    if (docs.length === 0) {
      docs = [{
        id: 'insects-document',
        title: "What's over there?",
        lastOpened: Date.now(),
      }];
      localStorage.setItem('recentDocuments', JSON.stringify(docs));
    }
    
    setRecentDocs(docs.sort((a, b) => b.lastOpened - a.lastOpened).slice(0, 4));
  }, []);

  const handleStartWriting = () => {
    navigate('/editor');
  };

  const handleOpenRecent = (doc: RecentDocument) => {
    navigate(`/editor?doc=${doc.id}`);
  };

  const templates = [
    { name: 'Blank', thumbnail: null },
    { name: 'Simple Novel', thumbnail: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop' },
    { name: 'Contemporary Novel', thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop' },
    { name: 'Blank Book Portrait', thumbnail: null },
  ];

  const tabs = ['Recents', 'Basic', 'Reports', 'Books', 'Study Books', 'Letters'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-6 bg-gradient-to-br from-[hsl(253,100%,95%)] via-[hsl(260,100%,96%)] to-[hsl(270,100%,97%)]">
      {/* Top Left Icon */}
      <button onClick={() => navigate('/home')} className="fixed top-6 left-6">
        <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
          <Sparkles className="w-8 h-8 text-[hsl(253,100%,64%)]" />
        </div>
      </button>

      {/* Logo and Header */}
      <div className="flex flex-col items-center space-y-6 mb-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(253,100%,70%)] to-[hsl(260,100%,60%)] rounded-full blur-2xl opacity-40" />
          <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-[hsl(253,100%,64%)] to-[hsl(260,100%,56%)] flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 100 100" className="w-24 h-24">
              <path
                d="M30 50 Q30 30, 50 30 Q70 30, 70 50 Q70 70, 50 70 Q30 70, 30 50 M40 50 Q40 40, 50 40 Q60 40, 60 50 Q60 60, 50 60 Q40 60, 40 50"
                fill="white"
                className="opacity-90"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-7xl font-bold text-[hsl(253,47%,18%)] tracking-tight">
          Doc One
        </h1>
        
        <p className="text-2xl text-[hsl(253,28%,40%)] font-medium">
          Create. Teach. Publish. Evolve.
        </p>

        <Button 
          onClick={handleStartWriting}
          className="mt-6 px-12 py-7 text-xl font-semibold rounded-2xl bg-gradient-to-r from-[hsl(253,100%,64%)] to-[hsl(260,100%,56%)] hover:from-[hsl(253,100%,60%)] hover:to-[hsl(260,100%,52%)] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          Start Writing
        </Button>

        <div className="flex flex-col items-center space-y-3 mt-4">
          <p className="text-lg text-[hsl(253,28%,40%)]">Choose Your Template.</p>
          <ChevronDown className="w-8 h-8 text-[hsl(253,100%,64%)] animate-bounce" />
        </div>
      </div>

      {/* Template Section */}
      <div className="w-full max-w-6xl bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-12">
        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-[hsl(253,60%,88%)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 text-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'text-[hsl(253,100%,64%)] border-b-2 border-[hsl(253,100%,64%)]'
                  : 'text-[hsl(253,28%,40%)] hover:text-[hsl(253,47%,18%)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Recent Documents Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bold text-[hsl(253,47%,18%)]">Recents</h2>
            <ChevronRight className="w-8 h-8 text-[hsl(253,28%,40%)]" />
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Show recent docs first, then fill remaining slots with templates */}
            {recentDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleOpenRecent(doc)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-4 border-[hsl(253,80%,85%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white"
              >
                {doc.thumbnail ? (
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[hsl(253,100%,97%)] to-[hsl(260,100%,95%)]" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white font-semibold text-center">{doc.title}</p>
                </div>
              </button>
            ))}
            {/* Fill remaining slots with templates */}
            {templates.slice(0, 4 - recentDocs.length).map((template) => (
              <button
                key={template.name}
                onClick={handleStartWriting}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-4 border-[hsl(253,80%,85%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white"
              >
                {template.thumbnail ? (
                  <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[hsl(253,100%,97%)] to-[hsl(260,100%,95%)]" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white font-semibold text-center">{template.name}</p>
                </div>
              </button>
            ))}
          </div>

          <button className="flex items-center justify-between w-full text-left group">
            <span className="text-2xl font-bold text-[hsl(253,47%,18%)] group-hover:text-[hsl(253,100%,64%)] transition-colors">
              See All
            </span>
            <ChevronRight className="w-8 h-8 text-[hsl(253,28%,40%)] group-hover:text-[hsl(253,100%,64%)] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

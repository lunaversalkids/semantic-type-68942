import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, MoreVertical, Copy, Trash2, Edit3 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import infinityLogo from '@/assets/infinity-logo.png';
import sparklesIcon from '@/assets/sparkles-icon.png';
import homeBackground from '@/assets/new-home-background.jpg';
import estherBackground from '@/assets/new-esther-background.jpg';
import estherStarsOverlay from '@/assets/esther-stars-overlay.png';
interface RecentDocument {
  id: string;
  title: string;
  thumbnail?: string;
  lastOpened: number;
}
const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromEditor = searchParams.get('from') === 'editor';
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [activeTab, setActiveTab] = useState('Recents');
  const [isTemplatesExpanded, setIsTemplatesExpanded] = useState(false);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
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

  const handleRenameDocument = (docId: string) => {
    if (!newName.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const stored = localStorage.getItem('recentDocuments');
    if (stored) {
      const docs = JSON.parse(stored) as RecentDocument[];
      const updatedDocs = docs.map(doc => 
        doc.id === docId ? { ...doc, title: newName.trim() } : doc
      );
      localStorage.setItem('recentDocuments', JSON.stringify(updatedDocs));
      setRecentDocs(updatedDocs.slice(0, 4));
      toast.success('Document renamed');
    }
    setRenamingId(null);
    setNewName('');
    setOpenMenuId(null);
  };

  const handleDuplicateDocument = (doc: RecentDocument) => {
    // Close menu immediately to prevent glitching
    setOpenMenuId(null);
    
    const stored = localStorage.getItem('recentDocuments');
    if (stored) {
      const docs = JSON.parse(stored) as RecentDocument[];
      const newDoc: RecentDocument = {
        id: crypto.randomUUID(),
        title: `${doc.title} (Copy)`,
        thumbnail: doc.thumbnail,
        lastOpened: Date.now()
      };
      const updatedDocs = [newDoc, ...docs];
      localStorage.setItem('recentDocuments', JSON.stringify(updatedDocs));
      setRecentDocs(updatedDocs.slice(0, 4));
      toast.success('Document duplicated');
    }
  };

  const handleDeleteDocument = (docId: string, docTitle: string) => {
    // Close menu immediately to prevent glitching
    setOpenMenuId(null);
    
    // Small delay to let the popover close before showing confirm dialog
    setTimeout(() => {
      if (!confirm(`Delete "${docTitle}"?`)) return;

      const stored = localStorage.getItem('recentDocuments');
      if (stored) {
        const docs = JSON.parse(stored) as RecentDocument[];
        const updatedDocs = docs.filter(doc => doc.id !== docId);
        localStorage.setItem('recentDocuments', JSON.stringify(updatedDocs));
        setRecentDocs(updatedDocs.slice(0, 4));
        toast.success('Document deleted');
      }
    }, 100);
  };

  const templates: any[] = [];
  const bookTemplates = [{
    name: 'Simple Novel',
    thumbnail: 'gradient',
    gradient: 'linear-gradient(135deg, hsl(210 100% 45%), hsl(220 100% 55%))'
  }, {
    name: 'Contemporary Novel',
    thumbnail: 'image',
    bgColor: 'hsl(220 20% 15%)'
  }, {
    name: 'Blank Book Portrait',
    thumbnail: 'blank'
  }];
  const tabs = ['Recents', 'Basic', 'Reports', 'Books', 'Study Books', 'Letters'];
  return <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden animate-fade-in"
      style={{
        backgroundImage: isCategoriesVisible ? `url(${estherBackground})` : `url(${homeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: isCategoriesVisible ? 'center -2%' : 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: isCategoriesVisible ? 'fixed' : 'scroll'
      }}
    >
      {/* Stars overlay - only show when categories are visible */}
      {isCategoriesVisible && (
        <div 
          className="absolute left-0 top-[25%] w-[700px] h-[75%] pointer-events-none animate-fade-in"
          style={{
            backgroundImage: `url(${estherStarsOverlay})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'normal',
            zIndex: 5
          }}
        />
      )}
      {/* Back button - only show when coming from editor */}
      {fromEditor && <button onClick={() => navigate('/editor')} className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border-2 border-[hsl(253,80%,85%)] rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-[hsl(253,47%,18%)] font-semibold">
          <ArrowLeft className="w-5 h-5" />
          Back to Editor
        </button>}
      
      {/* Top left icon - sparkles - only show when NOT from editor */}
      {!fromEditor && <div className="absolute top-8 left-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/80 to-[hsl(253,100%,95%)] flex items-center justify-center border-2 border-[hsl(253,80%,85%)] shadow-[0_4px_24px_hsl(253,100%,64%,0.2)]">
            <img src={sparklesIcon} alt="Sparkles" className="w-full h-full p-1" />
          </div>
        </div>}

      {/* Main content */}
      <div className="flex flex-col items-center space-y-12 max-w-5xl w-full">
        {/* Logo and title section */}
        <div className="flex flex-col items-center space-y-2">
          {/* Infinity logo */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            <img src={infinityLogo} alt="Doc One Infinity Logo" className="w-80 h-80 object-contain" style={{
            backgroundColor: 'transparent',
            mixBlendMode: 'multiply'
          }} />
            {/* Bottom glow effect - starts from bottom and fades down */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-32 rounded-full bg-gradient-to-b from-[hsl(253,100%,64%,0.4)] to-transparent blur-3xl -z-10"></div>
          </div>

          {/* App title */}
          <div className="flex flex-col items-center space-y-3 -mt-[360px]">
            <h1 className="text-[4rem] font-extrabold tracking-tight leading-none" style={{
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            color: '#3730a3',
            WebkitTextStroke: '3px white',
            paintOrder: 'stroke fill',
            textShadow: '0 4px 12px hsl(253 100% 64% / 0.15)',
            fontWeight: '700'
          }}>
              Doc One
            </h1>
            
            {/* Show tagline and button only on homepage (NOT from editor) */}
            {!fromEditor && (
              <>
                {/* Tagline */}
                <p className="text-base text-[hsl(253,28%,40%)] font-semibold">
                  Create. Teach. Publish. Evolve.
                </p>

                {/* Start Writing button */}
                <button
                  onClick={handleStartWriting}
                  className="mt-4 px-12 py-4 bg-gradient-to-r from-[hsl(253,100%,64%)] to-[hsl(266,100%,70%)] text-white text-xl font-bold rounded-full shadow-[0_0_30px_hsl(253,100%,64%,0.5)] hover:shadow-[0_0_50px_hsl(253,100%,64%,0.7)] hover:scale-105 transition-all duration-300"
                >
                  Start Writing
                </button>
              </>
            )}
          </div>

          {/* Divider text - only show on homepage */}
          {!fromEditor && <p className="text-base text-[hsl(253,28%,40%)] font-semibold pt-2">Choose Your Template.</p>}

          {/* Chevron arrow */}
          <button 
            onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
            className="focus:outline-none"
          >
            <svg className={`w-10 h-10 text-[hsl(253,100%,64%)] drop-shadow-[0_4px_8px_hsl(253,100%,64%,0.3)] transition-transform duration-300 ${isCategoriesVisible ? 'rotate-180' : ''} ${!isCategoriesVisible ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Templates section or Recent documents only */}
        {isCategoriesVisible && (
          <div className="w-full bg-[hsl(253,60%,92%)] rounded-[28px] p-10 shadow-[0_0_60px_hsl(253,100%,64%,0.4),0_12px_48px_hsl(253,100%,64%,0.3),0_0_100px_hsl(253,100%,64%,0.2)] border-[3px] border-[hsl(253,80%,85%)] backdrop-blur-xl animate-fade-in relative z-10">
          {fromEditor ?
        // Simple recent documents view when coming from editor
        <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[hsl(253,47%,18%)]">Recent & Saved Documents</h2>
              <div className="grid grid-cols-4 gap-6">
                {recentDocs.map((doc, index) => <div key={index} className="group relative aspect-[3/4] rounded-[22px] overflow-hidden border-[3px] border-[hsl(253,80%,88%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_hsl(253,100%,64%,0.12)] hover:shadow-[0_0_40px_hsl(253,100%,64%,0.35),0_12px_40px_hsl(253,100%,64%,0.3)]">
                    <button onClick={() => handleOpenRecent(doc.id)} className="w-full h-full">
                      <div className="w-full h-full bg-white p-8 overflow-hidden flex flex-col">
                        <div className="text-left text-[15px] leading-relaxed text-[hsl(253,47%,18%)] whitespace-pre-line font-serif line-clamp-[20]">
                          {doc.thumbnail}
                        </div>
                      </div>
                    </button>
                    
                    {/* Three-dot menu */}
                    <Popover open={openMenuId === doc.id} onOpenChange={(open) => setOpenMenuId(open ? doc.id : null)}>
                      <PopoverTrigger asChild>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(253,100%,64%)] to-[hsl(266,100%,70%)] ${openMenuId === doc.id ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100 hover:scale-110'} hover:shadow-[0_0_20px_hsl(253,100%,64%,0.8)] transition-all duration-200 flex items-center justify-center z-50`}
                        >
                          <MoreVertical className="w-5 h-5 text-white" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-48 p-2 bg-[hsl(253,100%,98%)] border-2 border-[hsl(253,80%,85%)] rounded-2xl shadow-[0_8px_32px_hsl(253,100%,64%,0.25)] z-[100]"
                        sideOffset={8}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renamingId === doc.id ? (
                          <div className="p-2 space-y-2">
                            <Input
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              placeholder="New name"
                              className="text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRenameDocument(doc.id);
                                if (e.key === 'Escape') {
                                  setRenamingId(null);
                                  setNewName('');
                                }
                              }}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleRenameDocument(doc.id)} className="flex-1 text-xs bg-[hsl(253,100%,64%)]">Save</Button>
                              <Button size="sm" variant="outline" onClick={() => {
                                setRenamingId(null);
                                setNewName('');
                              }} className="flex-1 text-xs">Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                setRenamingId(doc.id);
                                setNewName(doc.title);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[hsl(253,47%,18%)] hover:bg-[hsl(253,100%,64%,0.15)] rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                              Rename
                            </button>
                            <button
                              onClick={() => handleDuplicateDocument(doc)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[hsl(253,47%,18%)] hover:bg-[hsl(253,100%,64%,0.15)] rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                              Make a Duplicate Copy
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id, doc.title)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <p className="text-white text-sm font-bold text-center truncate drop-shadow-md">
                        {doc.title}
                      </p>
                    </div>
                  </div>)}
              </div>
            </div> :
        // Full templates view with tabs
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-8 bg-transparent gap-3 h-auto p-0">
              {tabs.map(tab => <TabsTrigger key={tab} value={tab} className="px-7 py-3 rounded-[16px] text-[hsl(253,28%,40%)] data-[state=active]:text-[hsl(253,100%,64%)] data-[state=active]:bg-white data-[state=active]:shadow-[0_4px_20px_hsl(253,100%,64%,0.3),inset_0_1px_0_white] transition-all duration-200 font-semibold hover:text-[hsl(253,100%,64%)] border-2 border-transparent data-[state=active]:border-[hsl(253,100%,64%)]">
                  {tab}
                </TabsTrigger>)}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {/* Recent documents grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-[hsl(253,47%,18%)]">{activeTab}</h2>
                </div>
                
                <div className="grid grid-cols-4 gap-6">
                  {activeTab === 'Recents' ? recentDocs.map((doc, index) => <div key={index} className="group relative aspect-[3/4] rounded-[22px] overflow-hidden border-[3px] border-[hsl(253,80%,88%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_hsl(253,100%,64%,0.12)] hover:shadow-[0_0_40px_hsl(253,100%,64%,0.35),0_12px_40px_hsl(253,100%,64%,0.3)]">
                        <button onClick={() => handleOpenRecent(doc.id)} className="w-full h-full">
                          <div className="w-full h-full bg-white p-8 overflow-hidden flex flex-col">
                            <div className="text-left text-[15px] leading-relaxed text-[hsl(253,47%,18%)] whitespace-pre-line font-serif line-clamp-[20]">
                              {doc.thumbnail}
                            </div>
                          </div>
                        </button>
                        
                        {/* Three-dot menu */}
                        <Popover open={openMenuId === doc.id} onOpenChange={(open) => setOpenMenuId(open ? doc.id : null)}>
                          <PopoverTrigger asChild>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              className={`absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(253,100%,64%)] to-[hsl(266,100%,70%)] ${openMenuId === doc.id ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100 hover:scale-110'} hover:shadow-[0_0_20px_hsl(253,100%,64%,0.8)] transition-all duration-200 flex items-center justify-center z-50`}
                            >
                              <MoreVertical className="w-5 h-5 text-white" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent 
                            className="w-48 p-2 bg-[hsl(253,100%,98%)] border-2 border-[hsl(253,80%,85%)] rounded-2xl shadow-[0_8px_32px_hsl(253,100%,64%,0.25)] z-[100]"
                            sideOffset={8}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {renamingId === doc.id ? (
                              <div className="p-2 space-y-2">
                                <Input
                                  value={newName}
                                  onChange={(e) => setNewName(e.target.value)}
                                  placeholder="New name"
                                  className="text-sm"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRenameDocument(doc.id);
                                    if (e.key === 'Escape') {
                                      setRenamingId(null);
                                      setNewName('');
                                    }
                                  }}
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleRenameDocument(doc.id)} className="flex-1 text-xs bg-[hsl(253,100%,64%)]">Save</Button>
                                  <Button size="sm" variant="outline" onClick={() => {
                                    setRenamingId(null);
                                    setNewName('');
                                  }} className="flex-1 text-xs">Cancel</Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <button
                                  onClick={() => {
                                    setRenamingId(doc.id);
                                    setNewName(doc.title);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[hsl(253,47%,18%)] hover:bg-[hsl(253,100%,64%,0.15)] rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Rename
                                </button>
                                <button
                                  onClick={() => handleDuplicateDocument(doc)}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[hsl(253,47%,18%)] hover:bg-[hsl(253,100%,64%,0.15)] rounded-lg transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                  Make a Duplicate Copy
                                </button>
                                <button
                                  onClick={() => handleDeleteDocument(doc.id, doc.title)}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                        
                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <p className="text-white text-sm font-bold text-center truncate drop-shadow-md">
                            {doc.title}
                          </p>
                        </div>
                      </div>) : bookTemplates.map((template, index) => <button key={index} onClick={() => handleStartWriting()} className="group relative aspect-[3/4] rounded-[22px] overflow-hidden border-[3px] border-[hsl(253,80%,88%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_hsl(253,100%,64%,0.12)] hover:shadow-[0_0_40px_hsl(253,100%,64%,0.35),0_12px_40px_hsl(253,100%,64%,0.3)]">
                        {template.thumbnail === 'gradient' ? <div className="w-full h-full flex items-center justify-center" style={{
                    background: template.gradient
                  }}>
                            <h3 className="text-white text-2xl font-bold uppercase tracking-wider px-4 text-center drop-shadow-lg">
                              {template.name}
                            </h3>
                          </div> : template.thumbnail === 'image' ? <div className="w-full h-full flex items-center justify-center relative" style={{
                    backgroundColor: template.bgColor
                  }}>
                            {/* City lights effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[hsl(220,30%,20%)]"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[hsl(220,20%,10%)] to-transparent"></div>
                            {/* Scattered light dots for city lights */}
                            <div className="absolute inset-0">
                              {[...Array(30)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-70" style={{
                        left: `${Math.random() * 100}%`,
                        bottom: `${Math.random() * 40 + 10}%`,
                        boxShadow: '0 0 4px hsl(45 100% 70%)'
                      }}></div>)}
                            </div>
                            <h3 className="relative z-10 text-white text-2xl font-bold uppercase tracking-wider px-4 text-center drop-shadow-lg">
                              {template.name}
                            </h3>
                          </div> : <div className="w-full h-full bg-gradient-to-br from-white to-[hsl(253,100%,98%)] flex items-center justify-center">
                            <div className="text-[hsl(253,60%,88%)] text-6xl">📄</div>
                          </div>}
                        
                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm font-bold text-center truncate drop-shadow-md">
                            {template.name}
                          </p>
                        </div>
                      </button>)}
                </div>
              </div>

              {/* See all button and templates section - only show in Recents tab */}
              {activeTab === 'Recents' && <>
                  <div className="flex justify-center pt-6">
                    <button onClick={() => setIsTemplatesExpanded(!isTemplatesExpanded)} className="text-[hsl(253,28%,40%)] hover:text-[hsl(253,100%,64%)] font-semibold flex items-center gap-2 transition-all duration-200">
                      See All Templates
                      <svg className={`w-5 h-5 transition-transform duration-200 ${isTemplatesExpanded ? 'rotate-180' : 'rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Template options below See All */}
                  {isTemplatesExpanded && <div className="grid grid-cols-4 gap-6 pt-6">
                    {bookTemplates.map((template, index) => <button key={index} onClick={() => handleStartWriting()} className="group relative aspect-[3/4] rounded-[22px] overflow-hidden border-[3px] border-[hsl(253,80%,88%)] hover:border-[hsl(253,100%,64%)] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_hsl(253,100%,64%,0.12)] hover:shadow-[0_0_40px_hsl(253,100%,64%,0.35),0_12px_40px_hsl(253,100%,64%,0.3)]">
                        {template.thumbnail === 'gradient' ? <div className="w-full h-full flex items-center justify-center" style={{
                    background: template.gradient
                  }}>
                            <h3 className="text-white text-2xl font-bold uppercase tracking-wider px-4 text-center drop-shadow-lg">
                              {template.name}
                            </h3>
                          </div> : template.thumbnail === 'image' ? <div className="w-full h-full flex items-center justify-center relative" style={{
                    backgroundColor: template.bgColor
                  }}>
                            {/* City lights effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[hsl(220,30%,20%)]"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[hsl(220,20%,10%)] to-transparent"></div>
                            {/* Scattered light dots for city lights */}
                            <div className="absolute inset-0">
                              {[...Array(30)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-70" style={{
                        left: `${Math.random() * 100}%`,
                        bottom: `${Math.random() * 40 + 10}%`,
                        boxShadow: '0 0 4px hsl(45 100% 70%)'
                      }}></div>)}
                            </div>
                            <h3 className="relative z-10 text-white text-2xl font-bold uppercase tracking-wider px-4 text-center drop-shadow-lg">
                              {template.name}
                            </h3>
                          </div> : <div className="w-full h-full bg-gradient-to-br from-white to-[hsl(253,100%,98%)] flex items-center justify-center">
                            <div className="text-[hsl(253,60%,88%)] text-6xl">📄</div>
                          </div>}
                        
                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm font-bold text-center truncate drop-shadow-md">
                            {template.name}
                          </p>
                        </div>
                      </button>)}
                    </div>}
                </>}
            </TabsContent>
          </Tabs>}
          </div>
        )}
      </div>
    </div>;
};
export default Home;
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Cloud, Pen, ArrowUpDown, ChevronDown, FileText, ArrowLeft, MoreVertical, BookOpen } from "lucide-react";
import leftFlower from "@/assets/left-flower.png";
import leftSilhouette from "@/assets/left-silhouette.png";
import rightSilhouette from "@/assets/right-silhouette.png";
import purpleStar from "@/assets/purple-star.png";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface RecentDocument {
  id: string;
  title: string;
  thumbnail?: string;
  lastOpened: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromEditor = searchParams.get("from") === "editor";
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [activeTab, setActiveTab] = useState("recents");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    // Load recent documents from localStorage
    const stored = localStorage.getItem("recentDocuments");
    if (stored) {
      const docs = JSON.parse(stored) as RecentDocument[];
      // Ensure "Insects" document exists and is first
      const insectsDoc = docs.find((doc) => doc.id === "insects-document");
      const defaultInsectsContent = `Insects

Arthropods

Insects are an ind-isub sclass units of the class Hexapoda – In from novellisms them from other arthropods by their three-part body, compound eyes, and external skeleton, in an abusant serza.`;

      if (insectsDoc) {
        insectsDoc.title = "Insects";
        if (!insectsDoc.thumbnail) {
          insectsDoc.thumbnail = defaultInsectsContent;
        }
        const otherDocs = docs.filter((doc) => doc.id !== "insects-document");
        const sortedDocs = [insectsDoc, ...otherDocs.sort((a, b) => b.lastOpened - a.lastOpened)];
        localStorage.setItem("recentDocuments", JSON.stringify(sortedDocs));
        setRecentDocs(sortedDocs.slice(0, 4));
      } else {
        // Add Insects document
        const defaultDoc: RecentDocument = {
          id: "insects-document",
          title: "Insects",
          thumbnail: defaultInsectsContent,
          lastOpened: Date.now(),
        };
        const sortedDocs = [defaultDoc, ...docs.sort((a, b) => b.lastOpened - a.lastOpened)];
        localStorage.setItem("recentDocuments", JSON.stringify(sortedDocs));
        setRecentDocs(sortedDocs.slice(0, 4));
      }
    } else {
      // Initialize with default "Insects" document
      const defaultInsectsContent = `Insects

Arthropods

Insects are an ind-isub sclass units of the class Hexapoda – In from novellisms them from other arthropods by their three-part body, compound eyes, and external skeleton, in an abusant serza.`;
      const defaultDoc: RecentDocument = {
        id: "insects-document",
        title: "Insects",
        thumbnail: defaultInsectsContent,
        lastOpened: Date.now(),
      };
      localStorage.setItem("recentDocuments", JSON.stringify([defaultDoc]));
      setRecentDocs([defaultDoc]);
    }
  }, []);

  const handleStartWriting = () => {
    navigate("/editor");
  };

  const handleOpenRecent = (docId: string) => {
    navigate(`/editor?doc=${docId}`);
  };

  const handleDuplicateDocument = (doc: RecentDocument) => {
    setOpenMenuId(null);
    const stored = localStorage.getItem("recentDocuments");
    if (stored) {
      const docs = JSON.parse(stored) as RecentDocument[];
      const newDoc: RecentDocument = {
        id: crypto.randomUUID(),
        title: `${doc.title} (Copy)`,
        thumbnail: doc.thumbnail,
        lastOpened: Date.now(),
      };
      const updatedDocs = [newDoc, ...docs];
      localStorage.setItem("recentDocuments", JSON.stringify(updatedDocs));
      setRecentDocs(updatedDocs.slice(0, 4));
      toast.success("Document duplicated");
    }
  };

  const handleDeleteDocument = (docId: string, docTitle: string) => {
    setOpenMenuId(null);
    setTimeout(() => {
      if (!confirm(`Delete "${docTitle}"?`)) return;
      const stored = localStorage.getItem("recentDocuments");
      if (stored) {
        const docs = JSON.parse(stored) as RecentDocument[];
        const updatedDocs = docs.filter((doc) => doc.id !== docId);
        localStorage.setItem("recentDocuments", JSON.stringify(updatedDocs));
        setRecentDocs(updatedDocs.slice(0, 4));
        toast.success("Document deleted");
      }
    }, 100);
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Radial gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#a88fff] via-[#8f6eff] to-[#6e3fff]" />
      
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Left girl silhouette with flowers */}
        <div className="absolute left-0 top-[10%] w-[300px] h-[400px]">
          <img 
            src={leftSilhouette} 
            alt="" 
            className="absolute inset-0 w-full h-full object-contain opacity-40"
          />
          <img 
            src={leftFlower} 
            alt="" 
            className="absolute left-[20px] top-[30px] w-[180px] h-[180px] object-contain opacity-50"
          />
        </div>

        {/* Right girl silhouette */}
        <div className="absolute right-0 top-[5%] w-[350px] h-[450px]">
          <img 
            src={rightSilhouette} 
            alt="" 
            className="w-full h-full object-contain opacity-40"
          />
        </div>

        {/* Left stars cluster */}
        <div className="absolute left-[40px] bottom-[100px] flex flex-col gap-3">
          <img src={purpleStar} alt="" className="w-[100px] h-[100px] opacity-80" />
          <img src={purpleStar} alt="" className="w-[60px] h-[60px] opacity-60 ml-4" />
          <img src={purpleStar} alt="" className="w-[45px] h-[45px] opacity-50 ml-2" />
          <img src={purpleStar} alt="" className="w-[35px] h-[35px] opacity-40 ml-1" />
        </div>

        {/* Right star with ESTHER text */}
        <div className="absolute right-[90px] top-[40%] -translate-y-1/2">
          <div className="relative">
            <img src={purpleStar} alt="" className="w-[130px] h-[130px]" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg tracking-wider">
              ESTHER
            </span>
          </div>
        </div>

        {/* Right side icons */}
        <div className="absolute right-[70px] top-[20%] w-[90px] h-[90px] rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
          <FileText className="w-12 h-12 text-[#8f6eff]" />
        </div>
        <div className="absolute right-[70px] bottom-[25%] w-[90px] h-[90px] rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-[#8f6eff]" />
        </div>

        {/* Scattered small stars */}
        <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-white/40 rounded-full" />
        <div className="absolute top-[25%] right-[25%] w-2 h-2 bg-white/40 rounded-full" />
        <div className="absolute top-[60%] left-[30%] w-2 h-2 bg-white/40 rounded-full" />
        <div className="absolute bottom-[30%] right-[40%] w-2 h-2 bg-white/40 rounded-full" />
        <div className="absolute top-[15%] left-[45%] w-1.5 h-1.5 bg-white/30 rounded-full" />
        <div className="absolute bottom-[20%] left-[20%] w-1.5 h-1.5 bg-white/30 rounded-full" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top left button */}
        <div className="absolute top-6 left-6">
          {fromEditor ? (
            <button
              onClick={() => navigate("/editor")}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Editor</span>
            </button>
          ) : (
            <button className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all">
              <Sparkles className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Hero section */}
        <div className="flex-1 flex flex-col items-center justify-start pt-12">
          {/* Logo with gradient circle */}
          <div className="relative mb-5">
            <div className="w-28 h-28 rounded-full bg-gradient-to-b from-[#cbb8ff] to-[#6e3fff] shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center">
              <span className="text-6xl text-white">∞</span>
            </div>
          </div>

          {/* Title and tagline */}
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            Doc One
          </h1>
          <p className="text-white/80 text-sm mb-5 tracking-wide">
            Create. Teach. Publish. Evolve.
          </p>

          {/* Start Writing button */}
          <button
            onClick={handleStartWriting}
            className="bg-gradient-to-r from-[#8f6eff] to-[#b893ff] text-white px-7 py-2.5 rounded-full font-bold text-base shadow-[0_0_15px_rgba(190,150,255,0.6)] hover:shadow-[0_0_25px_rgba(190,150,255,0.8)] transition-all hover:scale-105 mb-1.5"
          >
            Start Writing
          </button>

          {/* Choose template text */}
          <p className="text-white/80 text-sm mb-1">Choose Your Template.</p>

          {/* Down arrow */}
          <div className="mb-9 animate-bounce">
            <ChevronDown className="w-5 h-5 text-white/70" />
          </div>

          {/* Categories and content */}
          {fromEditor ? (
            <div className="w-full max-w-4xl px-8">
              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
                <h2 className="text-3xl font-bold text-[#1a0b3d] mb-6">Recent Documents</h2>
                {recentDocs.length === 0 ? (
                  <p className="text-white/70 text-center py-8">No recent documents found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentDocs.map((doc) => (
                      <div key={doc.id} className="relative group">
                        <div
                          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border-2 border-white/30 hover:border-white/50 transition-all cursor-pointer h-40 flex flex-col items-center justify-center relative"
                          onClick={() => handleOpenRecent(doc.id)}
                        >
                          {doc.thumbnail ? (
                            <div className="w-full h-24 rounded-lg bg-white/10 mb-2 flex items-center justify-center p-2 overflow-hidden">
                              <p className="text-xs text-white/60 line-clamp-4">{doc.thumbnail}</p>
                            </div>
                          ) : (
                            <div className="w-full h-24 rounded-lg bg-white/10 mb-2" />
                          )}
                          <p className="text-white text-sm font-medium text-center truncate w-full">{doc.title}</p>
                        </div>

                        {/* Three-dot menu */}
                        <Popover open={openMenuId === doc.id} onOpenChange={(open) => setOpenMenuId(open ? doc.id : null)}>
                          <PopoverTrigger asChild>
                            <button
                              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(253,100%,64%)] to-[hsl(266,100%,70%)] shadow-[0_0_10px_rgba(139,112,247,0.4)] flex items-center justify-center hover:shadow-[0_0_15px_rgba(139,112,247,0.6)] z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4 text-white" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 bg-[#f5edff] border-[#e8defc] p-1" align="end">
                            <button
                              className="w-full text-left px-3 py-2 text-[#3B2061] hover:bg-[#8B70F7] hover:text-white rounded-md transition-colors text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateDocument(doc);
                              }}
                            >
                              Make a Duplicate Copy
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-[#3B2061] hover:bg-[#8B70F7] hover:text-white rounded-md transition-colors text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDocument(doc.id, doc.title);
                              }}
                            >
                              Delete
                            </button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-5xl px-8">
              {/* Categories tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-center mb-9">
                  <TabsList className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20">
                    <TabsTrigger 
                      value="recents" 
                      className="text-[#e5d9ff] data-[state=active]:bg-transparent data-[state=active]:text-white rounded-xl px-6 py-2 font-medium transition-all"
                    >
                      Recents
                    </TabsTrigger>
                    <TabsTrigger 
                      value="basic" 
                      className="text-[#e5d9ff] data-[state=active]:bg-transparent data-[state=active]:text-white rounded-xl px-6 py-2 font-medium transition-all"
                    >
                      Basic
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reports" 
                      className="text-[#e5d9ff] data-[state=active]:bg-transparent data-[state=active]:text-white rounded-xl px-6 py-2 font-medium transition-all"
                    >
                      Reports
                    </TabsTrigger>
                    <TabsTrigger 
                      value="books" 
                      className="text-[#e5d9ff] data-[state=active]:bg-transparent data-[state=active]:text-white rounded-xl px-6 py-2 font-medium transition-all"
                    >
                      Books
                    </TabsTrigger>
                    <TabsTrigger 
                      value="studyBooks" 
                      className="text-[#e5d9ff] data-[state=active]:bg-transparent data-[state=active]:text-white rounded-xl px-6 py-2 font-medium transition-all"
                    >
                      Study Books
                    </TabsTrigger>
                    <TabsTrigger 
                      value="letters" 
                      className="text-[#e5d9ff] data-[state=active]:bg-transparent data-[state=active]:text-white rounded-xl px-6 py-2 font-medium transition-all"
                    >
                      Letters
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="recents" className="mt-0">
                  <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
                    <h2 className="text-2xl font-semibold text-[#1a0b3d] mb-6">Recents</h2>
                    {recentDocs.length === 0 ? (
                      <p className="text-white/70 text-center py-8">No recent documents found.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {recentDocs.map((doc) => (
                          <div key={doc.id} className="relative group">
                            <div
                              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border-2 border-[#c5aeff]/40 hover:border-[#c5aeff]/70 transition-all cursor-pointer h-40 flex flex-col items-center justify-center relative"
                              onClick={() => handleOpenRecent(doc.id)}
                            >
                              {doc.thumbnail ? (
                                <div className="w-full h-24 rounded-lg bg-white mb-2 flex items-center justify-center p-2 overflow-hidden">
                                  <p className="text-xs text-gray-600 line-clamp-4">{doc.thumbnail}</p>
                                </div>
                              ) : (
                                <div className="w-full h-24 rounded-lg bg-white mb-2" />
                              )}
                              <p className="text-[#1a0b3d] text-sm font-medium text-center truncate w-full">{doc.title}</p>
                            </div>

                            {/* Three-dot menu */}
                            <Popover open={openMenuId === doc.id} onOpenChange={(open) => setOpenMenuId(open ? doc.id : null)}>
                              <PopoverTrigger asChild>
                                <button
                                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(253,100%,64%)] to-[hsl(266,100%,70%)] shadow-[0_0_10px_rgba(139,112,247,0.4)] flex items-center justify-center hover:shadow-[0_0_15px_rgba(139,112,247,0.6)] z-10"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-4 h-4 text-white" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48 bg-[#f5edff] border-[#e8defc] p-1" align="end">
                                <button
                                  className="w-full text-left px-3 py-2 text-[#3B2061] hover:bg-[#8B70F7] hover:text-white rounded-md transition-colors text-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateDocument(doc);
                                  }}
                                >
                                  Make a Duplicate Copy
                                </button>
                                <button
                                  className="w-full text-left px-3 py-2 text-[#3B2061] hover:bg-[#8B70F7] hover:text-white rounded-md transition-colors text-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDocument(doc.id, doc.title);
                                  }}
                                >
                                  Delete
                                </button>
                              </PopoverContent>
                            </Popover>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-center">
                      <button className="text-[#1a0b3d] font-medium text-lg hover:text-[#2a1a5d] transition-colors">
                        See All Templates ›
                      </button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="basic" className="mt-0">
                  <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
                    <h2 className="text-2xl font-semibold text-[#1a0b3d] mb-6">Basic Templates</h2>
                    <p className="text-white/70 text-center py-8">Basic templates coming soon...</p>
                  </div>
                </TabsContent>

                <TabsContent value="reports" className="mt-0">
                  <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
                    <h2 className="text-2xl font-semibold text-[#1a0b3d] mb-6">Reports</h2>
                    <p className="text-white/70 text-center py-8">Report templates coming soon...</p>
                  </div>
                </TabsContent>

                <TabsContent value="books" className="mt-0">
                  <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
                    <h2 className="text-2xl font-semibold text-[#1a0b3d] mb-6">Books</h2>
                    <p className="text-white/70 text-center py-8">Book templates coming soon...</p>
                  </div>
                </TabsContent>

                <TabsContent value="studyBooks" className="mt-0">
                  <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
                    <h2 className="text-2xl font-semibold text-[#1a0b3d] mb-6">Study Books</h2>
                    <p className="text-white/70 text-center py-8">Study book templates coming soon...</p>
                  </div>
                </TabsContent>

                <TabsContent value="letters" className="mt-0">
                  <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.08)]">
                    <h2 className="text-2xl font-semibold text-[#1a0b3d] mb-6">Letters</h2>
                    <p className="text-white/70 text-center py-8">Letter templates coming soon...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Bottom right buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-20">
          <button
            onClick={() => navigate("/?from=editor")}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <Cloud className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={handleStartWriting}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <Pen className="w-5 h-5 text-white" />
          </button>

          <button
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ArrowUpDown className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
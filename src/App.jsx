import { useState } from "react";
import Triage from "./components/Triage";
import ThreatIntel from "./components/ThreatIntel";
import KnowledgeBase from "./components/KnowledgeBase";
import Ticketing from "./components/Ticketing";
import CVELookup from "./components/CVELookup";

const tabs = ["Triage", "Threat Intel", "Knowledge Base", "Ticketing", "CVE Lookup"];

function App() {
  const [activeTab, setActiveTab] = useState("Triage");

  const renderContent = () => {
    switch (activeTab) {
      case "Triage":
        return <Triage />;
      case "Threat Intel":
        return <ThreatIntel />;
      case "Knowledge Base":
        return <KnowledgeBase />;
      case "Ticketing":
        return <Ticketing />;
      case "CVE Lookup":
        return <CVELookup />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Third Space</h1>
      
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-blue-600 border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded shadow">{renderContent()}</div>
    </div>
  );
}

export default App;

import { useState } from "react";
import Triage from "./components/Triage";
import ThreatIntel from "./components/ThreatIntel";
import KnowledgeBase from "./components/KnowledgeBase";
import Ticketing from "./components/Ticketing";
import CVELookup from "./components/CVELookup";
import { FaBug, FaBrain, FaBook, FaTicketAlt, FaSearch } from "react-icons/fa";

const tabs = [
  { name: "Triage", icon: <FaBug /> },
  { name: "Threat Intel", icon: <FaBrain /> },
  { name: "Knowledge Base", icon: <FaBook /> },
  { name: "Ticketing", icon: <FaTicketAlt /> },
  { name: "CVE Lookup", icon: <FaSearch /> },
];

export default function App() {
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
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="py-6 px-4 border-b border-gray-800 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Third Space Security Copilot</h1>
        <p className="text-gray-400 mt-2 text-sm">AI-powered assistant for faster, smarter security operations</p>
      </header>

      <nav className="flex justify-center gap-4 mt-6 flex-wrap px-4">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 
              ${
                activeTab === tab.name
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>

      <main className="mt-8 px-4 max-w-5xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

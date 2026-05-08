import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (text.trim() === "") {
      setMessage("Please enter a search query");
      return;
    }

    setLoading(true);
    setMessage("");
    setResults([]);

    try {
      const response = await axios.post("http://localhost:8000/generate", {
        query: text,
      });

      if (response.data.success) {
        setResults(response.data.results);
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      setMessage("Could not connect to server");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-start px-4 py-15">
      <div className="w-full max-w-2xl bg-white shadow-2xl">


        <div className="px-12 pt-12 pb-9  border-neutral-800 relative">


          <h1 className="text-4xl font-bold text-black leading-tight mb-2 tracking-tight">
            Legal Assistant Portal
          </h1>
          <p className="text-neutral-500 text-sm font-light tracking-wide">
            Search through legal documents and view summaries.
          </p>
        </div>


        <div className="px-11 pt-6 pb-12">


          <div className="flex gap-2 mb-7 ">
            <input
              type="text"
              placeholder="Search legal topic..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-white border outline-none px-5 py-4 text-sm text-black placeholder-neutral-600 font-light"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-800 text-white px-6 py-4 text-xs font-semibold tracking-widest uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              Search
            </button>
          </div>


          {loading && (
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <p className="text-yellow-500 text-sm font-light tracking-wide">
                Searching documents...
              </p>
            </div>
          )}


          {message && (
            <p className="text-red-400 text-sm font-light mb-5 px-4 py-3 border-l-2 border-red-500 bg-red-500/5">
              {message}
            </p>
          )}


          {results.length > 0 && (
            <>
              <div className="h-px bg-white mb-6" />
              <p className="text-xs tracking-widest uppercase text-neutral-600 mb-4">
                {results.length} Result{results.length > 1 ? "s" : ""} Found
              </p>
              <div className="flex flex-col gap-4">
                {results.map((item, index) => (
                  <div
                    key={index}
                    className="border border-neutral-800 bg-white-200 mb-6 px-6 py-5 relative group"
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <h3 className="text-base font-semibold text-stone-200 mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed font-light">
                      {item.summary}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
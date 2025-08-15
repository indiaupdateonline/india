// Supabase credentials
const SUPABASE_URL = "https://frnzwjwdlymvxzjnbzfn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybnp3andkbHltdnh6am5iemZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzY5MDksImV4cCI6MjA3MDg1MjkwOX0.HbfY-_PPhXYXccmqjqBrIQm4LGcItzDre3rbLQACb5o";

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch states and display
async function loadStates() {
    const { data, error } = await supabase
        .from("states") // यहां अपनी टेबल का नाम डालें
        .select("*");

    if (error) {
        console.error("Error fetching data:", error);
        document.getElementById("states-list").innerHTML = "<p>Error loading data</p>";
        return;
    }

    const container = document.getElementById("states-list");
    container.innerHTML = "";
    data.forEach(state => {
        const card = document.createElement("div");
        card.className = "state-card";
        card.innerHTML = `<h2>${state.name}</h2><p>${state.description || "No details available"}</p>`;
        container.appendChild(card);
    });
}

// Load on page start
loadStates();
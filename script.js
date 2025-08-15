// Supabase से कनेक्ट
const { createClient } = supabase;

const SUPABASE_URL = "https://frnzwjwdlymvxzjnbzfn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybnp3andkbHltdnh6am5iemZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzY5MDksImV4cCI6MjA3MDg1MjkwOX0.HbfY-_PPhXYXccmqjqBrIQm4LGcItzDre3rbLQACb5o";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// URL से state पढ़ना
const params = new URLSearchParams(window.location.search);
const stateName = params.get("state");

// डेटा लोड करना
async function loadCurrentAffairs() {
    if (!stateName) {
        document.getElementById("content").innerHTML = "<p>No state selected.</p>";
        return;
    }

    const { data, error } = await supabaseClient
        .from("current_affairs")
        .select("*")
        .eq("state", stateName)
        .order("date", { ascending: false });

    if (error) {
        console.error("Error fetching data:", error);
        document.getElementById("content").innerHTML = `<p>Error: ${error.message}</p>`;
        return;
    }

    if (!data.length) {
        document.getElementById("content").innerHTML = "<p>No current affairs found.</p>";
        return;
    }

    let html = "";
    data.forEach(row => {
        html += `
            <div class="affair">
                <h3>${row.title}</h3>
                <p>${row.description}</p>
                <small>${new Date(row.date).toLocaleDateString()}</small>
            </div>
        `;
    });

    document.getElementById("content").innerHTML = html;
}

loadCurrentAffairs();
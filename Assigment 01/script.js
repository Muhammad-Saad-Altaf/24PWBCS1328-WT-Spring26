let events = [
  {
    name: "Web Development Workshop",
    date: "2026-06-20",
    description: "Learn modern web development.",
  },
  {
    name: "Tech Conference",
    date: "2026-07-15",
    description: "Annual technology conference.",
  },
  {
    name: "AI Seminar",
    date: "2025-05-01",
    description: "Introduction to Artificial Intelligence.",
  },
];

const eventList = document.getElementById("event-list");
const form = document.getElementById("eventForm");
const searchInput = document.getElementById("searchInput");
const warning = document.getElementById("warning");

function displayEvents(filteredEvents = events) {
  eventList.innerHTML = "";

  filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  filteredEvents.forEach((event, index) => {
    const card = document.createElement("div");

    const today = new Date();
    const eventDate = new Date(event.date);

    card.classList.add("event-card");

    if (eventDate < today) {
      card.classList.add("past");
    } else {
      card.classList.add("upcoming");
    }

    card.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p>${event.description}</p>
            <button onclick="deleteEvent(${index})">
                Delete
            </button>
        `;

    eventList.appendChild(card);
  });
}

function deleteEvent(index) {
  events.splice(index, 1);
  displayEvents();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("eventName").value.trim();

  const date = document.getElementById("eventDate").value;

  const description = document.getElementById("eventDescription").value.trim();

  if (name === "" || date === "" || description === "") {
    warning.textContent = "Please fill all fields.";
    return;
  }

  warning.textContent = "";

  events.push({
    name,
    date,
    description,
  });

  displayEvents();

  form.reset();
});

searchInput.addEventListener("keyup", () => {
  const search = searchInput.value.toLowerCase();

  const filtered = events.filter(
    (event) =>
      event.name.toLowerCase().includes(search) || event.date.includes(search),
  );

  displayEvents(filtered);
});

displayEvents();

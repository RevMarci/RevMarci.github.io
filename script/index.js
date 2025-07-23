const form = document.getElementById("chatForm");
const input = document.getElementById("questionInput");

const baseUrl = "https://portfolio-backend-k1ed.onrender.com";

var messages = [
    {
        role: "system",
        content: "Mindig rövid, tömör, lényegretörő választ adj!",
    },
];

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const value = input.value;
    messages.push({ role: "user", content: value });

    console.log("Sent messages:", messages);
    addMessage(value, "user");

    try {
        const response = await fetch(`${baseUrl}/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messages),
        });

        const data = await response.json();
        messages.push({ role: "assistant", content: data.answer });

        console.log("Received messages:", messages);
        addMessage(data.answer, "ai");
    } catch (error) {
        console.error("Hiba történt:", error);
    }
});

function addMessage(message, side) {
    document.getElementById(
        "chat"
    ).innerHTML += `<div class="${side}"><p>${message}</p></div>`;
}

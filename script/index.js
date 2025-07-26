const form = document.getElementById('chatForm');
const input = document.getElementById('questionInput');

// const baseUrl = "https://portfolio-backend-k1ed.onrender.com";
const baseUrl = 'http://localhost:3000';

var messages = [
    {
        role: 'system',
        content: 'Mindig rövid, tömör, lényegretörő választ adj!',
    },
    {
        role: 'assistant',
        content:
            'Szia! Én én egy AI chatbot vagyok akinek megvan minden tanítva Marciról! Ha mármi kérdésed van róla, akkor tedd fel és én válaszolok!',
    },
];

// Run on page loading to wake up the backend
(async () => {
    try {
        const response = await fetch(`${baseUrl}/wake`, {
            method: 'GET',
        });

        const data = await response.json();
        const serverMessage = data.message;
        console.log(serverMessage);

        if (serverMessage === 'Server is awake.') {
            addAiMessage(messages[1].content, 'ai');
        }
    } catch (error) {
        console.log(`Error on wake up: ${error}`);
    }
})();

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const value = input.value;
    messages.push({ role: 'user', content: value });

    console.log('Sent messages:', messages);
    addUserMessage(value, 'user');

    try {
        const response = await fetch(`${baseUrl}/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
        });

        const data = await response.json();
        messages.push({ role: 'assistant', content: data.answer });

        console.log('Received messages:', messages);
        addAiMessage(data.answer, 'ai');
    } catch (error) {
        console.error('Hiba történt:', error);
    }
});

function addUserMessage(message) {
    document.getElementById(
        'chat'
    ).innerHTML += `<div class="user"><p>${message}</p></div>`;
}

function addAiMessage(message) {
    const typeSpeed = 30;

    const chat = document.getElementById('chat');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai';

    const p = document.createElement('p');
    messageDiv.appendChild(p);
    chat.appendChild(messageDiv);

    let i = 0;
    function type() {
        if (i < message.length) {
            p.textContent += message.charAt(i);
            i++;
            setTimeout(type, typeSpeed);
        }
    }

    type();
}

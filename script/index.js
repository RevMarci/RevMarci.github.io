const form = document.getElementById('chatForm');
const input = document.getElementById('questionInput');
const inputButton = document.getElementById('inputButton');

const baseUrl = 'https://portfolio-backend-k1ed.onrender.com';

const firstBotMessage =
    'Szia! Én én egy AI chatbot vagyok akinek megvan minden tanítva Marciról! Ha bármi kérdésed van róla, akkor tedd fel és én válaszolok!';
var messages = [];

// Run on page loading to wake up the backend
wakeUp();

async function wakeUp() {
    console.log('Wakeing up the backend...');

    messages.push({ role: 'system', content: systemPrompt }); // systemPrompt is saved in another file

    try {
        const response = await fetch(`${baseUrl}/wake`, {
            method: 'GET',
        });

        const data = await response.json();
        const serverMessage = data.message;
        console.log(serverMessage);

        messages.push({ role: 'assistant', content: firstBotMessage });
        addAiMessage(firstBotMessage, 'ai');
        enableChatButton();
    } catch (error) {
        console.log(`Error on wake up: ${error}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before another try
        console.log('Another try...');
        wakeUp();
    }
}

form.addEventListener('submit', async function (e) {
    disableChatButton();
    e.preventDefault();
    const value = input.value;
    input.value = '';
    messages.push({ role: 'user', content: value });

    console.log('Sent messages:', messages);
    addUserMessage(value, 'user');

    const response = await callOpenRouter();
    messages.push({ role: 'assistant', content: response });
    console.log('Received messages:', messages);
    addAiMessage(response, 'ai');
    enableChatButton();
});

async function callOpenRouter(calls = 1) {
    console.log('Call OpenRouter...', calls);
    try {
        const response = await fetch(`${baseUrl}/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
        });

        const data = await response.json();

        if (data.answer === undefined) {
            console.log(`OpenRouter response was undefined.`);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before another try
            console.log('Try again...', calls + 1);

            return await callOpenRouter(calls + 1);
        }

        console.log('Successful OpenRouter call!');
        return data.answer;
    } catch (error) {
        console.log(`Error on OpenRouter call: ${error}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before another try
        if (calls >= 5) {
            return 'Sajnos valamilyen probléma van az AI szolgáltatójával... Próbálja újra később.';
        }
        console.log('Try again...', calls + 1);

        return await callOpenRouter(calls + 1);
    }
}

function addUserMessage(message) {
    document.getElementById('chat').innerHTML += `<div class="user"><p>${message}</p></div>`;
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

function disableChatButton() {
    inputButton.setAttribute('disabled', '');
    inputButton.classList.add('disabled');
}

function enableChatButton() {
    inputButton.removeAttribute('disabled');
    inputButton.classList.remove('disabled');
}

// For nav bar in mobile view
const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('nav');
const timeLines = document.querySelectorAll('.timeline-item');
hamMenu.addEventListener('click', () => {
    hamMenu.classList.toggle('active');
    offScreenMenu.classList.toggle('active');

    timeLines.forEach((item) => {
        item.classList.toggle('active');
    });
});

document.addEventListener('click', async function (event) {
    const target = event.target;
    if (target.tagName === 'A') {
        await fetch(`${baseUrl}/click`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: target.href }),
        });
    }
});

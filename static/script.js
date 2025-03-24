document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('sendButton');
    const input = document.getElementById('inputField');
    const responseText = document.getElementById('response');

    button.addEventListener('click', async () => {
        const userInput = input.value;

        const res = await fetch('http://127.0.0.1:5000/api/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: userInput })
        });

        const data = await res.json();
        responseText.textContent = data.message;
    });
});

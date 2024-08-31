const input = document.querySelector('input')
const output = document.querySelector('output')
const errorOutput = document.querySelector('output.err')

if (!('ai' in window)) {
    errorOutput.innerText = 'Error: AI API is not supported by this browser. Please use Chrome Canary.'
} else {
    try {
        const session = await ai.assistant.create({
            monitor(m) {
                m.addEventListener("downloadprogress", e => {
                    console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                });
            }

        });
        console.log(session)

        session.prompt('yes, or no?')

        input.addEventListener('input', e => {
            console.log(input.value)
            if (input.value.endsWith('?')) {
                session.prompt(input.value)
                    .then(value => output.innerText = value)
            }
        })

    } catch (e) {
        errorOutput.innerText = `Error: ${e.message}`
    }
}

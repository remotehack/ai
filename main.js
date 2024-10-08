const input = document.querySelector('input')
const output = document.querySelector('output')
const errorOutput = document.querySelector('output.err')



if (!('ai' in window)) {
    errorOutput.innerText = 'Error: window.ai not found (needs Chrome Canary)'
} else {
    try {
        const session = await ai.assistant.create({
            monitor(m) {
                m.addEventListener("downloadprogress", e => {
                    errorOutput.innerText = `Downloaded ${e.loaded} of ${e.total} bytes.`
                });
            }
        });

        console.log(session)

        let current;

        let pending;

        async function requestLoop() {
            if (!pending) return setTimeout(requestLoop, 100)
            console.log("request: ", pending)
            const value = pending;

            pending = false// ready for more

            input.classList.add('requesting')

            try {
                current = new AbortController()

                const stream = await session.promptStreaming(value, { signal: current.signal })
                for await (const chunk of stream) {
                    console.log(chunk);
                    output.innerText = chunk;
                }

                current = null;

            } catch (e) {
                errorOutput.innerText = `err: ${e.message}`
            }

            input.classList.remove('requesting')

            return setTimeout(requestLoop, 1000)
        }

        requestLoop();


        let timer;
        function debounce() {
            clearTimeout(timer);

            input.classList.add('debounced')
            timer = setTimeout(() => {
                input.classList.remove('debounced');
                pending = input.value;
                current?.abort()
            }, 500);
        }

        // rather than debounce, a prioritised queue?


        input.addEventListener('input', e => {
            debounce()
        })

    } catch (e) {
        errorOutput.innerText = `Error: ${e.message}`
    }
}

// assessing a PR Description

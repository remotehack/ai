const input = document.querySelector('input')
const output = document.querySelector('output')


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
    output.className = 'err'
    output.innerText = `${e}`
}




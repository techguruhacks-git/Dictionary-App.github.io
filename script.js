const body = document.querySelector("body");
const ShowBtn = document.querySelector(".container");
const theme = document.querySelector(".theme-btn");
const HideBtn = document.querySelector(".content");
const container = document.querySelector(".container"),
    searchInput = container.querySelector("input"),
    infoText = container.querySelector(".info-text"),
    synonyms = container.querySelector(".synonyms .list"),
    closebtn = document.querySelector(".fa-material-icon"),
    volumeIcon = container.querySelector(".word i");
    
let audio;

function data(result, word) {
    if (result.title) {
        infoText.innerHTML = `Can't find the meaning of <span>${word}</span>. Please, try to search again.`;
    } else {
        console.log(result);
        container.classList.add("active");

        let meanings = result[0].meanings || [];
        let definitions = meanings.length > 0 ? meanings[0].definitions[0] : {};

        let partOfSpeech = meanings.length > 0 ? meanings[0].partOfSpeech : "N/A";
        let phonetics = result[0].phonetics && result[0].phonetics.length > 0
            ? result[0].phonetics[0].text
            : "N/A";

        document.querySelector(".word span").innerText = `${partOfSpeech} /${phonetics}/`;
        document.querySelector(".word p").innerText = searchInput.value;

        document.querySelector(".meaning span").innerText = definitions.definition || "No definition available";
        document.querySelector(".example span").innerText = definitions.example || "No example available";

        let audioUrl = result[0].phonetics && result[0].phonetics[0].audio;

        if (audioUrl && audioUrl.startsWith("http")) {
            audio = new Audio(audioUrl);
        } else {
            audio = null; 
        }

        synonyms.innerHTML = "";
        if (definitions.synonyms && definitions.synonyms.length > 0) {
            synonyms.parentElement.style.display = "block";
            for (let i = 0; i < Math.min(definitions.synonyms.length, 5); i++) {
                let tag = `<span onclick=search('${definitions.synonyms[i]}')>${definitions.synonyms[i]},</span>`;
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        } else {
            synonyms.parentElement.style.display = "none";
        }
    }
}

function search(word) {
    searchInput.value = word;
    fetchApi(word);
}

function fetchApi(word) {
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>${word}</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url)
        .then((res) => res.json())
        .then((result) => data(result, word))
        .catch((error) => {
            console.error("Error fetching data:", error);
            infoText.innerHTML = `Failed to fetch the meaning of <span>${word}</span>. Please try again later.`;
        });
}

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }
});

theme.addEventListener("click", () => {
    if (ShowBtn.style.background === "white") {
        ShowBtn.style.background = "#000";
        body.style.background = "white";
        body.style.color = "white";
    } else {
        ShowBtn.style.background = "white";
        body.style.background = "#000";
        body.style.color = "black";
    }
});

volumeIcon.addEventListener("click", () => {
    if (audio) {
        audio
            .play()
            .catch((error) => {
                console.error("Error playing audio:", error);
                alert("Audio playback failed. Please try again.");
            });
    } else {
        alert("Audio is not available for this word. Please search for another word.");
    }
});

closebtn.addEventListener("click", ()=>{
    location.reload();
});
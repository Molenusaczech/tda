function createNote() {
    let title = document.getElementById("title").value;
    let text = document.getElementById("text").value;
    let author = document.getElementById("author").value;
    let color = document.getElementById("color").value;

    naja.makeRequest('POST', '/', JSON.stringify(
        {
            "action": "create",
            "title": title,
            "text": text,
            "author": author,
            "color": color
        }), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
        console.log(response);
    });
}

function deleteNote(id) {

    if (!confirm("Opravdu chcete smazat poznámku?")) {
        return;
    }

    naja.makeRequest('POST', '/', JSON.stringify(
        {
            "action": "delete",
            "id": id
        }), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
        console.log(response);
        let container = document.querySelector("[data-id='" + id + "']");
        container.remove();
    });
}

function editNote(id) {
    let container = document.querySelector("[data-id='" + id + "']");
    let title = container.querySelector(".noteTitle").value;
    let text = container.querySelector(".noteText").value;
    let author = container.querySelector(".noteAutor").value;
    //let color = container.querySelector("").value;

    naja.makeRequest('POST', '/', JSON.stringify(
        {
            "action": "edit",
            "title": title,
            "text": text,
            "author": author,
            "color": "#FFFF00", //editing colors WIP
            "id": id
        }), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
        unfocusNote(id);
        customAlert("Poznámka byla upravena");
        console.log(response);
    });
}

function revertNote(id) {
    let container = document.querySelector("[data-id='" + id + "']");
    container.querySelector(".noteTitle").value = notes[id].title;
    container.querySelector(".noteText").value = notes[id].text;
    container.querySelector(".noteAutor").value = notes[id].author;
    unfocusNote(id);
}

function focusNote(id) {
    let container = document.querySelector("[data-id='" + id + "']");
    console.log("focusNote: " + id);
}

function unfocusNote(id) {
    let container = document.querySelector("[data-id='" + id + "']");
    console.log("unfocusNote: "+ id);
}

function customAlert(text) {
    let alert = document.getElementById("alert");
    document.getElementById("alert").querySelector(".alertText").innerHTML = text
    alert.style.display = "block";
}

function closeAlert() {
    let alert = document.getElementById("alert");
    alert.style.display = "none";
}
function createNote() {
    naja.makeRequest('POST', '/', JSON.stringify(
        {
            "action": "create",
            "title": "",
            "text": "",
            "author": "",
            "color": "#FFFF00"
        }), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
        console.log(response);
        let id = response.id;
        let addTo = document.getElementById("notes");
        let html = `<div class="container" data-id=${id}>
        <span class="title">
            <textarea maxlength="50" autocomplete="off" placeholder="Název vaší poznámky" class="noteTitle" onFocus=focusNote(${id})></textarea>
        </span>
        <span class="remove" onClick=deleteNote(${id})>X</span>
        <span class="text">
            <textarea autocomplete="off" maxlength="120" placeholder="Velice informaticní text vaší poznámky" class="noteText" onFocus=focusNote(${id})></textarea>
        </span>
<span class="name">
            <span class="part1">-</span>
            <textarea rows="1" class="part2 noteAutor" autocomplete="off" maxlength="25" placeholder="Vaše jméno" onFocus=focusNote(${id})></textarea>
        </span>

		<span class="undoChanges">
            <button class="edit" onClick=editNote(${id})>Edit</button>
        </span>
        <span class="saveChanges">
            <button class="revert" onClick=revertNote(${id})>Revert</button>
        </span>
    </div>`;


        addTo.insertAdjacentHTML('afterbegin', html);
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
        let container = document.querySelector("[data-id='" + id + "']");
        container.querySelector(".noteTitle").value = title;
        container.querySelector(".noteText").value = text;
        container.querySelector(".noteAutor").value = author;
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
    container.querySelector(".saveChanges").style.display = "block";
    container.querySelector(".undoChanges").style.display = "block";
    console.log("focusNote: " + id);
}

function unfocusNote(id) {
    let container = document.querySelector("[data-id='" + id + "']");
    container.querySelector(".saveChanges").style.display = "none";
    container.querySelector(".undoChanges").style.display = "none";
    console.log("unfocusNote: " + id);
}

function customAlert(text) {
    /*let alert = document.getElementById("alert");
    document.getElementById("alert").querySelector(".alertText").innerHTML = text
    alert.style.display = "block";*/
    alert(text);
}

function closeAlert() {
    let alert = document.getElementById("alert");
    alert.style.display = "none";
}

function loadNotes() {
    document.getElementById("notes").style.display = "block";
    document.getElementById("stats").style.display = "none";
}

function loadStats() {
    document.getElementById("notes").style.display = "none";
    document.getElementById("stats").style.display = "block";
}
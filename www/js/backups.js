function backupCreate() {
    let name = prompt("Zadejte název zálohy");

    name = name.replace("_", "-");

    if (name == null || name == "") {
        return;
    }

    name = name+"_backup_" + new Date().getTime();
    naja.makeRequest('POST', '/backupmanager/', JSON.stringify({
        "name": name, 
        "action": "createBackup"
    }), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
        if (response.resp == "done") {
            alert("Záloha byla úspěšně vytvořena");
            let table = document.getElementById("mainTable");
            let row = table.insertRow(0);
            let name = response.name;
            let time = response.time;
            let title = response.title;
            row.setAttribute("data-id", name);
            let cell0 = row.insertCell(0);
            cell0.innerHTML = title;
            let cell1 = row.insertCell(1);
            cell1.innerHTML = time;
            let cell2 = row.insertCell(2);
            cell2.innerHTML = `
            <a href=${name}>Stáhnout</a>
            `;
            let cell3 = row.insertCell(3);
            cell3.innerHTML = `
            <button onClick=backupRestore("${name}")>Obnovit</button>
            `;
            let cell4 = row.insertCell(4);
            cell4.innerHTML = `
            <button onClick=backupRename("${name}")>Přejmenovat</button>
            `;
            let cell5 = row.insertCell(5);
            cell5.innerHTML = `
            <button onClick=backupDelete("${name}")>Smazat</button>
            `;
        }
    });
}

function backupRestore(name) {
    if (name == null || name == "") {
        return;
    }


    if (!confirm("Opravdu chcete obnovit zálohu?")) {
        alert("Obnova zálohy byla zrušena");
        return;
    }
    
    let create = confirm("Chcete vytvořit zálohu před obnovou?");
    console.log(create);
    naja.makeRequest('POST', '/backupmanager/', JSON.stringify({
        "name": name, 
        "createBackup": create,
        "action": "restoreBackup"
    }), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
        if (response.resp == "done") {
            alert("Záloha byla úspěšně vytvořena");
        }
    });

}

function backupDelete(name) {
    if (name == null || name == "") {
        return;
    }

    if (!confirm("Opravdu chcete smazat zálohu?")) {
        alert("Smazání zálohy bylp zrušeno");
        return;
    }

    naja.makeRequest('POST', '/backupmanager/', JSON.stringify({
        "name": name, 
        "action": "deleteBackup"
    }), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
        if (response.resp == "done") {
            document.querySelector('[data-id="' + name + '"]').remove();
            alert("Záloha byla úspěšně smazána");
        }
    });


}

function backupRename(name) {
    if (name == null || name == "") {
        return;
    }

    let oldName = name.replace("/backupdownload/", "");
    split = oldName.split("_");
    oldName = split[0];

    let newName = prompt("Zadejte nový název zálohy", oldName);

    // replace _ with -
    newName = newName.replace("_", "-");

    newName = newName+"_backup_" + split[2];

    if (newName == null || newName == "") {
        return;
    }

    naja.makeRequest('POST', '/backupmanager/', JSON.stringify({
        "name": name, 
        "newName": newName,
        "action": "renameBackup"
    }), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
        if (response.resp == "done") {
            document.querySelector('[data-id="' + name + '"]').remove();
            alert("Záloha byla úspěšně přejmenována");
            let table = document.getElementById("mainTable");
            let row = table.insertRow(0);
            let newname = response.name;
            let time = response.time;
            let title = response.title;
            row.setAttribute("data-id", newname);
            let cell0 = row.insertCell(0);
            cell0.innerHTML = title;
            let cell1 = row.insertCell(1);
            cell1.innerHTML = time;
            let cell2 = row.insertCell(2);
            cell2.innerHTML = `
            <a href=${newname}>Stáhnout</a>
            `;
            let cell3 = row.insertCell(3);
            cell3.innerHTML = `
            <button onClick=backupRestore("${newname}")>Obnovit</button>
            `;
            let cell4 = row.insertCell(4);
            cell4.innerHTML = `
            <button onClick=backupRename("${newname}")>Přejmenovat</button>
            `;
            let cell5 = row.insertCell(5);
            cell5.innerHTML = `
            <button onClick=backupDelete("${newname}")>Smazat</button>
            `;
        }
    });
}


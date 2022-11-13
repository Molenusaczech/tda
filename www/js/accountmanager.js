function edit(user) {
    console.log("edit user: " + user);
}

function deleteUser(user) {
    console.log("delete user: " + user);
}

function add() {
    console.log("add user");
    var table = document.getElementById("accountTable");
    var html = "<tr id='addnew'><td><input type='text' name='username' placeholder='Username' value=''></td><td><input type='text' name='password' placeholder='Heslo' value=''/></td><td><input type='checkbox' name='admin'></td><td><input type='button' value='Save' onclick=save('new')></td></tr>";
    table.insertAdjacentHTML('beforeend', html);
    document.getElementById("addButton").disabled = true;
    var editButtons = document.querySelectorAll('[name="editButton"]');

    editButtons.forEach(function (button) {
        button.disabled = true;
    });

    /*
    naja.makeRequest('POST', '/accountmanager/', JSON.stringify({value: '42'}), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
        console.log(response);
    });*/
}

function save(user) {
    if (user == 'new') {
        console.log("save new user");

        var username = document.getElementsByName("username")[0].value;
        var password = document.getElementsByName("password")[0].value;
        var isAdmin = document.getElementsByName("admin")[0].checked;

        if (username == "" || password == "") {
            alert("Uživatelské jméno i heslo musí být vyplněno!");
        } else {
            naja.makeRequest('POST', '/accountmanager/', JSON.stringify({"username": username, "password": password, "isAdmin": isAdmin}), {
                fetch: {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            }).then(function (response) {
                console.log(response);
                //response = JSON.parse(response);
                if (response.resp == "done") {
                    console.log("success");
                    document.getElementById("addnew").remove();
                    var table = document.getElementById("accountTable");
                    if (isAdmin) {
                        var admintext = "true";
                    } else {
                        var admintext = "false";
                    }
                    var newrow = "<tr><td>" + username + "</td><td>" + password + "</td><td>" + admintext + "</td><td><input type='button' value='Upravit' onclick=edit('" + username + "')></td><td><input type='button' value='Smazat' onclick=deleteUser('" + username + "')></td></tr>";
                    table.insertAdjacentHTML('beforeend', newrow);
                    document.getElementById("addButton").disabled = false;

                    var editButtons = document.querySelectorAll('[name="editButton"]');

                    editButtons.forEach(function (button) {
                        button.disabled = true;
                    });

                } else {
                    console.log("error");
                    
                }
            });
        }

    }
}
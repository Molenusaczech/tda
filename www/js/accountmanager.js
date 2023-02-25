var curid = null;

function edit(user) {
    //console.log("edit user: " + user);

    var pos = document.querySelector('[data-account="' + user + '"]');
    //console.log(pos.children);
    //var pass = pos.children[1].innerHTML;
    //var admin = pos.children[2].innerHTML;

    var username = pos.getAttribute("data-username");
    var pass = pos.getAttribute("data-password");
    var admin = pos.getAttribute("data-isadmin");
    let email = pos.getAttribute("data-email");
    let name = pos.getAttribute("data-name");
    let surname = pos.getAttribute("data-surname");

    //console.log(admin);
    if (admin == "1") {
        admin = "checked";
    } else {
        admin = "";
    }
    var html = "<tr id='addnew'><td><input type='text' name='username' placeholder='Uživatelské jméno' value='"+username+"'/></td><td><input type='text' name='password' placeholder='Heslo' value='"+pass+"'/></td><td><input type='text' name='email' placeholder='Email' value='"+email+"'/></td><td><input type='text' name='name' placeholder='Jméno' value='"+name+"'/></td><td><input type='text' name='surname' placeholder='Přijmení' value='"+surname+"'/></td><td><input type='checkbox' name='admin' "+admin+"></td><td><input type='button' value='Save' onclick=save('"+user+"')></td></tr>";
    pos.insertAdjacentHTML('afterend', html);
    pos.style.display = "none";

    document.getElementById("addButton").disabled = true;
    var editButtons = document.querySelectorAll('[name="editButton"]');

    editButtons.forEach(function (button) {
        button.disabled = true;
    });

}

function deleteUser(user) {
    //console.log("delete user: " + user);

    naja.makeRequest('POST', '/accountmanager/', JSON.stringify({"action": "delete", "username": user}), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
    
        //console.log(response);

        if (response.resp == "done") {
            //console.log("success");
            document.querySelector('[data-account="' + user + '"]').remove();

        } else {
            alert("Error! "+response.resp);
        }

    });

}

function add() {
    //console.log("add user");
    var table = document.getElementById("accountTable");
    var html = `<tr id='addnew'>
    <td><input type='text' name='username' placeholder='Username' value=''></td>
    <td><input type='text' name='password' placeholder='Heslo' value=''/></td>
    <td><input type='text' name='email' placeholder='Email' value=''/></td>
    <td><input type='text' name='name' placeholder='Jméno' value=''/></td>
    <td><input type='text' name='surname' placeholder='Příjmení' value=''/></td>
    <td><input type='checkbox' name='admin'></td>
    <td><input type='button' value='Save' onclick=save('new')></td>
    </tr>`;

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

var isAdmin = "";

function save(user) {
    if (user == 'new') {
        //console.log("save new user");

        var username = document.getElementsByName("username")[0].value;
        var password = document.getElementsByName("password")[0].value;
        var isAdmin = document.getElementsByName("admin")[0].checked;
        let email = document.getElementsByName("email")[0].value;
        let name = document.getElementsByName("name")[0].value;
        let surname = document.getElementsByName("surname")[0].value;
        if (isAdmin) {
            var admintext = "Ano";
            var isAdmin = "1";
        } else {
            var admintext = "Ne";
            var isAdmin = "0";
        }
        //console.log(username);

        if (username == "" || password == "") {
            alert("Uživatelské jméno i heslo musí být vyplněno!");
        } else {
            naja.makeRequest('POST', '/accountmanager/', JSON.stringify({
                "username": username, 
                "password": password, 
                "isAdmin": isAdmin,
                "email": email,
                "name": name,
                "surname": surname, 
                "action": "addNew"
            }), {
                fetch: {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            }).then(function (response) {
                //console.log(response);
                //response = JSON.parse(response);
                if (response.resp == "done") {
                    //console.log("success");
                    var id = response.id;
                    document.getElementById("addnew").remove();
                    var table = document.getElementById("accountTable");
                    
                    var newrow = "<tr data-account="+id+" data-username="+username+" data-password="+password+" data-isadmin="+isAdmin+" data-email="+email+" data-name="+name+" data-surname="+surname+"><td>" + username + "</td><td>" + password + "</td><td>"+email+"</td><td>"+name+"</td><td>"+surname+"</td><td>" + admintext + "</td><td><input type='button' value='Upravit' onclick=edit('" + id + "')></td><td><input type='button' value='Smazat' onclick=deleteUser('" + id + "')></td></tr>";
                    table.insertAdjacentHTML('beforeend', newrow);
                    document.getElementById("addButton").disabled = false;

                    var editButtons = document.querySelectorAll('[name="editButton"]');

                    editButtons.forEach(function (button) {
                        button.disabled = false;
                    });

                } else {
                    alert("Error! "+response.resp);
                    
                }
            });
        }
    } else {
        //console.log("updating user: " + user);

        var username = document.getElementsByName("username")[0].value;
        var password = document.getElementsByName("password")[0].value;
        var isAdmin = String(document.getElementsByName("admin")[0].checked);
        let email = document.getElementsByName("email")[0].value;
        let name = document.getElementsByName("name")[0].value;
        let surname = document.getElementsByName("surname")[0].value;

        if (isAdmin == "true") {
            var admintext = "Ano"; 
            var isAdmin = "1";
        } else {
            var admintext = "Ne";
            var isAdmin = "0";
        }
        //console.log("adm: "+isAdmin);

        if (username == "" || password == "") {
            alert("Uživatelské jméno i heslo musí být vyplněno!");
        } else {
            naja.makeRequest('POST', '/accountmanager/', JSON.stringify({
                "id": user, 
                "password": password, 
                "isAdmin": isAdmin, 
                "action": "update",
                "username": username,
                "email": email,
                "name": name,
                "surname": surname
            }), {
                fetch: {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            }).then(function (response) {
                //console.log(response);
                //console.log(isAdmin);
                //response = JSON.parse(response);
                if (response.resp == "done") {
                    //console.log("success");
                    document.getElementById("addnew").remove();
                    var pos = document.querySelector("[data-account='" + user + "']");
                    //console.log(admintext);
                    //console.log(username);
                    let id = user;
                    var newrow = "<tr data-account="+id+" data-username="+username+" data-password="+password+" data-isadmin="+isAdmin+" data-email="+email+" data-name="+name+" data-surname="+surname+"><td>" + username + "</td><td>" + password + "</td><td>"+email+"</td><td>"+name+"</td><td>"+surname+"</td><td>" + admintext + "</td><td><input type='button' value='Upravit' onclick=edit('" + id + "')></td><td><input type='button' value='Smazat' onclick=deleteUser('" + id + "')></td></tr>";
                    pos.insertAdjacentHTML('afterend', newrow);
                    pos.remove();
                    document.getElementById("addButton").disabled = false;

                    var editButtons = document.querySelectorAll('[name="editButton"]');

                    editButtons.forEach(function (button) {
                        button.disabled = false;
                    });

                } else {
                    alert("Error! "+response.resp);
                    
                }
            });
        }
    }
}
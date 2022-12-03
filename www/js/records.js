function edit(id) {
    console.log("edit " + id);

    var pos = document.querySelector('[data-id="' + id + '"]');
    console.log()

    var tagtext = "";
    var tdtext = "";

    var curtags = [];

    var i = 0;
    /*tags.forEach(function (tag) {

        if (pos.hasAttribute(`data-tags-${i}`)) {
            var checkedValue = "value='true'";
            tdtext += `<span data-tagval=${i} style="background-color: ${tag.color}">${tag.name}</span>`;
            curtags.push(i);
        } else {
            var checkedValue = "";
        }

        tagtext += `<input type="checkbox" name="tag"  onClick=UpdateTag("${i}") data-tag="${tag.name}" checked)><span style="background-color: ${tag.color}">${tag.name}</span><br>`;
        i++;
    });*/

    for (const [key, value] of Object.entries(tags)) {
        var tag = value;
        var i = key;
        if (pos.hasAttribute(`data-tags-${i}`)) {
            var checkedValue = "value='true'";
            tdtext += `<span data-tagval=${i} style="background-color: ${tag.color}">${tag.name}</span>`;
            curtags.push(i);
        } else {
            var checkedValue = "";
        }

        tagtext += `<input type="checkbox" name="tag"  onClick=UpdateTag("${i}") data-tag="${tag.name}" checked)><span style="background-color: ${tag.color}">${tag.name}</span><br>`;
    }

    var desc = pos.getAttribute("data-desc");
    console.log("desc: " + desc);
    var date = pos.getAttribute("data-date");
    console.log("date: " + date);
    var lang = pos.getAttribute("data-lang");
    console.log("lang: " + lang);
    var lenght = pos.getAttribute("data-lenght");
    console.log("lenght: " + lenght);
    var rating = pos.getAttribute("data-rating");
    console.log("rating: " + rating);

    var html = `<tr id='addnew'>
    <td>
        <input type='text' name='description' placeholder='Popis' value='${desc}'>
    </td>
    <td>
        <input type='datetime-local' name='date' value='${date}'/>
    </td>
    <td>
        <input type='text' name='lang' placeholder='jazyk' value='${lang}'>
    </td>
    <td>
        <input type='number' name='lenght' value='${lenght}'>
    </td>

    <td>
        <input type='number' min=1 max=5 name="rating" value='${rating}'>
    </td>

    <td> <span class="popup" id="editPopup"><span onclick="popup()">+</span>
        <span class="popuptext" id="myPopup">
            `+ tagtext + `
        </span>
        ${tdtext}
        </span>
    </>

    <td>
        <input type='button' value='Save' onclick=save('${id}')>
    </td>
    </tr>`;



    console.log(tags);
    pos.insertAdjacentHTML('afterEnd', html);
    document.getElementsByName("date")[0].value = new Date().toISOString().slice(0, 16);
    document.getElementById("addButton").disabled = true;
    var editButtons = document.querySelectorAll('[name="editButton"]');
    pos.remove();

    curtags.forEach(function (tag) {
        document.querySelector(`[data-tag="${tags[tag].name}"]`).checked = true;
    });

    editButtons.forEach(function (button) {
        button.disabled = true;
    });
}

function del(id) {
    console.log("delete " + id);

    naja.makeRequest('POST', '/', JSON.stringify({ "action": "delete", "id": id }), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {

        //console.log(response);

        if (response.resp == "done") {
            //console.log("success");
            document.querySelector('[data-id="' + id + '"]').remove();

        } else {
            alert("Error! " + response.resp);
        }

    });

}

function add() {
    console.log("add");

    var pos = document.getElementById("tableTitle");

    var tagtext = "";

    var i = 0;
    /*tags.forEach(function (tag) {
        tagtext += `<input type="checkbox" name="tag" value="${tag.name}" onClick=UpdateTag("${i}") data-tag="${tag.name}")><span style="background-color: ${tag.color}">${tag.name}</span><br>`;
        i++;
    });*/

    for (const [key, value] of Object.entries(tags)) {
        var tag = value;
        var i = key;
        tagtext += `<input type="checkbox" name="tag" value="${tag.name}" onClick=UpdateTag("${i}") data-tag="${tag.name}")><span style="background-color: ${tag.color}">${tag.name}</span><br>`;
    }

    var html = `<tr id='addnew'>
    <td>
        <input type='text' name='description' placeholder='Popis' value=''>
    </td>
    <td>
        <input type='datetime-local' name='date' value=''/>
    </td>
    <td>
        <input type='text' name='lang' placeholder='jazyk'>
    </td>
    <td>
        <input type='number' name='lenght'>
    </td>

    <td>
        <input type='number' min=1 max=5 name="rating">
    </td>

    <td> <span class="popup" id="editPopup"><span onclick="popup()">+</span>
        <span class="popuptext" id="myPopup">
            `+ tagtext + `
        </span>
        </span>
    </>

    <td>
        <input type='button' value='Save' onclick=save('new')>
    </td>
    </tr>`;



    console.log(tags);

    pos.insertAdjacentHTML('afterEnd', html);
    document.getElementsByName("date")[0].value = new Date().toISOString().slice(0, 16);
    document.getElementById("addButton").disabled = true;
    var editButtons = document.querySelectorAll('[name="editButton"]');

    editButtons.forEach(function (button) {
        button.disabled = true;
    });
}


function popup() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function UpdateTag(id) {
    var tag = tags[id]["name"];
    var tagStyle = "style='background-color: " + tags[id]["color"] + ";' data-tagval=" + id;
    //console.log(tag);
    var tagObject = document.querySelector(`[data-tag="${tag}"]`);
    //console.log(tagObject);
    if (tagObject.checked) {
        //console.log("checked");
        var html = `<span ${tagStyle}>${tag}</span>`;
        var pos = document.getElementById("editPopup");
        pos.insertAdjacentHTML('afterEnd', html);
    } else {
        //console.log("unchecked");
        //console.log(document.querySelector(`[data-tagval="${id}"]`));
        document.querySelector(`[data-tagval="${id}"]`).remove();
    }
}

function save(id) {
    console.log("save " + id);

    var description = document.getElementsByName("description")[0].value;
    console.log("description " + description);
    var date = document.getElementsByName("date")[0].value;
    var timestamp = new Date(date).getTime() / 1000; 
    console.log("date " + date);
    var lang = document.getElementsByName("lang")[0].value;
    console.log("lang " + lang);
    var lenght = document.getElementsByName("lenght")[0].value;
    console.log("lenght " + lenght);
    var rating = document.getElementsByName("rating")[0].value;
    console.log("rating " + rating);

    var tagobjs = document.querySelectorAll('[data-tagval]');

    //console.log("datesTest");
    //console.log(new Date(document.getElementById("dateFrom").value).toISOString);
    //console.log(new Date(date).toISOString);

    if (new Date(document.getElementById("dateFrom").value) > new Date(date)) {
        //console.log("date from");
        document.getElementById("dateFrom").value = new Date(date).toISOString().slice(0,16);
    }

    if (new Date(document.getElementById("dateTo").value) < new Date(date)) {
        console.log("date to");
        document.getElementById("dateTo").value = new Date(date).toISOString().slice(0,16);
    }

    var curtags = [];

    tagobjs.forEach(function (tag) {
        curtags.push(tag.dataset.tagval);
        //console.log(tag.dataset.tagval);  
    });

    if (id == "new") {
        console.log("save new");
        //console.log(tags);
        var json = JSON.stringify({
            "description": description,
            "date": date,
            "lang": lang,
            "lenght": lenght,
            "rating": rating,
            "tags": curtags,
            "action": "add"
        });
        console.log(json);

        if (description == "" || date == "" || lang == "" || lenght == "" || rating == "") {
            alert("Nejsou vyplněna všechna pole!");
        } else {

            naja.makeRequest('POST', '/', json, {
                fetch: {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            }).then(function (response) {
                console.log(response);
                if (response.resp == "done") {
                    var id = response.id;
                    var pos = document.getElementById("addnew");

                    var i = 0;
                    var tagtext = "";

                    var tagobjs = document.querySelectorAll('[data-tagval]');

                    var datas = "data-desc='" + description + "' data-date='" + date + "' data-lang='" + lang + "' data-lenght='" + lenght + "' data-rating='" + rating + "' data-timestamp='" + timestamp + "'";

                    var datatags = "";
                    tagobjs.forEach(function (tag) {
                        var tagid = tag.dataset.tagval;
                        //console.log("tagid: "+tags);
                        tagtext += `<span data-tagid="${tagid}" style="background-color: ${tags[tagid]["color"]}">${tags[tagid]["name"]}</span> `;
                        datatags += `data-tags-${tagid} `;
                        i++;
                    });

                    /*tags.forEach(function (tag) {
                        tagtext += `<span style="${tag.style}">${tag.name}</span><br>`;
                        i++;
                    });*/

                    var html = ` <tr ` + datas + ` ` + datatags + ` data-id="${id}">

                    <td>${description}</td>
                    <td>${date}</td>
                    <td>${lang}</td>
                    <td>${lenght} min</td>
                    <td>${rating}*</td>

                    <td> `+ tagtext + ` </td>

                    <td> <input type="button" name="editButton" value="Upravit" onClick=edit(${id})> </td>
                    <td> <input type="button" value="Smazat" onClick=del(${id})> </td>

                    

                    <tr>
                    `
                    pos.insertAdjacentHTML('afterEnd', html);

                    document.getElementById("addnew").remove();

                    var editButtons = document.querySelectorAll('[name="editButton"]');

                    editButtons.forEach(function (button) {
                        button.disabled = false;
                    });

                    document.getElementById("addButton").disabled = false;

                } else {
                    alert("Error " + response.resp);
                }
            });
        }
    } else {
        console.log("save edit");
        var json = JSON.stringify({
            "description": description,
            "date": date,
            "lang": lang,
            "lenght": lenght,
            "rating": rating,
            "tags": curtags,
            "action": "edit",
            "id": id
        });
        console.log(json);

        if (description == "" || date == "" || lang == "" || lenght == "" || rating == "") {
            alert("Nejsou vyplněna všechna pole!");
        } else {

            naja.makeRequest('POST', '/', json, {
                fetch: {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            }).then(function (response) {
                console.log(response);
                if (response.resp == "done") {
                    var pos = document.getElementById("addnew");

                    var i = 0;
                    var tagtext = "";

                    var tagobjs = document.querySelectorAll('[data-tagval]');

                    var datas = "data-desc='" + description + "' data-date='" + date + "' data-lang='" + lang + "' data-lenght='" + lenght + "' data-rating='" + rating + "' data-timestamp='" + timestamp + "'";


                    var datatags = "";
                    tagobjs.forEach(function (tag) {
                        var tagid = tag.dataset.tagval;
                        //console.log("tagid: "+tags);
                        tagtext += `<span data-tagid="${tagid}" style="background-color: ${tags[tagid]["color"]}">${tags[tagid]["name"]}</span> `;
                        datatags += ` data-tags-${tagid} `;
                        i++;
                    });

                    /*tags.forEach(function (tag) {
                        tagtext += `<span style="${tag.style}">${tag.name}</span><br>`;
                        i++;
                    });*/

                    var html = ` <tr ${datas} ${datatags} data-id="${id}">

                    <td>${description}</td>
                    <td>${date}</td>
                    <td>${lang}</td>
                    <td>${lenght} min</td>
                    <td>${rating}*</td>

                    <td> `+ tagtext + ` </td>

                    <td> <input type="button" name="editButton" value="Upravit" onClick=edit(${id})> </td>
                    <td> <input type="button" value="Smazat" onClick=del(${id})> </td>
                    `
                    pos.insertAdjacentHTML('afterEnd', html);

                    document.getElementById("addnew").remove();

                    var editButtons = document.querySelectorAll('[name="editButton"]');

                    editButtons.forEach(function (button) {
                        button.disabled = false;
                    });

                    document.getElementById("addButton").disabled = false;
                }
            });
        }

    }


}

function tagPopup(id) {

    if (document.getElementsByClassName("show").length != 0 && document.getElementsByClassName("show")[0].dataset.popup != id) {
        document.getElementsByClassName("show")[0].classList.remove("show");
    }
    if (id == "new") {
        var popup = document.getElementById("newPopup");
        popup.classList.toggle("show");
    } else {
        const element = document.querySelector('[data-popup="' + id + '"]');
        //console.log(element); // 👉️ div
        element.classList.toggle("show");
    }

}

function tagCreate(id) {
    if (id == "new") {
        var color = document.getElementById("newColor").value;
        var name = document.getElementById("newName").value;

        if (name !== "") {
            var json = JSON.stringify({
                "color": color,
                "name": name,
                "action": "addTag"
            });

            naja.makeRequest('POST', '/', json, {
                fetch: {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            }).then(function (response) {
                console.log(response);
                if (response.resp == "done") {
                    var i = response.id;
                    var html = `
                    <span style="background-color: ${color}" class="tagSelector" data-tagselect=${i}> 
                	<input type="checkbox" onClick=tagClick(${i})> 
                    <span data-tagtitle="${i}"> ${name}  </span>
                                
                	 <span class="popup">
                 		<span onClick=tagPopup(${i})>✎</span>
                        <span class="tagPopup" data-popup=${i}>
                			<input type="color" value="${color}">
                			<input type="text" placeholder="Jméno štítku" value="${name}">		
                			<input type="button" value="Uložit" onclick=tagEdit(${i})>
                        </span>
                        </span>
                        <span onClick=tagDelete(${i}) class="clickable">🗑</span>
                </span>
                    `;
                    var pos = document.getElementById("newTag");
                    pos.insertAdjacentHTML('beforeBegin', html);
                    tags[i] = {
                        "name": name,
                        "color": color,
                        "style": "background-color: " + color
                    }
                    document.getElementById("newColor").value = "#000000";
                    document.getElementById("newName").value = "";
                    tagPopup("new");
                } else {
                    alert("Error " + response.resp);
                }
            });
        } else {
            alert("Nejsou vyplněna všechna pole!");
        }

    }
}

function tagEdit(id) {
    var color = document.querySelector('[data-popup="' + id + '"] input[type="color"]').value;
    var name = document.querySelector('[data-popup="' + id + '"] input[type="text"]').value;

    console.log(color);
    console.log(name);

    if (name !== "") {
        var json = JSON.stringify({
            "color": color,
            "name": name,
            "action": "editTag",
            "id": id
        });

        naja.makeRequest('POST', '/', json, {
            fetch: {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        }).then(function (response) {
            console.log(response);
            if (response.resp == "done") {
                tags[id] = {
                    "name": name,
                    "color": color,
                    "style": "background-color: " + color
                }
                document.querySelector('[data-popup="' + id + '"]').classList.remove("show");
                document.querySelector('[data-tagselect="' + id + '"]').style.backgroundColor = color;
                document.querySelector('[data-tagtitle="' + id + '"]').innerHTML = name;
                //console.log(document.querySelector('[data-tagtitle="' + id + '"]'))
                

                //document.querySelector('[data-tagselect="' + id + '"]').style.backgroundColor = color;
                //document.querySelector('[data-tagselect="' + id + '"]').children[1].innerHTML = name;

                var tagsobjs = document.querySelectorAll('[data-tagid="' + id + '"]');

                tagsobjs.forEach(function (tag) {
                    tag.style.backgroundColor = color;
                    tag.innerHTML = name;
                });

            } else {
                alert("Error " + response.resp);
            }
        });
    } else {
        alert("Nejsou vyplněna všechna pole!");
    }
}

function tagDelete(id) {
    var name = tags[id].name;
    if (confirm("Chcete vážně smazat štítek "+name+"? Toto ho odstraní ze všech záznamů!")) {
        console.log("smazat");
        var json = JSON.stringify({
            "action": "deleteTag",
            "id": id
        });
        naja.makeRequest('POST', '/', json, {
            fetch: {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        }).then(function (response) {
            console.log(response);
            if (response.resp == "done") {
                var tagsobjs = document.querySelectorAll('[data-tagid="' + id + '"]');
                tagsobjs.forEach(function (tag) {
                    tag.remove();
                });
                document.querySelector('[data-tagselect="' + id + '"]').remove();
            } else {
                alert("Error " + response.resp);
            }
        });

    }
}

function tagClick(id) {
    filter();
}

function filter() {
    console.log("filter");

    var tagobjs = document.querySelectorAll('[data-tagselect] input[type="checkbox"]:checked');
    //console.log(tagobjs);
    var tagids = [];
    tagobjs.forEach(function (tag) {
        tagids.push(tag.parentElement.dataset.tagselect);
    });
    //console.log(tagids);
    var rows = document.querySelectorAll('[data-desc]');
    //console.log (rows);


    var current = 0;
    rows.forEach(function (row) {
        current = 0;
        tagids.forEach(function (tagid) {
            //console.log(row.getAttribute("data-tags-"+tagid));
            if (row.getAttribute("data-tags-"+tagid) !== null) {
                current++;
                //console.log("test");
            }
        });

        var rawdate = row.getAttribute('"data-date');
        var rowDate = new Date(rawdate+":00.000Z");
        //console.log(rowDate);

        var lenght = Number(row.getAttribute("data-lenght"));
        var lang = row.getAttribute("data-lang");
        var rating = row.getAttribute("data-rating");

        if (rowDate >= new Date(document.getElementById("dateFrom").value)) current++;
        
        if (document.getElementById("lang").value == "all") {
            current++;
        } else if (document.getElementById("lang").value == lang) {
            current++;
        }

        if (rowDate <= new Date(document.getElementById("dateTo").value)) current++;
        
        if (lenght >= Number(document.getElementById("lenghtFrom").value)) current++;

        if (lenght <= Number(document.getElementById("lenghtTo").value)) current++;

        if (rating >= Number(document.getElementById("ratingFrom").value)) current++;

        if (rating <= Number(document.getElementById("ratingTo").value)) current++;

        if (current >= tagids.length + 7) {
            row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    });

}
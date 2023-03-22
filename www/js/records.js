let editing = false;

window.onbeforeunload = confirmExit;
function confirmExit() {
    if (editing) {
        return "Máte neuložené změny. Opravdu chcete opustit stránku?";
    }
}

function edit(id) {
    console.log("edit " + id);
    editing = true;

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
        <input type='text' name='lang' placeholder='Jazyk' value='${lang}'>
    </td>
    <td>
        <input type='number' name='lenght' value='${lenght}' placeholder='Délka (v minutách)'>
    </td>

    <td>
        <input type='number' min=1 max=5 name="rating" value='${rating}' placeholder="1-5*">
    </td>

    <td> <span class="popup" id="editPopup"><span onclick="popup()">+</span>
        <span class="popuptext" id="myPopup">
            `+ tagtext + `
        </span>
        ${tdtext}
        </span>
    </>

    <td>
        <input type='button' value='Uložit' onclick=save('${id}')>
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
    document.getElementsByName("description")[0].focus();
}

function del(id) {
    console.log("delete " + id);

    if (!confirm("Opravdu chcete smazat záznam?")) {
        return;
    }

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
    editing = true;

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
        <input type='text' name='lang' placeholder='Jazyk'>
    </td>
    <td>
        <input type='number' name='lenght' placeholder='Délka (v minutách)'>
    </td>

    <td>
        <input type='number' min=1 max=5 name="rating" placeholder="1-5*">
    </td>

    <td> <span class="popup" id="editPopup"><span onclick="popup()">+</span>
        <span class="popuptext" id="myPopup">
            `+ tagtext + `
        </span>
        </span>
    </>

    <td>
        <input type='button' value='Uložit' onclick=save('new')>
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
    document.getElementsByName("description")[0].focus();
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
    editing = false;

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


    if (lang.length > 30) {
        alert("Jazyk nemůže mít více než 30 znaků!");
        return;
    }

    if (Number(lenght) < 0) {
        alert("Délka nemůže být záporná!");
        return;
    }

    if (Number(rating) < 0 || Number(rating) > 5) {
        alert("Hodnocení musí být v rozmezí 0-5!");
        return;
    }


    //console.log("datesTest");
    //console.log(new Date(document.getElementById("dateFrom").value).toISOString);
    //console.log(new Date(date).toISOString);

    if (new Date(document.getElementById("dateFrom").value) > new Date(date)) {
        //console.log("date from");
        document.getElementById("dateFrom").value = new Date(date).toISOString().slice(0, 16);
    }

    if (new Date(document.getElementById("dateTo").value) < new Date(date)) {
        console.log("date to");
        document.getElementById("dateTo").value = new Date(date).toISOString().slice(0, 16);
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
                    <td>${rating}<span class="star"></span></td>

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
                    <td>${rating}<span class="star"></span></td>

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

    if (id == "new" && document.getElementById("newPopup").classList.contains("show")) {
        document.getElementsByClassName("show")[0].classList.remove("show");
        return;
    }

    if (document.getElementsByClassName("show").length != 0 && document.getElementsByClassName("show")[0].dataset.popup != id) {
        document.getElementsByClassName("show")[0].classList.remove("show");
    }
    if (id == "new") {
        var popup = document.getElementById("newPopup");
        popup.classList.toggle("show");
        let y = window.scrollY + popup.getBoundingClientRect().top // Y
        let x = window.scrollX + popup.getBoundingClientRect().left // X
        let width = popup.offsetWidth;
        let containerwidth = document.getElementById("side-container").offsetWidth;

        if (x + width > containerwidth) {
            console.log(x - width);
            //element.style.margin.left = "-"+(x-width)*4 + "px";
            popup.style.left = "-" + Math.floor(x + width - containerwidth) - 50 + "px";
        }
        console.log(x, y);

    } else {
        const element = document.querySelector('[data-popup="' + id + '"]');
        element.classList.toggle("show");
        //let y = window.scrollY + element.getBoundingClientRect().top // Y
        let x = window.scrollX + element.getBoundingClientRect().left // X
        let width = element.offsetWidth;
        let containerwidth = document.getElementById("side-container").offsetWidth;

        if (x + width > containerwidth) {
            console.log(x - width);
            //element.style.margin.left = "-"+(x-width)*4 + "px";
            console.log("-" + Math.floor(x + width - containerwidth) + "px");
            element.style.left = "-" + Math.floor(x + width - containerwidth) - 50 + "px";
        }
        //let height = element.offsetHeight;
        console.log(x);
        //console.log(element); // 👉️ div

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
    if (confirm("Chcete vážně smazat štítek " + name + "? Toto ho odstraní ze všech záznamů!")) {
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

    // fallback
    if (new Date(document.getElementById("dateFrom").value) < new Date(filterdata["mintime"])) {
        var rawdate = filterdata["mintime"];
        var rowDate = new Date(rawdate + ":00.000Z").toISOString().slice(0, 16);
        document.getElementById("dateFrom").value = rowDate
    }

    if (new Date(document.getElementById("dateFrom").value) > new Date(filterdata["maxtime"])) {
        var rawdate = filterdata["maxtime"];
        var rowDate = new Date(rawdate + ":00.000Z").toISOString().slice(0, 16);
        document.getElementById("dateFrom").value = rowDate
    }

    if (new Date(document.getElementById("dateTo").value) > new Date(filterdata["maxtime"])) {
        var rawdate = filterdata["maxtime"];
        var rowDate = new Date(rawdate + ":00.000Z").toISOString().slice(0, 16);
        document.getElementById("dateTo").value = rowDate
    }

    if (new Date(document.getElementById("dateTo").value) < new Date(filterdata["mintime"])) {
        var rawdate = filterdata["mintime"];
        var rowDate = new Date(rawdate + ":00.000Z").toISOString().slice(0, 16);
        document.getElementById("dateTo").value = rowDate
    }

    if (document.getElementById("lenghtFrom").value < Number(filterdata["minlenght"])) {
        document.getElementById("lenghtFrom").value = filterdata["minlenght"];
    }

    if (document.getElementById("lenghtFrom").value > Number(filterdata["maxlenght"])) {
        document.getElementById("lenghtFrom").value = filterdata["maxlenght"];
    }

    if (document.getElementById("lenghtTo").value > Number(filterdata["maxlenght"])) {
        document.getElementById("lenghtTo").value = filterdata["maxlenght"];
    }

    if (document.getElementById("lenghtTo").value < Number(filterdata["minlenght"])) {
        document.getElementById("lenghtTo").value = filterdata["minlenght"];
    }

    if (document.getElementById("ratingFrom").value < Number(filterdata["minrating"])) {
        document.getElementById("ratingFrom").value = filterdata["minrating"];
    }

    if (document.getElementById("ratingFrom").value > Number(filterdata["maxrating"])) {
        document.getElementById("ratingFrom").value = filterdata["maxrating"];
    }

    if (document.getElementById("ratingTo").value > Number(filterdata["maxrating"])) {
        document.getElementById("ratingTo").value = filterdata["maxrating"];
    }

    if (document.getElementById("ratingTo").value < Number(filterdata["minrating"])) {
        document.getElementById("ratingTo").value = filterdata["minrating"];
    }

    if (new Date(document.getElementById("dateFrom").value) > new Date(document.getElementById("dateTo").value)) {
        document.getElementById("dateFrom").value = document.getElementById("dateTo").value;
    }

    if (Number(document.getElementById("lenghtFrom").value) > Number(document.getElementById("lenghtTo").value)) {
        document.getElementById("lenghtFrom").value = document.getElementById("lenghtTo").value;
    }

    if (Number(document.getElementById("ratingFrom").value) > Number(document.getElementById("ratingTo").value)) {
        document.getElementById("ratingFrom").value = document.getElementById("ratingTo").value;
    }

    var current = 0;
    rows.forEach(function (row) {
        current = 0;
        tagids.forEach(function (tagid) {
            //console.log(row.getAttribute("data-tags-"+tagid));
            if (row.getAttribute("data-tags-" + tagid) !== null) {
                current++;
                //console.log("test");
            }
        });

        var rawdate = row.getAttribute('"data-date');
        var rowDate = new Date(rawdate + ":00.000Z");
        //console.log(rowDate);

        var lenght = Number(row.getAttribute("data-lenght"));
        var lang = row.getAttribute("data-lang");
        var rating = row.getAttribute("data-rating");

        //console.log("test");
        //console.log(rowDate);


        var fromdate = new Date(document.getElementById("dateFrom").value);

        fromdate.setHours(fromdate.getHours() + 1);
        //console.log(fromdate);
        if (rowDate >= fromdate) {
            current++;
            //console.log("vetsi");
        }


        var todate = new Date(document.getElementById("dateTo").value);
        todate.setHours(todate.getHours() + 1);

        //console.log(todate);
        if (rowDate <= todate) {
            current++;
            //console.log("mensi");
        }

        if (document.getElementById("lang").value == "all") {
            current++;
        } else if (document.getElementById("lang").value == lang) {
            current++;
        }


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

var method = "date";
var method2 = "lang";
var sortRev1 = false;
var sortRev2 = false;

function sort(sortby) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("mainTable");
    switching = true;


    if (method == sortby) {

    } else if (method2 == "date") {
        document.getElementById("date-sort").innerHTML = "";
    } else if (method2 == "lenght") {
        document.getElementById("lenght-sort").innerHTML = "";
    } else if (method2 == "rating") {
        document.getElementById("rate-sort").innerHTML = "";
    } else if (method2 == "lang") {
        document.getElementById("lang-sort").innerHTML = "";
    }




    if (method == sortby) {
        sortRev1 = !sortRev1;
    } else {
        method2 = method;
        method = sortby;
        sortRev2 = sortRev1;
        sortRev1 = false;
    }

    if (sortRev1) {
        var symbol1 = "▼";
    } else {
        var symbol1 = "▲";
    }

    if (sortRev2) {
        var symbol2 = "▼";
    } else {
        var symbol2 = "▲";
    }

    if (method2 == "date") {
        document.getElementById("date-sort").innerHTML = symbol2;
        document.getElementById("date-sort").style.color = "#555";
    } else if (method2 == "lenght") {
        document.getElementById("lenght-sort").innerHTML = symbol2;
        document.getElementById("lenght-sort").style.color = "#555";
    } else if (method2 == "rating") {
        document.getElementById("rate-sort").innerHTML = symbol2;
        document.getElementById("rate-sort").style.color = "#555";
    } else if (method2 == "lang") {
        document.getElementById("lang-sort").innerHTML = symbol2;
        document.getElementById("lang-sort").style.color = "#555";
    }

    if (method == "date") {
        document.getElementById("date-sort").innerHTML = symbol1;
        document.getElementById("date-sort").style.color = "#fff";
    } else if (method == "lenght") {
        document.getElementById("lenght-sort").innerHTML = symbol1;
        document.getElementById("lenght-sort").style.color = "#fff";
    } else if (sortby == "rating") {
        document.getElementById("rate-sort").innerHTML = symbol1;
        document.getElementById("rate-sort").style.color = "#fff";
    } else if (method == "lang") {
        document.getElementById("lang-sort").innerHTML = symbol1;
        document.getElementById("lang-sort").style.color = "#fff";
    }

    //var method = document.getElementById("sort").value;
    //var method2 = document.getElementById("sort2").value;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            //x = rows[i].getElementsByTagName("TD")[0];
            //y = rows[i + 1].getElementsByTagName("TD")[0];


            if (method == "date") {
                x = new Date(rows[i].getAttribute('"data-date'));
                y = new Date(rows[i + 1].getAttribute('"data-date'));
            } else if (method == "lenght") {
                x = Number(rows[i].getAttribute("data-lenght"));
                y = Number(rows[i + 1].getAttribute("data-lenght"));
            } else if (method == "rating") {
                x = Number(rows[i].getAttribute("data-rating"));
                y = Number(rows[i + 1].getAttribute("data-rating"));
            } else if (method == "lang") {
                x = rows[i].getAttribute("data-lang").toLowerCase();
                y = rows[i + 1].getAttribute("data-lang").toLowerCase();
            }

            if (sortRev1 && method != "lang") {
                x = x * -1;
                y = y * -1;
            } else if (sortRev1 && method == "lang") {
                if (x < y) {
                    x = 1;
                    y = -1;
                } else if (x > y) {
                    x = -1;
                    y = 1;
                }
            }

            if (x == y) {

                if (method2 == "date") {
                    x = new Date(rows[i].getAttribute('"data-date'));
                    y = new Date(rows[i + 1].getAttribute('"data-date'));
                } else if (method2 == "lenght") {
                    x = Number(rows[i].getAttribute("data-lenght"));
                    y = Number(rows[i + 1].getAttribute("data-lenght"));
                } else if (method2 == "rating") {
                    x = Number(rows[i].getAttribute("data-rating"));
                    y = Number(rows[i + 1].getAttribute("data-rating"));
                } else if (method2 == "lang") {
                    x = rows[i].getAttribute("data-lang").toLowerCase();
                    y = rows[i + 1].getAttribute("data-lang").toLowerCase();
                }

                if (sortRev2 && method2 != "lang") {
                    x = x * -1;
                    y = y * -1;
                } else if (sortRev2 && method2 == "lang") {
                    if (x < y) {
                        x = 1;
                        y = -1;
                    } else if (x > y) {
                        x = -1;
                        y = 1;
                    }
                }
            }


            // Check if the two rows should switch place:
            if (x > y) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

sort("date");
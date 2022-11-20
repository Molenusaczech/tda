function edit(id) {
    console.log("edit " + id);

    var pos = document.querySelector('[data-id="' + id + '"]');
    console.log()

    var tagtext = "";
    var tdtext = "";

    var curtags = [];

    var i = 0;
    tags.forEach(function (tag) {

        if (pos.hasAttribute(`data-tags-${i}`)) {
            var checkedValue = "value='true'";
            tdtext += `<span data-tagval=${i} style="background-color: ${tag.color}">${tag.name}</span>`;
            curtags.push(i);
        } else {
            var checkedValue = "";
        }

        tagtext += `<input type="checkbox" name="tag"  onClick=UpdateTag("${i}") data-tag="${tag.name}" checked)><span style="background-color: ${tag.color}">${tag.name}</span><br>`;
        i++;
    });

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

    <td> <span class="popup"><span onclick="popup()">+</span>
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

    naja.makeRequest('POST', '/', JSON.stringify({"action": "delete", "id": id}), {
        fetch: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    }).then(function (response) {
    
        //console.log(response);

        if (response.resp == "done") {
            //console.log("success");
            document.querySelector('[data-id="' + id+ '"]').remove();

        } else {
            alert("Error! "+response.resp);
        }

    });

}

function add() {
    console.log("add");

    var pos = document.getElementById("tableTitle");

    var tagtext = "";

    var i = 0;
    tags.forEach(function (tag) {
        tagtext += `<input type="checkbox" name="tag" value="${tag.name}" onClick=UpdateTag("${i}") data-tag="${tag.name}")><span style="background-color: ${tag.color}">${tag.name}</span><br>`;
        i++;
    });

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

    <td> <span class="popup"><span onclick="popup()">+</span>
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
    var tagStyle = "style='background-color: "+tags[id]["color"]+";' data-tagval="+id;
    //console.log(tag);
    var tagObject = document.querySelector(`[data-tag="${tag}"]`);
    //console.log(tagObject);
    if (tagObject.checked) {
        //console.log("checked");
        var html = `<span ${tagStyle}>${tag}</span>`;
        var pos = document.getElementsByClassName("popup")[0];
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
    console.log("description "+description);
    var date = document.getElementsByName("date")[0].value;
    console.log("date "+date);
    var lang = document.getElementsByName("lang")[0].value;
    console.log("lang "+lang);
    var lenght = document.getElementsByName("lenght")[0].value;
    console.log("lenght "+lenght);
    var rating = document.getElementsByName("rating")[0].value;
    console.log("rating "+rating);

    var tagobjs = document.querySelectorAll('[data-tagval]');

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

                    var datas = "data-desc='" + description + "' data-date='" + date + "' data-lang='" + lang + "' data-lenght='" + lenght + "' data-rating='" + rating + "'";

                    var datatags = "";
                    tagobjs.forEach(function (tag) {
                        var tagid = tag.dataset.tagval;
                        //console.log("tagid: "+tags);
                        tagtext += `<span style="background-color: ${tags[tagid]["color"]}">${tags[tagid]["name"]}</span>`;
                        datatags += `data-tags-${tagid}`;
                        i++;
                    });

                    /*tags.forEach(function (tag) {
                        tagtext += `<span style="${tag.style}">${tag.name}</span><br>`;
                        i++;
                    });*/

                    var html = ` <tr `+datas+` `+datatags+` data-id="${id}">

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

                    var datas = "data-desc='" + description + "' data-date='" + date + "' data-lang='" + lang + "' data-lenght='" + lenght + "' data-rating='" + rating + "'";


                    var datatags = "";
                    tagobjs.forEach(function (tag) {
                        var tagid = tag.dataset.tagval;
                        //console.log("tagid: "+tags);
                        tagtext += `<span style="background-color: ${tags[tagid]["color"]}">${tags[tagid]["name"]}</span>`;
                        datatags += ` data-tags-${tagid}`;
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
let startTime = new Date().getTime();
async function updateStats() {

    const userRq = await fetch("https://tda.knapa.cz/user/", {
        headers: {
            'accept': 'application/json',
            'x-access-token': 'f03026323815179d42698e6c049ea14d',
        },
    });

    const statRq = await fetch("https://tda.knapa.cz/sysinfo/", {
        headers: {
            'accept': 'application/json',
            'x-access-token': 'f03026323815179d42698e6c049ea14d',
        },
    });

    const commitRq = await fetch("https://tda.knapa.cz/commit/", {
        headers: {
            'accept': 'application/json',
            'x-access-token': 'f03026323815179d42698e6c049ea14d',
        },
    });

    let todayTime = new Date();
    todayTime.setHours(0, 2);

    // time format: 2023-03-31T14:38:27+00:00
    todayTime = todayTime.toISOString().slice(0, 19) + "+00:00";
    console.log(todayTime);

    const todayRq = await fetch("https://tda.knapa.cz/commit/filter/"+todayTime, {
        headers: {
            'accept': 'application/json',
            'x-access-token': 'f03026323815179d42698e6c049ea14d',
        },
    }); 
        

    let user = await userRq.text();
    let stats = await statRq.text();
    let commit = await commitRq.text();
    let today = await todayRq.text();

    user = JSON.parse(user);
    stats = JSON.parse(stats);
    commit = JSON.parse(commit);
    today = JSON.parse(today);

    console.log(user);
    console.log(stats);
    console.log(commit);
    console.log(today);

    document.getElementById("cpu").innerHTML = Math.round(stats.cpu_load * 100) + "%";
    document.getElementById("ram").innerHTML = Math.round(stats.ram_usage) + "MB";
    document.getElementById("disk").innerHTML = Math.round(stats.disk_usage) + "MB";
    startTime = new Date(stats.boot_time).getTime();
    document.getElementById("platform").innerHTML = stats.platform;
    document.getElementById("totalCommits").innerHTML = Object.keys(commit).length;
    document.getElementById("todayCommits").innerHTML = Object.keys(today).length;

    let countAdd = 0;
    let countDel = 0;
    let score = {};
    let addedUsers = {};
    let removedUsers = {};
    today.forEach(element => {
        let added = element.lines_added;
        let removed = element.lines_removed;
        let user = element.creator_id;
        countAdd += added;
        countDel += removed;
        score[user] ??= 0;
        score[user] += added;
        score[user] += removed;
        addedUsers[user] ??= 0;
        addedUsers[user] += added;
        removedUsers[user] ??= 0;
        removedUsers[user] += removed;
    });
    console.log(countAdd);
    console.log(countDel);
    console.log(score);

    document.getElementById("todayAdd").innerHTML = '+ ' + countAdd;
    document.getElementById("todayRemove").innerHTML = '- ' + countDel;

    let topScore = 0;
    let topUser = "";
    for (const [key, value] of Object.entries(score)) {
        if (value > topScore) {
            topScore = value;
            topUser = key;
        }
    }
    console.log(topUser);

    const topRq = await fetch("https://tda.knapa.cz/user/"+topUser, {
        headers: {
            'accept': 'application/json',
            'x-access-token': 'f03026323815179d42698e6c049ea14d',
        },
    }); 
        

    let topuser = await topRq.text();
    topuser = JSON.parse(topuser);
    console.log(topuser);

    let name = topuser.name + " " + topuser.surname + " (@" + topuser.nick + ")";
    let added = addedUsers[topUser];
    let removed = removedUsers[topUser];
    let pfp = topuser.avatar_url;

    document.getElementById("dneImg").src = pfp;
    document.getElementById("dneJmeno").innerHTML = name;
    document.getElementById("dnePlus").innerHTML = "+"+added;
    document.getElementById("dneMinus").innerHTML = "-"+removed;
}

function uptime() {
    let now = new Date().getTime() - 7200;
    let uptime = now - startTime;
    let seconds = Math.floor((uptime / 1000) % 60);
    let minutes = Math.floor((uptime / (1000 * 60)) % 60);
    let hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    let days = Math.floor((uptime / (1000 * 60 * 60 * 24)) % 24);
    document.getElementById("uptime").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
}

updateStats();

setInterval(uptime, 1000);
setInterval(updateStats, 10000);
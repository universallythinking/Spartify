$(document).ready(function () {
    var party;
    var userPrompt;
        try {
            $.ajax({
            async: false,
            type: "GET",
            url: "https://api.spotify.com/v1/me",
            headers: { 'Authorization': 'Bearer ' + access_token },
            dataType: "json",
            data: "formdata",
            success: function (userData) {
                localStorage['userID'] = userData.id;
                userID = localStorage['userID'];
            }
        });
            do {
                if (localStorage['Snapster'] && window.location.hash && (localStorage["host"] != true && localStorage["host"] != false && localStorage["host"] != "true" && localStorage["host"] != "false" && window.location.hash)) {
                    localStorage.setItem("host", true);
                    obj2 = {};
                    userPrompt = prompt("Enter Your LastFM Username");
                    localStorage.setItem("lastFM", userPrompt);
                    party = prompt("Name Your Party");
                    localStorage.setItem("party", party);
                    if ((localStorage["party"] != null && localStorage["party"] != undefined) && (localStorage["lastFM"] != null && localStorage["lastFM"] != undefined)) {
                        snapsterPlaylist();
                        upcomingSongs();
                    }
                    else {
                        userPrompt = prompt("Enter Your LastFM Username");
                        localStorage.setItem("lastFM", userPrompt);
                        party = prompt("Name Your Party");
                        localStorage.setItem("party", party);
                        $("#results").hide().fadeIn('fast');
                    }
                    obj2["party"] = localStorage["party"];
                    obj2["lastFM"] = localStorage["lastFM"];
                    obj2["playlist"] = localStorage['Snapster'];
                    obj2["access_token"] = window.location.href;
                    obj2["username"] = localStorage['userID'];
                    console.log(obj2);
                        $.ajax({
                            dataType: "json",
                            type: "POST",
                            data: obj2,
                            url: '/create',
                            success: function (accessDataset) {
                                localStorage.setItem("host", true);
                                console.log(accessDataset);
                                var token = accessDataset;
                                upcomingSongs();
                                currentSong();
                                snapsterPlaylist();
                                window.location.reload();
                                console.log(token.results);
                            }
                        });
                        break;
                }
                else {
                    upcomingSongs();
                    snapsterPlaylist();
                }
            }
            while (localStorage["host"] != true && localStorage["host"] != false && localStorage["host"] != "true" && localStorage["host"] != "false" && window.location.hash);
    }
    catch (exception) {
        console.log(exception);
    }
});

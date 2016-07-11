$(document).ready(function () {
    window.snapsterPlaylist = function () {
            var playlists = [];
            var userID;
            try {
                if (localStorage["userID"]) {
                    console.log("User ID Exists");
                }
                else {
                    $.ajax({
                        async: false,
                        type: "GET",
                        url: "https://api.spotify.com/v1/me",
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        dataType: "json",
                        data: "formdata",
                        success: function (userData) {
                            localStorage['userID'] = userData.id;
                        }
                    });
                }
                if (localStorage["userID"]) {
                    $.ajax({
                        async: false,
                        type: "GET",
                        url: "https://api.spotify.com/v1/users/" + localStorage['userID'] + "/playlists",
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        dataType: "json",
                        data: "formdata",
                        success: function (data) {
                            for (i = 0; i < data.items.length; i++) {
                                playlists.push(data.items[i].name);
                            }
                            var partyPlaylist = playlists.indexOf("Partify");
                            if (playlists.indexOf("Partify") > -1) {
                                localStorage['Snapster'] = data.items[partyPlaylist].id;
                            }
                            else {                            
                                baseURL = "https://api.spotify.com/v1/users/";
                                searchQry = document.getElementById('filename').value;
                                sendInfo = { "name": "Partify", "public": true, }
                                $.ajax({
                                    async: false,
                                    type: "POST",
                                    url: "https://api.spotify.com/v1/users/" + localStorage['userID'] + "/playlists",
                                    headers: { 'Authorization': 'Bearer ' + access_token },
                                    dataType: "application/json",
                                    data: JSON.stringify(sendInfo),
                                    success: function (dataFirst) {
                                        $.ajax({
                                            async: false,
                                            type: "GET",
                                            url: "https://api.spotify.com/v1/users/" + localStorage['userID'] + "/playlists",
                                            headers: { 'Authorization': 'Bearer ' + access_token },
                                            dataType: "json",
                                            data: "formdata",
                                            success: function (data) {
                                                localStorage['Snapster'] = data.items[partyPlaylist].id;
                                            }
                                        });
                                    }
                                });
                            }

                        }
                    });
                }
            }
            // });
            catch (exception) {
                console.log("TEST");
            }
        }
});

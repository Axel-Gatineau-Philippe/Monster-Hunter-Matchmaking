(function() {
    'use strict';

    let criticalError = function() {
        $(this).html('Erreur critique');
    }

    let getAndDisplayPlayers = function(json) {
        let players = [];

        $.ajax({
            url: json,
            method: 'GET'
        }).done(function(data) {
            $('#div-pseudo').append($('<b </b>').append("Joueurs")).append('<br/><br/>')

            data.forEach(function(d) {
                let player = new Player(
                    d['id'],
                    d['playerID'],
                    d['HR'],
                    d['role']
                );
                players.push(player);

                $('#div-pseudo').append($('<b </b>').append("Nom : "))
                    .append(player.name).append('<br />')
                    .append($('<b </b>').append("Niveau : "))
                    .append(player.level).append('<br />')
                    .append($('<b </b>').append("Rôle : "))
                    .append(player.role).append('<br />')
                    .append($('<b </b>').append("Grade : "))
                    .append(player.grade).append('<br />')
                    .append('<br />')


            });
        }).fail(criticalError);

        return players;
    };

    let generateTeams = function(players) {
        let teams = [];
        let playerIndexesSorted = [];

        for (let i = 0; i < 25; ++i) { // 25 teams
            let team = [];
            let rolesNeeded = ['DPS', 'DPS', 'Tank', 'Healer'];
            let levelsNeeded = ['Noob', 'Noob', 'Veteran', 'Veteran'];
            let firstPlayerLevel = 0;

            let loopCounter = 1;

            for (let j = 0; j < 4; ++j) { // 4 players in a team
                let index = Math.floor(Math.random() * Math.floor(players.length));
                while (playerIndexesSorted.indexOf(index) !== -1) { // While in
                    index = Math.floor(Math.random() * Math.floor(players.length));
                }

                if (loopCounter >= 99) {
                    team.push(players[index]);
                    playerIndexesSorted.push(index);
                } else {
                    let isRoleNeeded = rolesNeeded.indexOf(players[index].role);
                    if (isRoleNeeded !== -1) { // If in

                        if (document.getElementById('radio-equilibre').checked) {
                            let isLevelNeeded = levelsNeeded.indexOf(players[index].grade);

                            if (isLevelNeeded !== -1) { // If in
                                rolesNeeded.splice(isRoleNeeded, 1);
                                levelsNeeded.splice(isLevelNeeded, 1);

                                team.push(players[index]);
                                playerIndexesSorted.push(index);
                            } else {
                                --j;
                                ++loopCounter;
                            }

                        } else if (document.getElementById('radio-niveau').checked) {
                            if (firstPlayerLevel === 0)
                                firstPlayerLevel = players[index].level;

                            if (players[index].level >= firstPlayerLevel - 10 && players[index].level <= firstPlayerLevel + 10) {
                                rolesNeeded.splice(isRoleNeeded, 1);

                                team.push(players[index]);
                                playerIndexesSorted.push(index);
                            } else {
                                --j;
                                ++loopCounter;
                            }

                        } else {
                            rolesNeeded.splice(isRoleNeeded, 1);

                            team.push(players[index]);
                            playerIndexesSorted.push(index);
                        }
                    } else {
                        --j;
                        ++loopCounter;
                    }
                }
            } // for (4)

            teams.push(team);
        } // for (25)

        return teams;
    };

    let displayTeams = function(teams) {
        $('#div-equipe').empty();

        let count = 1;

        teams.forEach(function(team) {
            $('#div-equipe').append($('<b </b>').append('Equipe ' + count)).append('<br /><br />');

            team.forEach(function(player) {
                $('#div-equipe').append($('<center </center>').append(
                    $('<table </table>')
                    .append($('<tr </tr>')
                        .append($('<th> </th>').append("Nom"))
                        .append($('<th> </th>').append("Niveau"))
                        .append($('<th> </th>').append("Rôle"))
                        .append($('<th> </th>').append("Grade")))
                    .append($('<tr </tr>')
                        .append($("<td class='nameCell'>" + player.name + "</td>"))
                        .append($("<td class='levelCell'>" + player.level + "</td>"))
                        .append($("<td class='roleCell'>" + player.role + "</td>"))
                        .append($("<td class='gradeCell'>" + player.grade + "</td>")))
                    .append('<br /><br />')));
            });

            $('#div-equipe').append('<br /><br />');
            ++count;
        });

        $('.roleCell').each(function(i, obj) {
            if (obj.innerText === 'DPS') {
                obj.style.backgroundColor = 'red';
                obj.style.color = 'white';
            } else if (obj.innerText === 'Tank') {
                obj.style.backgroundColor = 'blue';
                obj.style.color = 'white';
            } else if (obj.innerText === 'Healer') {
                obj.style.backgroundColor = 'green';
                obj.style.color = 'white';
            }
        });
    };

    $(document).ready(function() {
        let players = getAndDisplayPlayers('js/players.json');

        $('#button-equipe').click(function() {
            $('#button-equipe').hide();
            $('#button-retour').show();

            let teams = generateTeams(players);
            displayTeams(teams);

            $('#div-pseudo').hide();
            $('#div-equipe').show();
        });

        $('#button-retour').click(function() {
            $('#button-retour').hide();
            $('#button-equipe').show();
            $('#div-equipe').hide();
            $('#div-pseudo').show();
        });
    });
})();

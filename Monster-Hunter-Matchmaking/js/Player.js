let Player;
(function() {
  "use-strict";

  Player = function(id, name, level, role) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.role = role;

    if (this.level < 30)
      this.grade = 'Noob';
    else
      this.grade = 'Veteran';
  }
})();

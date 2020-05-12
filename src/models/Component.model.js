
export var Component = function(
    name,
    template,
    // isolated
){
    this.name = name;
    this.template = template instanceof Array
        ? template
        : [template];
    // this.isolated = isolated;
}

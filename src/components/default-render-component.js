
export var defaultRenderComponent = function(
    template,
    childTemplate
){
    template.element.innerHTML = childTemplate;
}

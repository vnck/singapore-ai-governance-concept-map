window.onloadFuncs = [];
window.onload = () => {
    window.onloadFuncs.forEach(f => f());
}
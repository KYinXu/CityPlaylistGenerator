window.onload = () => {
    const myModal = new bootstrap.Modal('#welcome');
    myModal.show();
}
function testFunction(){
    console.log("test")
}
function showHint(hint_id){
    var tb = document.getElementById(hint_id);
    if (tb.style.visibility == "visible") {
        tb.style.visibility = "hidden";
    }
    else {
        tb.style.visibility = "visible";
    }
        
    console.log('success');
}
async function getLogin() {
    const response = await fetch('http://127.0.0.1:5500/login', {
        headers: {'Access-Control-Allow-Origin': 'http://127.0.0.1:5500'}
    });
    console.log(await response.json());
}
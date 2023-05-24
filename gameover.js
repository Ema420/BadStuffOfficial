


function fillDiv() {
    const sign = document.querySelector("#sign");
    const form = document.createElement('input');
    const click = document.createElement('input');
    
    
    form.setAttribute("id","name");
    form.setAttribute("type","text");
    click.setAttribute("id","button");
    click.setAttribute("type","button");
    click.setAttribute("value","Invia");
    click.setAttribute("onclick","saveScore()");
    
    document.onkeydown = function check(e) {
        
        if(e.key == 'Enter'){
            saveScore();
        }else {
            return;
        }
    }
    
    
    for( let i = 0 ; i<localStorage.length ; i++){
        console.log(localStorage.getItem(i));
        } 


    sign.appendChild(form);
    sign.appendChild(click);


}

function saveScore() {
    const string = new String();
    const form = document.querySelector("#name");
    const name = form.value;

}
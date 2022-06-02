function searchHandler() {
    const element = document.getElementById("mySelect");
    if(element){
        element.remove();
        console.log("here")
    }
    const text = document.getElementById("searchText").value;

    const req = new XMLHttpRequest;
    req.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
            const data = await JSON.parse(this.responseText);
            let myParent = document.getElementById("searchText").parentElement;

            // Create array of options to be added
            let value = [];

            data.map(obj => value.push(obj.tag))

            console.log(value);

            // Create and append select list
            let selectList = document.createElement("select");
            selectList.id = "mySelect";
            myParent.appendChild(selectList);

            // Create and append the options
            for (let i = 0; i < value.length; i++) {
                let option = document.createElement("option");
                option.value = value[i];
                option.text = value[i];
                selectList.appendChild(option);
            }
        }
    }
    req.open("GET", "http://localhost:3000/searchTag?value=" + text, true);
    req.send();
}
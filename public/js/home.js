const clickHandler = () => {
    let selectedTags = [];
    for (let tag of document.getElementById('author').options) {
        if (tag.selected) {
            selectedTags.push(tag.value);
        }
    }

    for (let tag of document.getElementById('concept').options) {
        if (tag.selected) {
            selectedTags.push(tag.value);
        }
    }

    const req = new XMLHttpRequest;
    req.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
            const data = await JSON.parse(this.responseText);
            document.getElementById("title").innerHTML = data[0].problemName;
        }
    };
    req.open("POST", "http://localhost:3000/getAllProblems", true);
    req.setRequestHeader("Content-Type", "application/json");

    let data = {tags: selectedTags};

    req.send(JSON.stringify(data));
}

const checkHandler = () => {
    let selectedTgs = [];
    for(let tag of document.getElementsByClassName('tags').name){
        selectedTgs.push(tag);
        document.getElementById("selectedTags").innerHTML = selectedTgs;
    }
}

// const convertHTML = () => {

//     const problemContent = document.getElementById("problemData").innerHTML;
//     document.getElementById("problemContent"),innerHTML = problemContent;
// }

// console.log(problemContent);



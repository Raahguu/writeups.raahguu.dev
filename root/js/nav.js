fetch("/root/html/nav.html")
.then((response) => response.text())
.then((data) => { 
    let old_element = document.getElementById("replace-with-navbar"); 
    let new_element = new DOMParser().parseFromString(data, "text/html").querySelector("nav"); 
    old_element.parentNode.replaceChild(new_element, old_element); 
})
.catch((err) => console.log(err));
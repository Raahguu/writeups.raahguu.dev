fetch("/root/html/nav.html")
.then((response) => response.text())
.then((data) => { 
    let old_element = document.getElementById("replace_with_navbar"); 
    old_element.parentNode.replaceChild(new_element, data); 
})
.catch((err) => console.log(err));
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function handleNext(){
    
    if (document.getElementById('chloro').checked) {
         window.location.assign("http://localhost/geojson_rendering/chloro.html")
    }
    if (document.getElementById('categorychloro').checked) {
         window.location.assign("http://localhost/geojson_rendering/category.html")
    }
    if (document.getElementById('barchart').checked) {
        window.location.assign("http://localhost/geojson_rendering/barchart.html")
    }
    
}
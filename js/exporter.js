/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 function exportAsHTML(){
         
         console.log("export AS html");
         
       var html = d3.select("#overlaymap")
        .attr("title", "test2")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

        document.getElementById("downloadwindow").style.display='inline';

    d3.select("#downloadwindow").append("div")
        .attr("id", "download")
        .style("top", event.clientY+"px")
        .style("left", event.clientX+"px")
        .html("Right-click on this preview and choose Save as<br />Left-Click to dismiss<br />")
        .append("img")
        .attr("src", "data:image/svg+xml;base64,"+ btoa(html));

    d3.select("#download")
        .on("click", function(){
            if(event.button == 0){  //left mouse
                d3.select(this).transition()
                    .style("opacity", 0)
                    .remove();
            document.getElementById("downloadwindow").style.display='none';
            
            }
        })
        .transition()
        .duration(100)
        .style("opacity", 1);

      
     }
   

function exportAsPNG(){
    
    
     console.log("export AS png");
    
    
    
        // Select the first svg element
        var svg = d3.select("svg")[0][0],
            img = new Image(),
            serializer = new XMLSerializer(),
            svgStr = serializer.serializeToString(svg);
    
    console.log(svg);

    d3.select("#downloadwindowImg").append("div")
        .attr("id", "text")
        .style("top", event.clientY+"px")
        .style("left", event.clientX+"px")
        .html("Right-click on this preview and choose Save as<br />Left-Click to dismiss<br />");

    img.src = 'data:image/svg+xml;base64,'+window.btoa(svgStr);
    
    //make the preview window visible
    document.getElementById("downloadwindowImg").style.display='inline';


    var canvas = document.createElement("canvas");
    document.getElementById("downloadwindowImg").appendChild(canvas);
    
    //draw the image
    var w=1000,h=1000;
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(img,0,0,w,h);
    // right click and save as png
    
    
    d3.select("#downloadwindowImg")
        .on("click", function(){
            if(event.button == 0){  //left mouse
                d3.select(this).transition()
                    .style("opacity", 0)
                    ;
            document.getElementById("downloadwindowImg").style.display='none';
            canvas.remove();
            document.getElementById("text").remove();
            }
        })
        .transition()
        .duration(100)
        .style("opacity", 1);
    
};
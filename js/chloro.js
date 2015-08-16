/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



        
    var infoContainer;
    var circle;   
     
        
        
        
    var metric;
      
    var fillcolor ;
    var strokecolor;
    var strokewidth;
    var opacity;
    
    var zoom;
    var dataset;
    var geojsonFile;
    var file;
    
    
    var svg;
    var g;
    var lbl;
    var projection;
    var path;
    var scale;
     var width = 1000,height = 1000;
     var headerNames;
     var barchart;
     
     
     var tooltipDiv;
     var bodyNode = d3.select('body').node();
     
     function exportAsHTML(){
         
         
       var html = d3.select("svg")
        .attr("title", "test2")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

        document.getElementById("downloadwindow").style.display='inline';

    d3.select("#downloadwindow").append("div")
        .attr("id", "download")
        .style("top", event.clientY+20+"px")
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
    
     
    function setMapProperties(){
         
        strokecolor =document.getElementById('strokecol').value;
        strokewidth = document.getElementById('strokewid').value;
        fillcolor = document.getElementById('fillcol').value;
        opacity = document.getElementById('opacit').value;
        
        svg.attr("stroke",strokecolor)
            .attr("stroke-width",strokewidth)
            .attr("opacity",opacity)
            .selectAll("path")
            .style("fill",function(d){
                        // get the data value
                       var val = d.properties.Value;
                       var col = getColour(val);
                        return col;
                    });
     }
     
     function loadMetrics(){
          d3.select("#selectmetric")
                 .selectAll("options")
                 .data(headerNames)
                 .enter()
                 .append("option")
                 .attr("value", function(d){ return d })
                 .text(function(d) {
                     
                     if(d === headerNames[0]){
                         
                     }else{
			d = d[0].toUpperCase() +
				d.substring(1,3) + "" + 
					d.substring(3);
			return d
			
                    } });
     }  
     
     function selectMetric(){        
         
         var obj = document.getElementById("selectmetric");   
         metric = obj.options[obj.selectedIndex].text;
         console.log(metric);
          loadVisualization(); 
     }    
     
     
     function getCSVFilePath(){
                d3.select("#csvInput")
                        .append("input")
                .attr("type", "file")
                .attr("accept", ".csv")
                .style("margin", "5px")
                .on("change", function() {
                  var file = d3.event.target.files[0];
                  if (file) {
                    var reader = new FileReader();
                      reader.onloadend = function(evt) {
                        var dataUrl = evt.target.result;
                        // The following call results in an "Access denied" error in IE.
                        loadCSVFile(dataUrl);
                    };
                   reader.readAsDataURL(file);
                  }
               });
            }
            
   
       
    
     
    function loadCSVFile(csvUrl){
      
      
      //alert(file.url);
   
    d3.csv(csvUrl,function(error,data){
        //asynchronous method, rest of your code is executed even while JavaScript is simultaneously waiting for the file to finish downloading into the browser.
               
        if(error){
          //  console.log(error);
        }else{   
            dataset = data;
            headerNames = d3.keys(dataset[0]);
            loadMetrics();
                      
        }
    });
    //disable the upload button
    document.getElementById("upload").disabled = true;
    }
    
    

    function loadVisualization(){

    console.log("Visualizing started");

            //converting file to geoJson 
          shp("shapefiles/LKA_adm.zip").then(function(geoJson) {
              
                //merging csv data with geojson data
                geojsonFile = geoJson[1];      

                for(var i=0;i<dataset.length;i++){
                    //iterate through each district in data file
                    var districtName = dataset[i][headerNames[0]];


                    //Grab data value, and convert from string to float
                    var dataValue = parseFloat(dataset[i][metric]);               


                    //Get the corresponding district from geoJson file

                    for(var j=0;j<geojsonFile.features.length;j++){

                        var geoDistrict = geojsonFile.features[j].properties.NAME_1;

                        if(geoDistrict == districtName){
                            //assign a new variable to geojson object containing data value                         
                            geojsonFile.features[j].properties.Value = dataValue;

                        }                   


                    }
                }        


                


              


                  
                 //create the svg element 



                

              //project the map on a flat surface using guesses
             projection = d3.geo.mercator()                       
                .scale(1)
                .translate([0, 0]);
        
            //geographic path generator(translate coordinates to pixels on the canvas)
             path = d3.geo.path()
                .projection(projection);
        
        console.log("width "+width);
                console.log("height "+height);
        
        // using the path determine the bounds of the current map and use 
             // these to determine better values for the scale and translation
            var b = path.bounds(geojsonFile),
                s = .5 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                 //scaled the bounding box to 95% of the canvas, rather than 100%, so there’s a little extra room on the edges for strokes and surrounding features or padding.
                t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
                
                console.log("scale "+s);
                console.log("translate "+t);
            // new projection
              projection = d3.geo.mercator()
                             .scale(s).translate(t);
               path = path.projection(projection);
            
              
            //Make an SVG Container to include the barchart
            infoContainer = d3.select('#barchart').append("p")
                                     .attr("width", 300)
                                    .attr("height", 300);
   
                    circle = infoContainer.append("p");
                    
              //creating the canvas to hold the map
             svg = d3.select('#map').append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    ;
                    
                         

                  g = svg.append("g");
                  
                  
                g.selectAll("path")
                        .data(geojsonFile.features)
                        .enter()
                        .append("path")
                        .attr("d", path)
                        .attr("stroke",strokecolor)
                        .attr("stroke-width",strokewidth)
                        .attr("opacity",opacity)
                        .on("mouseover", function(d){
                            
                            var val = d.properties.Value;
                             var col = getOppositeColour(getColour(val));
                            d3.select(this).style("fill",col);
                            
                           //remove previous tooltip
                            d3.select('body').selectAll('div.tooltip').remove();
                            // Append tooltip
                            tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
                            var absoluteMousePos = d3.mouse(bodyNode);
                            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                                .style('top', (absoluteMousePos[1] - 15)+'px')
                                .style('position', 'absolute') 
                                .style('z-index', 1001);
                            // Add text 
                           if(d.properties.Value === undefined){
                               tooltipDiv.html(d.properties.NAME_1+"<br/>"+"unavailable");
                           }else{
                            tooltipDiv.html(d.properties.NAME_1+"<br/>"+d.properties.Value);
                        }
                            })
                        .on("mouseout",function(d){
                             var val = d.properties.Value;
                             var col = getColour(val);
                            d3.select(this).style("fill",col);
                            
                            // Remove tooltip
                            tooltipDiv.remove();
                            
                            })
                                               
                        .style("fill",function(d){
                            // get the data value
                           var val = d.properties.Value;
                           var col = getColour(val);

                            return col;
                        })
                        .on("click",function(d){
                            
                            loadbarchart();
                           
                                                                      ;
                                    
                        })                   
                       ;
                       
               //adding csv value to the map
          /*   lbl =  svg.selectAll(".subunit-label")
                  .data(geojsonFile.features)
                    .enter().append("text")
                    .attr("class", function(d) { return "subunit-label " + d.id; })
                    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .text(function(d) { 
                        
                        if(d.properties.Value === undefined){
                            return d.properties.NAME_1;
                         }
                        else{
                             return d.properties.NAME_1+"\n"+d.properties.Value;
                        }
                    });    

           */
            
            
            //zooming and panning
            
            zoom = d3.behavior.zoom()   //creates event listeners
                    .on("zoom",function() {
                g.attr("transform","translate("+ 
                    d3.event.translate.join(",")+")scale("+d3.event.scale+")");
               
                
                });

            svg.call(zoom);



            
            });





    }
   
   function loadbarchart(){
         
        
               circle.style("fill",function() {
                        return "hsl(" + Math.random() * 360 + ",100%,50%)";
                        })
                       .html(function(d){
                           
                          return "abcd";
                           
               });
     }
    
    

    
    

   

  
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 
 var display;
 var dataset;
 var shapefile;
 var metric;
 var headerNames;
 var category;
 var keys = [];
 var svg;
 var tooltipDiv;
 
 var colorset = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"];
 
 
 
 
 var shpfile;
 var csvfile;
 var layer;
 var g;
 
 var gm_projection;
 var path;
 var width=1000;
 var height=1000;
 
 var gm_path;
 var gm_d3_map;
    var legend,svgLegend;
 
   var legendRectSize = 18;                                  
  var legendSpacing = 4;  
 
  var tooltipDiv;
     var bodyNode = d3.select('body').node();
     
     var color = d3.scale.ordinal();  
     
     function LoadLegendFromInput(){
         
          svgLegend.append("circle")
                         .attr("cx", 20)
                        .attr("cy", 20)
                      .attr("r", 10)
                      .style("fill",color);
     }
     
      
     
     function loadLegendFromScheme(){
         
         
                    svgLegend.append("circle")
                         .attr("cx", 20)
                        .attr("cy", 20)
                      .attr("r", 10)
                      .style("fill",color);
     }
     
     
     
      function initialise(){
                // Create the Google Map…
     map = new google.maps.Map(d3.select("#googlemap").node(), {
                     center: new google.maps.LatLng(0,0),
                     zoom: 7,
                     zoomControl: true,
                     zoomControlOptions: {
                         style: google.maps.ZoomControlStyle.SMALL
                     },
                     mapTypeId: google.maps.MapTypeId.ROADMAP
                 });
                
    //add legend to the right bottom of gmap
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legend'));
             
      //--add legend ------------
    legend = d3.select('#legend').append("g").selectAll("g").data(color.domain())
      .enter().append('g').attr('class', 'legend');
      
      
    svgLegend = legend.append("svg").attr("width", 20).attr("height", 35);
  
    legend.append('text').attr('x', legendRectSize + legendSpacing).attr('y',
      legendRectSize - legendSpacing).text(function(d) {
      return d;
    });
  
    loadLegendFromScheme();
            
                
              
                overlay = new google.maps.OverlayView();
                
                
                overlay.onAdd =  function (){
                   console.log("overlayadd_start");
                  layer = d3.select(this.getPanes().overlayMouseTarget)
                        .append('div') 
                        .append('svg')
                        .attr('class','mapsvg')
                        .attr('width', 1000)
                        .attr('height', 1000)  ;
     
                
                   g = layer.append("g");
                   
                   
                   
                     //---gettting the initial center, scale
                   
                                gm_projection = overlay.getProjection();
              gm_path = d3.geo.path().projection(function(coordinates) {
                  var google_coordinates = new google.maps.LatLng(coordinates[1],
                      coordinates[0]);
                  var pixel_coordinates = gm_projection.fromLatLngToDivPixel(
                      google_coordinates);
                  return [pixel_coordinates.x, pixel_coordinates.y];
              });
              var b = gm_path.bounds(shapefile);
               //scale           
              var s = (1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) /
                  height));
              console.log(s);
              var center = [Math.floor((b[1][0] + b[0][0]) / 2), Math.floor((b[1][1] + b[0]
                  [1]) / 2)];
               // console.log(center);
              var _center = gm_projection.fromContainerPixelToLatLng(new google.maps.Point(
                  center[0], center[1]));
                   
                   
              map.panTo(_center);
              // map.setZoom(0);
                map.setZoom(5);
                
                overlay.draw = function(){
                    console.log("overlaydraw_start");
                    
                    document.getElementById("label").checked = false;
                    removeLabels();
              
                        gm_projection = overlay.getProjection();

                        gm_path = d3.geo.path().projection(gm_d3_map_proj);
                        
                        
                     // these to determine better values for the scale and translation
            
                        
                         gm_d3_map= g.selectAll("path")
                               .data(shapefile.features)
                               .attr("d",gm_path)
                               .enter().append("svg:path")
                               .attr("d",gm_path)
                               .attr("class","svgoverlay")
                               .style("fill",function(d){
                                     // get the data value
                                    var val = d.properties.Value;
                                   // var col = getColourOrdinal(val);
                                     return  color(val);
                                 })
                                 .on("mouseover", function(d){
                                   console.log("mouseover");
                                    //remove previous tooltip
                                     d3.select('body').selectAll('div.tooltip').remove();
                                     // Append tooltip
                                     tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
                                     var absoluteMousePos = d3.mouse(this);
                                     tooltipDiv.style('left', (absoluteMousePos[0])-4000+'px')
                                         .style('top', (absoluteMousePos[1])-4000+'px')
                                         .style('position', 'absolute') 
                                         .style('z-index', 1001);
                                     // Add text to tooltip
                                    if(d.properties.Value === undefined){
                                        tooltipDiv.html(d.properties.NAME_1+"<br/>"+"unavailable");
                                    }else{
                                     tooltipDiv.html(d.properties.NAME_1+"<br/>"+d.properties.Value);
                                     }
                            })
                            .on("mouseout",function(d){
                            // Remove tooltip
                            tooltipDiv.remove();
                            
                            })
                                        
                       ;
                   


                       
                       
                       
                        function gm_d3_map_proj(coordinates){
                                var google_coordinates = new google.maps.LatLng(coordinates[1],coordinates[0]);
                                var pixel_coordinates = gm_projection.fromLatLngToDivPixel(google_coordinates);

                                return [pixel_coordinates.x+4000,pixel_coordinates.y+4000];

                }
                console.log("overlaydraw_end");
               
               };  
                console.log("overlayadd_end");
          };
          
        
        
          
            console.log("end of visual");
         //  map.panTo(new google.maps.LatLng(7,81));
          //  map.setZoom(7); 
              overlay.setMap(map);  
              
              
                
                }
               
                
          
     
 function setMapProperties(){
         
      var  strokecolor =document.getElementById('strokecol').value;
       var  strokewidth = document.getElementById('strokewid').value;        
       var opacity = document.getElementById('opacit').value;
        
        g.attr("stroke",strokecolor)
            .attr("stroke-width",strokewidth)
            .attr("opacity",opacity);
     }
     
 
  function loadVisualization(){
      
      console.log("Visualizing started");
      
    
/*    projection = d3.geo.mercator()                       
                .scale(1)
                .translate([0, 0]);
        
            //geographic path generator(translate coordinates to pixels on the canvas)
             path = d3.geo.path()
                .projection(projection);*/
        
     /*   
        
        // using the path determine the bounds of the current map and use 
             // these to determine better values for the scale and translation
           
              var  s = .5 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                 //scaled the bounding box to 95% of the canvas, rather than 100%, so there’s a little extra room on the edges for strokes and surrounding features or padding.
                t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2.3];
                
                console.log("scale "+s);
                console.log("translate "+t);*/
      /*  var b = path.bounds(shapefile);
            
            var center = [(b[1][0]+b[0][0])/2, (b[1][1]+b[0][1])/2];
            
            console.log(center);*/
      
  /*          var map_centre = new google.maps.Point;
            map_centre.x=Math.floor(center[0]);
            map_centre.y=Math.floor(center[1]);
            
             //convert the pixel values to lat and lng
                        var _center =  projection.fromContainerPixelToLatLng(map_centre);
                       //the the centre of the google map to be the centroid of the shapefile
                        map.setCenter(_center);

   
    */
    initialise();
    
    }
 
  function loadCategory(){
      if(dataset === undefined){          
          //if no data has been uploaded prompt a message and disable the next button          
          alert("dataset undefined");
          
      }else{     
          d3.select("#selectcategory")
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
			return d;
			} });
      }
     }  
     
    
     
     function selectCategory(){      
         var obj = document.getElementById("selectcategory");   
         category = obj.options[obj.selectedIndex].text;
         console.log(category);
         
         mapData();
         
      
     }  
 
 function mapData(){
     
     //console.log(dataset);
     
       for(var i=0;i<dataset.length;i++){
                    //iterate through each district in data file
                    var subunitName = dataset[i][headerNames[0]];
                  

                 
                    //Grab data value, and convert from string to float
                    var dataValue = (dataset[i][category]);               

                   
                    //Get the corresponding district from geoJson file

                    for(var j=0;j<shapefile.features.length;j++){

                        var geoDistrict = shapefile.features[j].properties.NAME_1;
                        

                        if(geoDistrict == subunitName){
                           
                            //assign a new variable to geojson object containing data value                         
                            shapefile.features[j].properties.Value = dataValue;
                          
                          
                          //if the array keys doesn't contain the value add it
                          if(keys.indexOf(dataValue) == -1) {
                              keys.push(dataValue);
                          }
                        }                   


                    }
                }  
              //  console.log("keys "+keys);
     //set the distinct values in the selected metric of the data as the domain for the color function
     color.domain(keys);
     
     
         //create a color palatte for each type of data
       d3.select("#colorsetter").selectAll("p")
            .data(keys)
            .enter().append("label")
            .text(function(d) { return d; })
            .append("input")            
            .attr("type", "color")
            
            .attr("id", function(d,i) { return i; })            
            ;
            
           
    //set  colorsetter visible
     document.getElementById('colorsetter').style.display = 'inline';
     for(var i=0; i<keys.length;i++){
         if(i>=colorset.length){
             document.getElementById(i).value = colorset[i-colorset.length]; //colors are repeated
         }else{
         document.getElementById(i).value = colorset[i]; // assign the colors when no color is repeated
        }
     }
     loadVisualization();
 }
 function submitInitialValues(){
     
   //default colours 
   color.range( colorset);
   loadCategory();
     
     
 }
 
 
 function setCategoryColours(){
     
     
     
   if(document.getElementById('defaultcol').checked){
        
     //document.getElementById('defaultcol').disabled = document.getElementById('defaultcol').disabled ? false : true;
     color.range(colorset);
     loadLegendFromScheme();
     }else{
     
         
      var col=[];
         var i;
         for(i=0;i<keys.length;i++){
             col.push(document.getElementById(i).value);
          
          //      console.log(document.getElementById(i).value);
         }
        
         color.range(col);
      
      LoadLegendFromInput();
     }
     
     
     changeRegionColours();
     
 }
 
 function changeRegionColours(){
                     g.selectAll("path")
                             .style("fill",function(d){
                                     // get the data value
                                    var val = d.properties.Value;
                                   // var col = getColourOrdinal(val);
                                     return  color(val);
                                 });
 }
 
 function loadbarchart(){
     document.getElementById("hover").style.display = 'inline';
     document.getElementById("barchartWindow").style.display = 'inline';
     
    var svg = dimple.newSvg("#barchartWindow", 500, 400);
     var data = dataset;
   
   var chart = new dimple.chart(svg, data);
    chart.addCategoryAxis("x", headerNames[0]);
    chart.addMeasureAxis("y", category);
    chart.addSeries(null, dimple.plot.bar);
    chart.draw();
     
 }


function removeBarChart(){
        document.getElementById("hover").style.display = 'none';
     document.getElementById("barchartWindow").style.display = 'none';
	}
        
        
function addLabels(){
     
        
        lbl =  g.selectAll(".subunit-label")
                  .data(shapefile.features)
                    .enter().append("text")
                    .attr("class", function(d) { return "subunit-label " + d.id; })
                    .attr("transform", function(d) { return "translate(" + gm_path.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .text(function(d) { 
                        
                        if(d.properties.Value === undefined){
                            return d.properties.NAME_1;
                         }
                        else{
                            // return d.properties.NAME_1+"\n"+d.properties.Value;
                             return d.properties.NAME_1;
                        }
                    });  
        
    }
    
    function removeLabels(){
       
        d3.selectAll(".subunit-label").remove();
        
    }
    
    function handleLabelCheck(){
        
        
        var checkbox = document.getElementById("label");
        
         if(checkbox.checked){
           addLabels();
        }else{
            removeLabels();
        }
    }
        

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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
 
 
 
 
 var shpfile;
 var csvfile;
 
 var projection;
 var path;
 var width=1000;
 var height=1000;
 
  var tooltipDiv;
     var bodyNode = d3.select('body').node();
     
     var color = d3.scale.ordinal();  
     
      function initialise(){
                    
                    
                
                // Create the Google Map…
                 map = new google.maps.Map(d3.select("#googlemap").node(), {
                    
                  zoom: 4,
                  center: new google.maps.LatLng(7, 81),
                  mapTypeId: google.maps.MapTypeId.TERRAIN
                });
                
              
                overlay = new google.maps.OverlayView();
                
                overlay.onAdd =  function (){
                   
                 var layer = d3.select(this.getPanes().overlayLayer)
                        .append('div') 
                        .append('svg')
                        .attr('width', 1000)
                        .attr('height', 1000)  
                        .append('g');
                
                overlay.draw = function(){
                    
              
                        gm_projection = overlay.getProjection();

                       var gm_path = d3.geo.path().projection(gm_d3_map_proj);
                       var gm_d3_map= layer.selectAll("path")
                               .data(shapefile.features)
                               .attr("d",gm_path)
                               .enter();

                       gm_d3_map.append("path")
                               .attr("d",gm_path)
                               .attr("fill","steelblue")
                               .attr("opacity",0.4)
                               .attr("stroke","black")
                                .attr("stroke-width",3);

                       console.log("overlaydraw");
                       
                       
                        function gm_d3_map_proj(coordinates){
                                var google_coordinates = new google.maps.LatLng(coordinates[1],coordinates[0]);
                                var pixel_coordinates = gm_projection.fromLatLngToDivPixel(google_coordinates);

                                return [pixel_coordinates.x,pixel_coordinates.y];

                }
                
                console.log("overlayadd");
               };      
          };
               
                
              overlay.setMap(map);  
                
                }
               
                
          
     
 function setMapProperties(){
         
      var  strokecolor =document.getElementById('strokecol').value;
       var  strokewidth = document.getElementById('strokewid').value;        
       var opacity = document.getElementById('opacit').value;
        
        svg.attr("stroke",strokecolor)
            .attr("stroke-width",strokewidth)
            .attr("opacity",opacity);
     }
     
 
  function loadVisualization(){
      
      console.log("Visualizing started");
      
      
      initialise();
     

    

              //project the map on a flat surface using guesses
             projection = d3.geo.mercator()                       
                .scale(1)
                .translate([0, 0]);
        
            //geographic path generator(translate coordinates to pixels on the canvas)
             path = d3.geo.path()
                .projection(projection);
        
        // using the path determine the bounds of the current map and use 
             // these to determine better values for the scale and translation
            var b = path.bounds(shapefile),
                s = .5 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
                 //scaled the bounding box to 95% of the canvas, rather than 100%, so there’s a little extra room on the edges for strokes and surrounding features or padding.
                t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2.3];
                
                console.log("scale "+s);
                console.log("translate "+t);
            // new projection
              projection = d3.geo.mercator()
                             .scale(s).translate(t);
               path = path.projection(projection);
            
              
            
                    
              //creating the canvas to hold the map
            svg = d3.select('#map').append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    ;
                    
                         

               var   g = svg.append("g");
                  
                  
                g.selectAll("path")
                        .data(shapefile.features)
                        .enter()
                        .append("path")
                        .attr("d", path)
                        .style("fill",function(d){
                            
                      
                       
                            // get the data value
                           var val = d.properties.Value;
                          // var col = getColourOrdinal(val);
                            return  color(val);
                        })
                        .on("mouseover", function(d){
                            
                           //  this .attr("opacity",opacity);
                           //remove previous tooltip
                            d3.select('body').selectAll('div.tooltip').remove();
                            // Append tooltip
                            tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
                            var absoluteMousePos = d3.mouse(this);
                            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                                .style('top', (absoluteMousePos[1] - 15)+'px')
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
                       
             
            
            //zooming and panning
            
            zoom = d3.behavior.zoom()   //creates event listeners
                    .on("zoom",function() {
                       
                g.attr("transform","translate("+ 
                    d3.event.translate.join(",")+")scale("+d3.event.scale+")");
                });

            svg.call(zoom);
            
            var legend = svg.select("#legend")
                            .data(color)
                            .enter().append("g")
                            .attr("class", "legend");
                    
                    legend.append("rect")
                            .attr("x", 20)
                            .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
                            .attr("width", ls_w)
                            .attr("height", ls_h)
                            .style("fill", function(d, i) { return color(d); })
                            .style("opacity", 0.8);

                            legend.append("text")
                            .attr("x", 50)
                            .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
                            .text(function(d, i){ return legend_labels[i]; });



    }
 
  
 
 
 function loadReview(){
     
     document.getElementById("Step5").innerHTML ="Shape File: "+ shpfile.name+"<br/>"+"Data File: "+ csvfile.name+"<br/>"+"Primary metric: "+ metric+"<br/>"+"Secondary Metric: "+ category;
 }
 
  function loadMetrics(){
      
      if(dataset === undefined){
          
          //if no data has been uploaded prompt a message and disable the next button
          
          alert("dataset undefined");
          document.getElementById('ButtonNext').disabled = 'disabled';
      }else{
      
      
          d3.select("#selectmetric")
                 .selectAll("options")
                 .data(headerNames)
                 .enter()
                 .append("option")
                 .attr("value", function(d){ return d })
                 .text(function(d) {     
                     
			d = d[0].toUpperCase() +
				d.substring(1,3) + "" + 
					d.substring(3);
			return d;
			
                     });
                
      }
     }  
     
  function loadCategory(){
      if(dataset === undefined){          
          //if no data has been uploaded prompt a message and disable the next button          
          alert("dataset undefined");
          document.getElementById('ButtonNext').disabled = 'disabled';
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
     
     function selectMetric(){  
         var obj = document.getElementById("selectmetric");   
         metric = obj.options[obj.selectedIndex].text;
         console.log(metric);
     } 
     
     function selectCategory(){      
         var obj = document.getElementById("selectcategory");   
         category = obj.options[obj.selectedIndex].text;
         console.log(category);
      
     }  
 
 function mapData(){
     
       for(var i=0;i<dataset.length;i++){
                    //iterate through each district in data file
                    var subunitName = dataset[i][metric];
                  

                 
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
               // console.log("keys "+keys);
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
     
     
 }
 function submitInitialValues(){
     setCategoryColours();
     document.getElementById('colorsetter').style.display = 'none';
     document.getElementById('map').style.display = '';
    document.getElementById('map-editor').style.display = 'inline';
     loadVisualization();
 }
 $('#defaultcol').change(function() {
   if($(this).is(":checked")) {
     $("#colorsetter").children().prop('disabled',true);
      return;
   }else{
        $("#colorsetter").children().prop('disabled',false);
   }
   //'unchecked' event code
});
 
 function setCategoryColours(){
     
     
     
   if(document.getElementById('defaultcol').checked){
        
     //document.getElementById('defaultcol').disabled = document.getElementById('defaultcol').disabled ? false : true;
     color.range( ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);
     
     }else{
     
         
      var col=[];
         var i;
         for(i=0;i<keys.length;i++){
             col.push(document.getElementById(i).value);
             console.log(document.getElementById(i).value);
         }
         console.log(col);
         color.range(col);
      
     }
     
     
     
     
 }
 
 function handleWizardNext()

        {
            

            if (document.getElementById('ButtonNext').name == 'Step2')

            {

                // Change the button name - we use this to keep track of which step to display on a click

                document.getElementById('ButtonNext').name = 'Step3';

                document.getElementById('ButtonPrevious').name = 'Step1';

                // Disable/enable buttons when reach reach start and review steps

                document.getElementById('ButtonPrevious').disabled = '';

                // Set new step to display and turn off display of current step

                document.getElementById('Step1').style.display = 'none';

                document.getElementById('Step2').style.display = '';

                // Change background color on header to highlight new step

                document.getElementById('HeaderTableStep2').style.backgroundColor = 'Blue';

                document.getElementById('HeaderTableStep1').style.backgroundColor = 'Silver';

            }

            else if (document.getElementById('ButtonNext').name == 'Step3')

            {

                // Change the button name - we use this to keep track of which step to display on a click

                document.getElementById('ButtonNext').name = 'Step4';

                document.getElementById('ButtonPrevious').name = 'Step2';

                document.getElementById('Step2').style.display = 'none';

                document.getElementById('Step3').style.display = '';

                // Change background color on header to highlight new step

                document.getElementById('HeaderTableStep3').style.backgroundColor = 'Blue';

                document.getElementById('HeaderTableStep2').style.backgroundColor = 'Silver';
                
                loadMetrics();
            }

            else if (document.getElementById('ButtonNext').name == 'Step4')

            {
                  
                // Change the button name - we use this to keep track of which step to display on a click

                document.getElementById('ButtonNext').name = 'Step5';

                document.getElementById('ButtonPrevious').name = 'Step3';

                // Set new step to display and turn off display of current step

                document.getElementById('Step3').style.display = 'none';

                document.getElementById('Step4').style.display = '';

                // Change background color on header to highlight new step

                document.getElementById('HeaderTableStep4').style.backgroundColor = 'Blue';

                document.getElementById('HeaderTableStep3').style.backgroundColor = 'Silver';
                loadCategory();

            }

            else if (document.getElementById('ButtonNext').name == 'Step5')

            {
                

                // Change the button name - we use this to keep track of which step to display on a click

                document.getElementById('ButtonNext').name = '';

                document.getElementById('ButtonPrevious').name = 'Step4';

                // Disable/enable buttons when reach reach start and review steps

                document.getElementById('ButtonNext').disabled = 'disabled';

                document.getElementById('SubmitFinal').disabled = '';

                // Set new step to display and turn off display of current step

                document.getElementById('Step4').style.display = 'none';

                document.getElementById("Step5").style.display = 'block';

                // Change background color on header to highlight new step

                document.getElementById('HeaderTableStep5').style.backgroundColor = 'Blue';

                document.getElementById('HeaderTableStep4').style.backgroundColor = 'Silver';

                // Load table elements for final review step

                loadReview();

            }

        }
        
        
 function handleWizardPrevious()

        {

            if (document.getElementById('ButtonPrevious').name == 'Step1')

            {

                // Change the button name - we use this to keep track of which step to display on a click

                document.getElementById('ButtonNext').name = 'Step2';

                document.getElementById('ButtonPrevious').name = '';

                // Disable/enable buttons when reach reach start and review steps

                document.getElementById('ButtonPrevious').disabled = 'disabled';

                // Set new step to display and turn off display of current step

                document.getElementById('Step2').style.display = 'none';

                document.getElementById('Step1').style.display = '';

                // Change background color on header to highlight new step

                document.getElementById('HeaderTableStep1').style.backgroundColor = 'Blue';

                document.getElementById('HeaderTableStep2').style.backgroundColor = 'Silver';

            }

            else if (document.getElementById('ButtonPrevious').name == 'Step2')

            {
                document.getElementById('ButtonNext').disabled = false;

                // Change the button name - we use this to keep track of which step to display on a click

                document.getElementById('ButtonNext').name = 'Step3';

                document.getElementById('ButtonPrevious').name = 'Step1';

                // Set new step to display and turn off display of current step

                document.getElementById('Step3').style.display = 'none';

                document.getElementById('Step2').style.display = '';

                // Change background color on header to highlight new step

                document.getElementById('HeaderTableStep2').style.backgroundColor = 'Blue';

                document.getElementById('HeaderTableStep3').style.backgroundColor = 'Silver';

            }

            else if (document.getElementById('ButtonPrevious').name == 'Step3')

            {

                // Change the button name - we use this to keep track of which step to display on a click

                document.getElementById('ButtonNext').name = 'Step4';

                document.getElementById('ButtonPrevious').name = 'Step2';

                // Set new step to display and turn off display of current step

                document.getElementById('Step4').style.display = 'none';

                document.getElementById('Step3').style.display = '';

                // Change background color on header to highlight new step

                document.getElementById('HeaderTableStep3').style.backgroundColor = 'Blue';

                document.getElementById('HeaderTableStep4').style.backgroundColor = 'Silver';

            }

            else if (document.getElementById('ButtonPrevious').name == 'Step4')

            {

                // Change the button name - we use this to keep track of which step to display on a click

                document.getElementById('ButtonNext').name = 'Step5';

                document.getElementById('ButtonPrevious').name = 'Step3';

                // Disable/enable buttons when reach reach start and review steps

                document.getElementById('ButtonNext').disabled = '';

                document.getElementById('SubmitFinal').disabled = 'disabled';

                // Set new step to display and turn off display of current step

                document.getElementById('Step5').style.display = 'none';

                document.getElementById('Step4').style.display = '';

                // Change background color on header to highlight new step

                document.getElementById('HeaderTableStep4').style.backgroundColor = 'Blue';

                document.getElementById('HeaderTableStep5').style.backgroundColor = 'Silver';

            }

        }
  
function finish(){
    
    document.getElementById('SubscriptionWizard').style.display = 'none';
    mapData();
   
}


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


 function shpload(){

        var fileInput = document.getElementById('shpFileInput');


         shpfile = fileInput.files[0];


        var reader = new FileReader();
        reader.onload = function() {
        shp(this.result).then(function(geoJSON) {
            geojsonFile = geoJSON;

            console.log(geojsonFile);
        }, function(e) {
            console.log(e);
            alert("Your shapefile is corrupted or not in the required format.");
        });
        };
    reader.readAsArrayBuffer(shpfile);
    }
    
    function loadCSVFile(csvUrl){
   
    d3.csv(csvUrl,function(error,data){
        //asynchronous method, rest of your code is executed even while JavaScript is simultaneously waiting for the file to finish downloading into the browser.
        
        if(error){
          console.log(error);
        }else{   
          dataset = data;
           headerNames = d3.keys(data[0]);
          console.log(headerNames);
           loadMetrics();
              
        }
    });
    
    }
    
   
    
    
function loadCSV(){
           
		var fileInput = document.getElementById('csvFileInput');
		 

			csvfile = fileInput.files[0];
                       
                        var dataUrl;
                        
			var textType = ".ms-excel";

			if (csvfile.type.match(textType)) {
				var reader = new FileReader();
                                
				reader.onload = function(e) {					
                                        dataUrl = e.target.result;
                                        loadCSVFile(dataUrl);
				};
                               // reader.readAsText(file);
                               reader.readAsDataURL(csvfile);
					
			} else {
				display.innerText = "File not supported!";
			}                       
}
    
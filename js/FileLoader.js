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
        shapefile = geoJSON;
       
        console.log(shapefile);
    }, function(e) {
        console.log(e);
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
            console.log(dataset);
              submitInitialValues();
        }
    });
    
    }
    
   
    
    
function loadCSV(){
    
           
		var fileInput = document.getElementById('fileInput');
		 

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
				alert("File not supported!");
			}                       
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function getCentroid(shapefile){
    
      //get the centroid from the geoJson polygon in pixels
                        console.log("calculating centroid");
                         var center = gm_path.centroid(shapefile);
                        
                         //create a map point to hold the pixel values seperately
                         var map_centre = new google.maps.Point;
                         map_centre.x=Math.floor(center[0]);
                         map_centre.y=Math.floor(center[1]);
                         
                         //convert the pixel values to lat and lng
                        var _center =  gm_projection.fromContainerPixelToLatLng(map_centre);
                       //the the centre of the google map to be the centroid of the shapefile
                        return center;
    
    
}


                  
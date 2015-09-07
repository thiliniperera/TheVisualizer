/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




 

function getColour(value){

        

        //get colour method is called multiple times
        if(value === undefined){
           //the default color will be displayed
           return "#424242" ;
        }else{

             var val = Math.floor(((value- min())/(max()-min()))*100);
             
            if(fillcolor === undefined){
                //return blue color as the default color
                fillcolor = "#0101DF";
            }
             //converting hex fill col to decimal         
             var r =parseInt((fillcolor).substring(1,3).toString(16),16);  
             var g =parseInt((fillcolor).substring(3,5).toString(16),16);  
             var b =parseInt((fillcolor).substring(5,7).toString(16),16);  
             
             
              var h =rgbToHue(r,g,b);
        
              var col = "hsl("+h+",100%,"+val+"%"+")";
              
              
                
              return col;

            }
        }

    
    
    function rgbToHue(r, g, b){
          //convert rgb values to the range of 0-1
      var h;
      r /= 255, g /= 255, b /= 255;
        
        //find min and max values out of r,g,b components
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        
        if(max == r){
            //if red is the predominent color
            h = (g-b)/(max-min);
        }
       else if(max == g){
            //if green is the predominent color
            h = 2 +(b-r)/(max-min);
        }
        else if(max == b){
            //if blue is the predominent color
            h = 4 + (r-g)/(max-min);
        }
        
        h = h*60; //find the sector of 60 degrees to which the color belongs
        //https://www.pathofexile.com/forum/view-thread/1246208/page/45 - hsl color wheel
        
        if(h >0){
            return Math.floor(h);
        }
        else{
            return Math.floor(360 -h);
        }
}

    function rgba(r, g, b,a){

     
      return ["rgba(",r,",",g,",",b,",",a,")"].join("");
    }

    function max(){
        //return the max value of the data set
        var max = -Infinity;

       d3.selectAll("path")
               .each(function(d){
                   if(max < d.properties.Value){
                       max =d.properties.Value;
                   } 
                });

        return max;
    }

    function min(){
        //return the min value of the dataset
       var min = Infinity;

       d3.selectAll("path")
               .each(function(d){
                   if(min> d.properties.Value){
                       min =d.properties.Value;
                   } 
                });

        return min;
    }
    
    function getOppositeColour(color){
                
                //converting the colour into respective components and substracting by 255 to get the opposite colour
                var colorsOnly = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(/,\s*/),
                red = 255-colorsOnly[0],
                green =255- colorsOnly[1],
                blue = 255-colorsOnly[2],
                opacity = 1; //opacity doesn't change

                return rgba(red,green,blue,opacity);
        
            }

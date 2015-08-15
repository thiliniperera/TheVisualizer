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

             var val = ((value- min())/(max()-min()))*0.8;
            if(fillcolor === undefined){
                //return blue color as the default color
                return rgba(0,0,153,val);
            }else{        
             //converting hex fill col to decimal         
             var r =parseInt((fillcolor).substring(1,3).toString(16),16);  
             var g =parseInt((fillcolor).substring(3,5).toString(16),16);  
             var b =parseInt((fillcolor).substring(5,7).toString(16),16);  

            return rgba(r,g,b,val);
            }
        }

    }

    function rgba(r, g, b,a){

      r = Math.floor(r);
      g = Math.floor(g);
      b = Math.floor(b);
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

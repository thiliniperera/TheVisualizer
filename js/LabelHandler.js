/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


 function addLabels(){
     console.log("add lbl chk");
        
        lbl =  g.selectAll(".subunit-label")
                  .data(geojsonFile.features)
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
        console.log("remove lbl chk");
        lbl.remove();
        
    }
    
    function handleLabelCheck(){
        console.log("handle lbl chk");
        
        var checkbox = document.getElementById("label");
        
         if(checkbox.checked){
           addLabels();
        }else{
            removeLabels();
        }
    }
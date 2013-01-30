var colors = function(){
    //return d3.scale.ordinal().range(['#1BA1E2', '#8cbf26', '#f0aa25', '#8cbf26', '#cd4e21', '#ea99ac']);
    //return d3.scale.category20c();
    return d3.scale.ordinal().range(["#e5603b", "#eac85e", "#56bc76", "#618fb0"]);
    /*
    * .box.red{
     background: #e5603b;
     }

     .box.orange{
     background: #eac85e;
     }

     .box.green{
     background: #56bc76;
     }

     .box.blue{
     background: #618fb0;
     }
    */
}();

function keyColor(d, i) {
    return colors(d.key)
}

function testData(stream_names) {
    return stream_layers(stream_names.length, 64, .08).map(function(data, i) {
        return {
            key: stream_names[i],
            values: data
        };
    });
}
COLOR_VALUES = ["#e5603b", "#eac85e", "#56bc76", "#618fb0", '#2eb4dc', '#d04f4f'];

var colors = function(){
    //return d3.scale.ordinal().range(['#1BA1E2', '#8cbf26', '#f0aa25', '#8cbf26', '#cd4e21', '#ea99ac']);
    //return d3.scale.category20c();
    return d3.scale.ordinal().range(COLOR_VALUES);
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

     .box.teal{
     background: #2eb4dc;
     }

     .box.dark-red{
     background: #d04f4f;
     }
    */
}();

function keyColor(d, i) {
    return colors(d.key)
}

function testData(stream_names, points_count) {
    var now = new Date().getTime(),
        day = 1000 * 60 * 60 * 24, //milliseconds
        days_ago_count = 90,
        days_ago = days_ago_count * day,
        days_ago_date = now - days_ago,
        points_count = points_count || 45, //less for better performance
        day_per_point = days_ago_count / points_count;
    return stream_layers(stream_names.length, points_count, .08).map(function(data, i) {
        return {
            key: stream_names[i],
            values: data.map(function(d,j){
                return {
                    x: days_ago_date + d.x * day * day_per_point,
                    y: d.y * 100 //just a coefficient
                }
            })
        };
    });
}
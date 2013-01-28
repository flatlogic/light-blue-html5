var colors = function(){
    return d3.scale.ordinal().range(['#1BA1E2', '#8cbf26', '#f0aa25', '#8cbf26', '#cd4e21', '#ea99ac']);
    //return d3.scale.category20c();
    //return d3.scale.ordinal().range(["#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2"]);
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
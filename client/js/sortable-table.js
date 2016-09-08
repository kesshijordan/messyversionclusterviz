// ========== Adding Table code ============

var fieldHeight = 30;
var fieldWidth = 140;

var previousSort = null;
var format = d3.time.format("%m/%d/%Y");
//var dateFn = function(date) { return format.parse(d.created_at) };

var sub_data = [
    { "ID": 'Cluster_01', "Cluster_Size": "M", "IFOF": "12/4/1980", "Uncinate": 90, "SLF_tp": true},
    { "ID": 'Cluster_02', "Cluster_Size": "F", "IFOF": "10/23/1981", "Uncinate": 122, "SLF_tp": false},
    { "ID": 'Cluster_03', "Cluster_Size": "M", "IFOF": "1/12/1980", "Uncinate": 112, "SLF_tp": false},
    { "ID": 'Cluster_04', "Cluster_Size": "M", "IFOF": "4/23/1982", "Uncinate": 125, "SLF_tp": false},
    { "ID": 'Cluster_05', "Cluster_Size": "M", "IFOF": "8/25/1979", "Uncinate": 109, "SLF_tp": false},
    { "ID": 'Cluster_06', "Cluster_Size": "F", "IFOF": "10/26/1983", "Uncinate": 97, "SLF_tp": true},
    { "ID": 'Cluster_07', "Cluster_Size": "M", "IFOF": "9/4/1980", "Uncinate": 118, "SLF_tp": false},
    { "ID": 'Cluster_08', "Cluster_Size": "F", "IFOF": "6/22/1980", "Uncinate": 95, "SLF_tp": false},
    { "ID": 'Cluster_09', "Cluster_Size": "M", "IFOF": "2/14/1983", "Uncinate": 87, "SLF_tp": true},
    { "ID": 'Cluster_10', "Cluster_Size": "F", "IFOF": "11/3/1982", "Uncinate": 115, "SLF_tp": false}
];

var table_svg = d3.select("#table").append("svg")
    .attr("width", 700)
    .attr("height", 400);


var headerGrp = table_svg.append("g").attr("class", "headerGrp");
var rowsGrp = table_svg.append("g").attr("class","rowsGrp");


refreshTable(null);

function refreshTable(sortOn){

    // create the table header
    var header = headerGrp.selectAll("g")
        .data(d3.keys(sub_data[0]))
        .enter().append("g")
        .attr("class", "t_header")
        .attr("transform", function (d, i){
            return "translate(" + i * fieldWidth + ",0)";
        })
        .on("click", function(d){ return refreshTable(d);});

    header.append("rect")
        .attr("width", fieldWidth-1)
        .attr("height", fieldHeight);

    header.append("text")
        .attr("x", fieldWidth / 2)
        .attr("y", fieldHeight / 2)
        .attr("dy", ".35em")
        .text(String);

    // fill the table
    // select rows
    var rows = rowsGrp.selectAll("g.row").data(sub_data,
        function(d){ return d.ID; });

    // create rows
    console.log()
    var rowsEnter = rows.enter().append("svg:g")
        .attr("class","row")
        .attr("id", function(d){ return d.ID; })
        .attr("opacity",0.5)
        .attr("transform", function (d, i){
            return "translate(0," + (i+1) * (fieldHeight+1) + ")";
        })
        //.on('click', row_select )
        .on('mouseover', table_mouseDown )
        .on('mousedown', row_select );
    // select cells
    var cells = rows.selectAll("g.cell").data(function(d){return d3.values(d);});

    // create cells
    var cellsEnter = cells.enter().append("svg:g")
        .attr("class", "cell")
        .attr("transform", function (d, i){
            return "translate(" + i * fieldWidth + ",0)";
        });

    cellsEnter.append("rect")
        .attr("width", fieldWidth-1)
        .attr("height", fieldHeight);

    cellsEnter.append("text")
        .attr("x", fieldWidth / 2)
        .attr("y", fieldHeight / 2)
        .attr("dy", ".35em")
        .text(String);

    //update if not in initialisation
    if(sortOn !== null) {
        // update rows
        if(sortOn != previousSort){
            rows.sort(function(a,b){return sort(a[sortOn], b[sortOn]);});
            previousSort = sortOn;
        }
        else{
            rows.sort(function(a,b){return sort(b[sortOn], a[sortOn]);});
            previousSort = null;
        }
        rows.transition()
            .duration(500)
            .attr("transform", function (d, i){
                return "translate(0," + (i+1) * (fieldHeight+1) + ")";
            });

        //update cells
        // rows.selectAll("g.cell").select("text").text(String);
    }
}

function sort(a,b){
    if(typeof a == "string"){
        var parseA = format.parse(a);
        if(parseA){
            var timeA = parseA.getTime();
            var timeB = format.parse(b).getTime();
            return timeA > timeB ? 1 : timeA == timeB ? 0 : -1;
        }
        else
            return a.localeCompare(b);
    }
    else if(typeof a == "number"){
        return a > b ? 1 : a == b ? 0 : -1;
    }
    else if(typeof a == "boolean"){
        return b ? 1 : a ? -1 : 0;
    }
}

function row_select() {                           //onclick function to toggle on and off rows
    if($(this).css("opacity") == 0.5){				  //uses the opacity of the row for selection and deselection

        d3.selectAll('#' + this.id)
            .transition()
            .duration(50)
            .style("opacity", 1)
            .style("stroke-width", "5px");
    } else {

        d3.selectAll('#' + this.id)
            .transition()
            .duration(50)
            .style("opacity", 0.5)
            .style("stroke-width", "2.5px");}
}

var isDown = false;   // Tracks status of mouse button

$(document).mousedown(function() {
    isDown = true;      // When mouse goes down, set isDown to true
})
    .mouseup(function() {
        isDown = false;    // When mouse goes up, set isDown to false
    });


function table_mouseDown() {
    if(isDown) {
        if($(this).css("opacity") == 0.5){				  //uses the opacity of the row for selection and deselection

            d3.selectAll('#' + this.id)
                .transition()
                .duration(50)
                .style("opacity", 1)
                .style("stroke-width", "5px");
        } else {

            d3.selectAll('#' + this.id)
                .transition()
                .duration(50)
                .style("opacity", 0.5)
                .style("stroke-width", "2.5px");}
    }
}

var $window = $(window),
   $stickyEl = $('#statcontent'),
   elTop = $stickyEl.offset().top;

$window.scroll(function() {
    $stickyEl.toggleClass('sticky', $window.scrollTop() > elTop);
});

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

//Options
var width = 700,
    height = 600,
    dotRadius = 4,
    gridSpacing = 40;

var min_radius = 4,
    max_radius = 20

var min_age = 35,
    max_age = 57

var min_women = 10,
    max_women = 90

var svg = d3.select("#quadcontainer").append("svg")
        .attr("width",width).attr("height",height)
        .attr("id", "quad");

var infobox = d3.select("#infobox")

//Scales for item positions
var x = d3.scale.linear().domain([min_age, max_age]).range([0,width]);
var y = d3.scale.linear().domain([min_women, max_women]).range([height,0]);

var datax = function(d) {
    return x(d.median_age)
}

var datay = function(d) {
    var total = d.males + d.females;
    var perc = d.females / total * 100;
    return y(perc);
}

//gridlines
svg.append("path")
  .attr("class","grid")
  .attr("d",function() {
    var d = "";

    for (var i = gridSpacing; i < width; i += gridSpacing ) {
      d += "M"+i+",0 L"+i+","+height;
    }

    for (var i = gridSpacing; i < height; i += gridSpacing ) {
      d += "M0,"+i+" L"+width+","+i;
    }

    return d;
  })


// setup pie charts
var pie_radius = 50;
var pie_colors = ["#ca0020", "#92c5de", "#f4a582", "#0571b0"];
var pie_color = d3.scale.ordinal().range(pie_colors);

var pie_arc = d3.svg.arc()
    .outerRadius(pie_radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie().sort(null)

d3.json("parties.json", function(error, json) {
    if (error) return console.warn(error);
    itemList = json;

    var max_total = d3.max(itemList, function(d) { return d.males + d.females; });
    var radius_scale = d3.scale
        .linear()
        .range([min_radius, max_radius])
        .domain([0, max_total])

    //One group per item
    var items = svg.selectAll("g.item")
        .data(itemList).enter()
        .append("g")
            .attr("class","item");

    display_infobox = function(d) {
        var total = d.males + d.females

        d3.select("#party_info").style("display", "block");
        d3.select("#lbl_party").text(d.party.toProperCase())
        d3.select("#lbl_total").text(total)
        d3.select("#lbl_males").text(parseInt(d.males / total * 100))
        d3.select("#lbl_females").text(parseInt(d.females / total * 100))
        d3.select("#lbl_median").text(d.median_age)
        d3.select("#lbl_young").text(parseInt(d.young / total * 100))
        d3.select("#lbl_middle").text(parseInt(d.middle / total * 100))
        d3.select("#lbl_old").text(parseInt(d.old / total * 100))
        d3.select("#lbl_vold").text(d.vold)

        d3.selectAll("#youngest_members p").remove()
        d3.select("#youngest_members").selectAll("small").data(d.youngest).enter().append("small")
            .text(function(d2) {
                return d2[0].toProperCase() + " (" + d2[2] + ") "
            })

        d3.selectAll("#oldest_members p").remove()
        d3.select("#oldest_members").selectAll("small").data(d.oldest).enter().append("small")
            .text(function(d2) {
                return d2[0].toProperCase() + " (" + d2[2] + ") "
            })


        // Gender Pie Chart
        d3.selectAll("#gender_pie svg").remove()
        var svg = d3.select("#gender_pie").append("svg")
            .attr("class", "pie");

        svg.selectAll("g")
            .data(pie([d.males/total, d.females/total])).enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + pie_radius + "," + pie_radius + ")")
            .append("path")
                .attr("d", pie_arc)
                .style("fill", function(d, idx) { return pie_color(idx); });

        legend = svg.append("g");
        legend.selectAll("rect.gender")
            .data([pie_colors[0], pie_colors[1]])
            .enter().append("rect")
                .attr("height", 10)
                .attr("width", 10)
                .attr("y", function(d, idx) { return idx * 20 + pie_radius * 2})
                .style("fill", function(d) { return d; })

        legend.selectAll("text.gender")
            .data(["Men", "Women"])
            .enter().append("text")
            .attr("class", "x label")
            .attr("text-anchor", "begin")
            .attr("y", function(d, idx) { return 20 * idx + pie_radius * 2 + 9})
            .attr("x", 20)
            .text(function(d) { return d; });

        d3.selectAll("#age_pie svg").remove()
        var svg = d3.select("#age_pie").append("svg")
            .attr("class", "pie")

        svg.selectAll("g")
            .data(pie([d.young/total, d.middle/total, d.old/total, d.vold/total])).enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + pie_radius + "," + pie_radius + ")")
            .append("path")
                .attr("d", pie_arc)
                .style("fill", function(d, idx) { return pie_color(idx); });

        legend = svg.append("g");

        legend.selectAll("rect.age")
            .data([pie_colors[0], pie_colors[1], pie_color[2], pie_colors[3]])
            .enter().append("rect")
                .attr("height", 10)
                .attr("width", 10)
                .attr("x", 20)
                .attr("y", function(d, idx) { return idx * 20 + pie_radius * 2})
                .style("fill", function(d) { return d; })

        legend.selectAll("text.age")
            .data(["< 40", "40 - 59", "60 - 79", "80+"])
            .enter().append("text")
            .attr("class", "x label")
            .attr("text-anchor", "begin")
            .attr("y", function(d, idx) { return 20 * idx + pie_radius * 2 + 9})
            .attr("x", 40)
            .text(function(d) { return d; });




    }

    //Add a dot
    items.append("circle")
        .attr("class", "party")
        .attr("r", function(d) {
            total = d.males + d.females;
            return radius_scale(total);
        })
        .attr("cx", datax)
        .attr("cy", y(50))
        .on("mouseover", display_infobox)
        .on("mousedown", function(d) {
            d3.select(this).classed("clicked", true)
            display_infobox(d);
        })
        .on("mouseup", function(d) {
            d3.select(this).classed("clicked", false)
        })
        .transition().delay(40).ease("bounce").duration(1000)
        .attr("cy", datay)

    // setup Y-Axis
    var yScale = d3.scale
        .linear()
        .range([0, height])
        .domain([100, 0])

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(6, -1)")
        .call(yAxis)

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", "1.0em")
        .attr("transform", "rotate(-90)")
        .text("more women candidates →");

    svg.append("text")
        .attr("class", "y label")
        .attr("y", 6)
        .attr("dy", "1.0em")
        .attr("transform", "translate(0, " + height + ") rotate(-90)")
        .text("← fewer women candidates");

    // setup X-Axis
    var xScale = d3.scale
        .linear()
        .range([0, width])
        .domain([min_age, max_age + 10])


    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("top")
        .ticks(4);

    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(7, " + yScale(50) + ")")
        .call(xAxis)

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("median age of candidates in list (years)");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", xScale(50))
        .attr("dy", "-0.6em")
        .text("older candidates →");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "begin")
        .attr("x", 11)
        .attr("y", xScale(50))
        .attr("dy", "-0.6em")
        .text("← younger candidates");

    //would need to use .getBBox() to make sure this doesn't hit the sides
    items.append("text")
        .attr("class", "text-label")
        .attr("x", datax)
        .attr("y", y(50))
        .attr("dy","1.25em")
        .attr("text-anchor","middle")
        .on("mouseover", display_infobox)
        .on("mousedown", function(d) {
            d3.select(this).classed("clicked", true)
            display_infobox(d);
        })
        .on("mouseup", function(d) {
            d3.select(this).classed("clicked", false)
        })
        .text(function(d) { return d.abbr; })
        .transition().delay(40).ease("bounce").duration(1000)
        .attr("y", datay)


});

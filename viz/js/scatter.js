String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

//Options
var width = 620,
    height = 450,
    gridSpacing = 40;

var aspect = width / height;

var min_radius = 4,
    max_radius = 20

var min_age = 35,
    max_age = 57
    min_women = 10,
    max_women = 90

// setup X-Axis
var xScale = d3.scale
    .linear()
    .range([50, width])
    .domain([min_age, max_age])

// setup Y-Axis
var yScale = d3.scale
    .linear()
    .range([20, height - 20])
    .domain([100, 0])

middle_age = (min_age + max_age) / 2;
var infobox = d3.select("#infobox")

var svg = d3.select("#quadcontainer").append("svg")
    .attr("width", width).attr("height",height)
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("id", "quad");

//Scales for item positions
var x = d3.scale.linear().domain([min_age, max_age]).range([10, width]);
var y = d3.scale.linear().domain([min_women, max_women]).range([height,0]);

// Set-up a window handler that re-sizes the svg when the window size changes
//var w = window,
//    d = document,
//    e = d.documentElement,
//    g = d.getElementsByTagName('body')[0]
//
//function updateWindow(){
//    x = w.innerWidth || e.clientWidth || g.clientWidth;
//    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
//
//    svg.attr("width", x).attr("height", y);
//}

//window.onresize = updateWindow;

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

    var datax = function(d) {
        return x(d.median_age)
    }

    var datay = function(d) {
        var total = d.males + d.females;
        var perc = d.females / total * 100;
        return y(perc);
    }

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

        d3.selectAll("#youngest_members small").remove()
        d3.select("#youngest_members")
            .selectAll("small")
            .data(d.youngest).enter()
            .append("small")
                .text(function(d2) {
                    return d2[0].toProperCase() + " (" + d2[2] + ") | "
                })

        d3.selectAll("#oldest_members small").remove()
        d3.select("#oldest_members").selectAll("small").data(d.oldest).enter().append("small")
            .text(function(d2) {
                return d2[0].toProperCase() + " (" + d2[2] + ") | "
            })


        var draw_pie = function(el, data, labels, title) {
            var data_size = data.length
            el.selectAll("svg").remove()
            var svg = el.append("svg")
                .attr("class", "pie");

            svg.append("text")
                .attr("class", "pie label")
                .attr("text-anchor", "middle")
                .attr("y", 10)
                .attr("x", 45)
                .text(title)

            svg.selectAll("g")
                .data(pie(data)).enter().append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + pie_radius + "," + (pie_radius + 5) + ")")
                .append("path")
                    .attr("d", pie_arc)
                    .style("fill", function(d, idx) { return pie_color(idx); });

            legend = svg.append("g");
            legend.selectAll("rect")
                .data(pie_colors.slice(0, data_size))
                .enter().append("rect")
                    .attr("height", 10)
                    .attr("width", 10)
                    .attr("y", function(d, idx) { return idx * 20 + pie_radius * 2 + 5})
                    .attr("x", 20)
                    .style("fill", function(d) { return d; })

            legend.selectAll("text")
                .data(labels)
                .enter().append("text")
                .attr("class", "pie legend")
                .attr("text-anchor", "begin")
                .attr("y", function(d, idx) { return 20 * idx + pie_radius * 2 + 14})
                .attr("x", 40)
                .text(function(d) { return d; });

        }

        draw_pie(d3.select("#gender_pie"), [d.males/total, d.females/total], ["Men", "Women"], "By Gender")
        draw_pie(d3.select("#age_pie"), [d.young/total, d.middle/total, d.old/total, d.vold/total], ["< 40", "40-59", "60-79", "80+"], "By Age")
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

    var yAxis = d3.svg.axis()
        .tickFormat(function(d) { return d + "%"; })
        .scale(yScale)
        .orient("left")
        .ticks(1)

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + xScale(min_age) + ", -1)")
        .call(yAxis)

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("transform", "translate(" + (xScale(min_age) + 9) + "," + yScale(100) + ") rotate(-90)")
        .text("more women →");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "begin")
        .attr("y", 6)
        .attr("transform", "translate(" + (xScale(min_age) + 9) + "," + (yScale(0) - 5) + ") rotate(-90)")
        .text("← fewer women");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("dy", -5)
        .attr("transform", "translate(" + xScale(min_age) + ", " + yScale(50) + ") rotate(-90)")
        .text("% of female candidates");

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(3)

    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0, " + yScale(0) + ")")
        .call(xAxis)

    svg.append("line")
        .attr("x1", xScale(min_age))
        .attr("x2", xScale(max_age))
        .attr("y1", yScale(50))
        .attr("y2", yScale(50))
        .attr("class", "axis middle-axis")

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", xScale(max_age))
        .attr("y", yScale(50))
        .attr("dy", "1.2em")
        .attr("dx", "-2.2em")
        .text("gender equality line");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", xScale(middle_age))
        .attr("y", yScale(0))
        .attr("dy", "1.2em")
        .text("median age (years)");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("x", xScale(max_age))
        .attr("y", yScale(0))
        .attr("dy", "1.2em")
        .text("older candidates →");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "begin")
        .attr("y", yScale(0))
        .attr("x", xScale(min_age))
        .attr("dy", "1.2em")
        .text("← younger candidates");

    //would need to use .getBBox() to make sure this doesn't hit the sides
    items.append("text")
        .attr("class", "text-label")
        .attr("x", datax)
        .attr("y", y(50)) // start off in the center before animating
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
        .attr("y", function(d) {
            total = d.males + d.females
            return datay(d) + radius_scale(total) }
        )


});

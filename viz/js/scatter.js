String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

//Options
var width = 620,
    height = 450,
    gridSpacing = 40;

var aspect = width / height;

var min_radius = 8,
    max_radius = 30;

var min_age = 35,
    max_age = 57,
    min_women = 10,
    max_women = 90;

// setup X-Axis
var xScale = d3.scale
    .linear()
    .range([50, width])
    .domain([min_age, max_age]);

// setup Y-Axis
var yScale = d3.scale
    .linear()
    .range([20, height - 20])
    .domain([100, 0]);

middle_age = (min_age + max_age) / 2;
var infobox = d3.select("#infobox");

var svg = d3.select("#quadcontainer").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("id", "quad");


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


d3.json("parties.json", function(error, json) {
    if (error) return console.warn(error);
    itemList = json;

    /************************ Side bar **********************/
    var pie_radius = 50;
    var pie_colors = ["#ca0020", "#92c5de", "#f4a582", "#0571b0"];
    var pie_color = d3.scale.ordinal().range(pie_colors);

    var pie_arc = d3.svg.arc()
        .outerRadius(pie_radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie().sort(null)


    display_infobox = function(d) {
        var total = d.males + d.females
        d3.selectAll("circle.party").classed("active", false);
        d3.select(this.parentNode).select("circle").classed("active", true);
        d3.select("#party_info").style("display", "block");
        d3.select("#lbl_party").text(d.party.toProperCase());
        d3.select("#lbl_total").text(total);
        d3.select("#lbl_males").text(parseInt(d.males / total * 100));
        d3.select("#lbl_females").text(parseInt(d.females / total * 100));
        d3.select("#lbl_median").text(d.median_age);
        d3.select("#lbl_young").text(parseInt(d.young / total * 100));
        d3.select("#lbl_middle").text(parseInt(d.middle / total * 100));
        d3.select("#lbl_old").text(parseInt(d.old / total * 100));
        d3.select("#lbl_vold").text(d.vold);

        d3.selectAll("#youngest_members small").remove();
        d3.select("#youngest_members")
            .selectAll("small")
            .data(d.youngest).enter()
            .append("small")
            .text(function(d2) {
                return d2[0].toProperCase() + " (" + d2[2] + ") | "
            });

        d3.selectAll("#oldest_members small").remove();
        d3.select("#oldest_members").selectAll("small").data(d.oldest).enter().append("small")
            .text(function(d2) {
                return d2[0].toProperCase() + " (" + d2[2] + ") | "
            });


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

    /************************ Scatter plot *************************/
    var max_total = d3.max(itemList, function(d) { return d.males + d.females; });
    var radius_scale = d3.scale
        .linear()
        .range([min_radius, max_radius])
        .domain([0, max_total]);

    var font_scale = d3.scale
        .linear()
        .range([0.6, 0.8])
        .domain([0, max_total]);

    var datax = function(d) {
        return xScale(d.median_age)
    }

    var datay = function(d) {
        var total = d.males + d.females;
        var perc = d.females / total * 100;
        return yScale(perc);
    }
    

    //One group per item
    var items = svg.selectAll("g.item")
        .data(itemList, function(d, i) {
            d.total = d.males + d.females;
            d.r = radius_scale(d.total);
            d.y = datay(d);
            d.x = datax(d);
            return i;
        })
        .enter()
        .append("g")
        .attr("class","item");


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
        .call(xAxis);

    svg.append("line")
        .attr("x1", xScale(min_age))
        .attr("x2", xScale(max_age))
        .attr("y1", yScale(50))
        .attr("y2", yScale(50))
        .attr("class", "axis middle-axis");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", xScale(max_age))
        .attr("y", yScale(50))
        .attr("dy", "-0.5em")
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

    // Colours
    
    color = d3.scale.category20c();
    color_list = [
        "#BE008A", "#8F2471",  "#7C005A",  "#DF38B1",  "#DF64BD", 
        "#FF8100",  "#BF7830",  "#A65400",  "#FFA040",  "#FFBA73",
        "#1729B0",  "#2E3884",  "#081472",  "#4B5CD7",  "#717DD7"
    ];
    color_list = pie_colors.slice(0);
    // color_list.reverse();
    // color_list.shift();
    var color_scale = d3.scale
        .ordinal()
        .range(color_list)
        .domain([0, max_total]);
    /* Circles and labels */
    var circles = items.append("circle")
        .attr("class", "party")
        .attr("r", function(d) { return d.r; })
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", yScale(50)) // start off in the center before animating
        .style("fill", function(d, i) { console.log(d.abbr, d.males + d.females); return color_scale(d.males + d.females); })
        .on("mouseover", display_infobox)
        .on("mousedown", function(d) {
            d3.select(this).classed("clicking", true)
            display_infobox(d);
        })
        .on("mouseup", function(d) {
            d3.select(this).classed("clicking", false)
        })
        .transition().delay(40).ease("bounce").duration(1000)
        .attr("cy", function(d) { return d.y; })


        
    var label_array = JSON.parse(JSON.stringify(itemList)) // deep copy
    var labels = items.append("text")
        .attr("class", "text-label")
        .style("font-size", function(d) {
            return font_scale(d.total) + "em";
        })
        .attr("y", yScale(50)) // start off in the center before animating
        .attr("x", function(d) { return d.x; })
        .attr("dy","1.2em")
        .attr("text-anchor","middle")
        .text(function(d) { return d.abbr; })
        .each(function(d, i) {
            label_array[i].x = d.x;
            label_array[i].y = d.y;
            label_array[i].name = d.abbr;
            label_array[i].width = this.getBBox().width;
            label_array[i].height = this.getBBox().height;
            d.name = d.abbr;
            d.width = this.getBBox().width;
            d.height = this.getBBox().height;
            return i;
        })
        .on("mouseover", display_infobox)
        .on("mousedown", function(d) {
            d3.select(this).classed("clicked", true)
            display_infobox(d);
        })
        .on("mouseup", function(d) {
            d3.select(this).classed("clicked", false)
        })
        .transition().delay(40).ease("bounce").duration(1000)
        .attr("y", function(d) { return d.y; })

    /* Labeler */
    var sim_ann = d3.labeler()
        .label(itemList)
        .anchor(label_array)
        .width(width)
        .height(height)

    function redrawLabels() {
        // Redraw labels and leader lines

        labels.transition()
        .duration(800)
        .attr("x", function(d) { return (d.x); })
        .attr("y", function(d) { return (d.y); });
    }


    sim_ann.start(1000);
    redrawLabels();
});

var origWidth = 0;
document.getElementById('embiggen_container').onclick = function() {
    if (this.className.search(/\bembiggen\b/gi) == -1) {
        var offsetTop = this.offsetTop;
        var marginTop = (offsetTop * -1) + 20;
        origWidth = this.offsetWidth;
        origHeight = this.offsetHeight;
        origMarginLeft = this.marginLeft;
        origMarginTop = this.marginTop;
        origStyle = this.style;
        console.log(origWidth);
        this.style.zIndex = 5000;
        this.style.width = (parseInt(window.innerWidth) - 40) + "px";
        this.style.height = (parseInt(window.innerHeight) - 20) + "px";
        this.style.position = "absolute";
        this.style.top = offsetTop + "px";
        this.style.marginTop = marginTop + "px";
        this.style.marginLeft = "20px";
        this.style.overflowY = "scroll";
        d3.select(this).classed("embiggen", true);

        document.getElementById('close').onclick = function(e) {

            console.log(origWidth);
            var el = this.parentNode;
            el.className = el.className.replace(/\banimate\b/gi, '');
            console.log(el.className.replace(/\bembiggen\b/gi, ''));
            el.className = el.className.replace(/\bembiggen\b/gi, '');
            el.removeAttribute("style");
            // el.style.overflowY = "none";
            // el.style.position = "relative";
            // el.style.width = origWidth + "px";
            // el.style.height = origHeight + "px";
            // el.style.marginLeft = origMarginLeft + "px";
            // el.style.marginTop = origMarginTop + "px";
            // el.style = origStyle;
            e.stopPropagation();
            el.className += "animate";
        }
    };



        // .style("width", (parseInt(window.innerWidth) - 20))
        // .classed("small", false)
        // .classed("embiggen", true)
        // .select("#close")
        // .on("mousedown", function() {
        //     d3.select(this.parentNode)
        //         .classed("small", true)
        //         .classed("embiggen", false)
        // });
    

}

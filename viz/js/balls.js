
data = [
    {
        "party" : "Democratic Alliance",
        "abbr" : "DA",
    },
    {
        "party" : "African National Congress",
        "abbr" : "ANC",
    },
    {
        "party" : "African Christian Democratic Party",
        "abbr" : "ACDP",
    }
]

data2 = [
    {
        "party" : "African National Congress",
        "abbr" : "ANC",
    },
    {
        "party" : "African Christian Democratic Party",
        "abbr" : "ACDP",
    },
    {
        "party" : "Democratic Alliance",
        "abbr" : "DA",
    }
]
    
var radius = 20;
var xinc = 50;

update = function(data) {
    svg.selectAll("circle")
        .data(data, function(d) { return d.party })
        .transition()
        .attr("cx", function(d, i) {
            return xinc * i + radius;
        })
}

d3.selectAll("button")
    .on("click", function() {
        update(data2);
    })

var svg = d3.select("#c4sa_chart").insert("svg:svg")
svg.selectAll("circle")
    .data(data, function(d) { return d.party })
    .enter().append("svg:circle")
        .attr("class", "party")
        .attr("id", function(d) {
            return "party_" + d.abbr
        })
        .attr("cx", function(d, i) {
            return xinc * i + radius;
        })
        .attr("cy", 5 + radius)
        .attr("r", radius)
        .on("click", function(d) { 
            console.log(d);
        })

console.log(data);

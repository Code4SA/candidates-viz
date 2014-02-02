csv = []
nested_data = []
nested_age_data = []

province_id_map =
	'c4sa_pr_kzn': 'KWAZULU-NATAL'
	'c4sa_pr_fs': 'FREE STATE'
	'c4sa_pr_ec': 'EASTERN CAPE'
	'c4sa_pr_mp': 'MPUMALANGA'
	'c4sa_pr_lim': 'LIMPOPO'
	'c4sa_pr_nc': 'NORTHERN CAPE'
	'c4sa_pr_nw': 'NORTH WEST'
	'c4sa_pr_wc': 'WESTERN CAPE'
	'c4sa_pr_gp': 'GAUTENG'

toTitleCase = (str) ->
    str.replace /\w\S*/g, (txt) -> # see comment below
        txt[0].toUpperCase() + txt[1..txt.length - 1].toLowerCase()

plot_age_horz_stacked_bar = (data) ->
	margin =
		top: 30
		right: 100
		bottom: 30
		left: 250

	width = 660 - margin.left - margin.right
	height = 700 - margin.top - margin.bottom

	x = d3.scale.linear().rangeRound([0, width])
	y = d3.scale.ordinal().rangeRoundBands([0, height], .1)

	color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

	xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format(".0%"))
	yAxis = d3.svg.axis().scale(y).orient("left").tickFormat((x) -> toTitleCase(x))

	document.getElementById('results').innerHTML = ''  # until we make it better

	svg = d3.select("#results")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

	d3.selectAll(".province")
	.on "mousedown", ->
		d3.select(this).classed "active", true
	.on "mouseup", ->
		d3.select(this).classed "active", false

	age_groups = ['less than 30', '30 - 39', '40 - 49', '50 - 59', '60 and over']
	#color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));
	color.domain(d3.keys(age_groups))
	console.log 'domain: ', color.domain()
	console.log 'color: ', color

	data.forEach (d) ->

		# first, lets transform the nested data
		transformed = {}

		#transformed[d.key] = d.values  # this will be a count
		for age_group in d.values
			transformed[age_group.key] = age_group.values  # this will be a count

		console.log 'transformed: ', transformed

		x0 = 0
		#for group in age_groups

		d.ages = color.domain().map((index) ->
			key = age_groups[index]
			known = key of transformed ? true : false
			x1 = 0
			if known
				x1 = transformed[key]
			return {
				name: key
				x0: x0
				x1: x0 += x1
			}
		)
		d.ages.forEach (d) ->
			d.x0 /= x0
			d.x1 /= x0

	console.log 'data is now: ', data

	data.sort (a, b) ->
		b.ages[0].x1 - a.ages[0].x1

	y.domain data.map((d) -> d.key)

	svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call xAxis
	svg.append("g").attr("class", "y axis").call yAxis
	state = svg.selectAll(".state")
	.data(data)
	.enter().append("g")
	.attr("class", "state").attr("transform", (d) ->
		"translate(0," + y(d.key) + ")"
	)

	state.selectAll('rect')
	.data((d) -> d.ages)
	.enter().append("rect")
	.attr("height", y.rangeBand())
	.attr("x", (d) -> x(d.x0))
	.attr("width", (d) -> x(d.x1) - x(d.x0))
	.style("fill", (d) -> color d.name)

	legend = svg.select(".state:nth-child(3)").selectAll(".legend")
	.data((d) -> d.ages).enter().append("g")
	.attr("class", "legend")
	.attr("transform", (d) ->
		"translate(" + x((d.x0 + d.x1) / 2) + ",0)rotate(-34)"  #"translate(" + x((d.x0 + d.x1) / 2) + ",0)"
	)

	#" - y.rangeBand() / 2 + "
	#" - y.rangeBand() / 2 + "
	#legend.append("line").attr "y2", 10
	legend.append("text").attr("y", -5).attr("dx", "1em").text (d) ->
		d.name

plot_table = (data, columns) ->

	table = d3.select("#container").append("table")
	thead = table.append("thead")
	tbody = table.append("tbody")

	# append the header row
	thead.append("tr")
		.selectAll("th")
		.data(columns)
		.enter()
		.append("th")
		.text((column) -> return column)

	# create a row for each object in the data
	table_rows = tbody.selectAll("tr")
	.data(data)
	.enter()
	.append("tr")

    # create a cell in each row for each column
	cells = table_rows.selectAll("td").data (row) ->
		return columns.map (column) ->
			return {column: column, value: row[column]}
	.enter()
        .append("td")
            .text((d) -> return d.value)


d3.csv("candidates.csv")
.get (error, data) ->

	color_map = {
		'60 and over': 0
		'50 - 59': 1
	}

	console.log 'data: ', data

	party_base = d3.nest()
	.key((d) -> d.province).sortKeys(d3.ascending)
	.key((d) -> d.party).sortKeys(d3.ascending)

#	gender_data = party_base
#	.key((d) -> d.gender)
#	.rollup((v) -> return v.length)  # d3.sum(leaves, (d) -> d.party))
#	.entries(data)

	age_data = party_base
	.key((d) -> d.age)
	.sortKeys(d3.ascending)
	.rollup((leaves) -> leaves.length)  # d3.sum(leaves, (d) -> d.party))
	.entries(data)

	nested_age_data = age_data

	console.log 'age_data: ', age_data

	test_data = age_data[6]
	console.log 'test_data: ', test_data

	#plot_age_stacked_bar(test_data.values)
	plot_age_horz_stacked_bar(test_data.values)

on_province_clicked = (e) ->
	console.log 'on_province_clicked ', e
	console.log 'on_province_clicked2 ', e
	if e.target.id of province_id_map
		province_name = province_id_map[e.target.id]
		console.log 'selected :', province_name
		render_data = group for group in nested_age_data when group.key is province_name
		console.log 'render_data: ', render_data

		#plot_age_charts(render_data)
		plot_age_horz_stacked_bar(render_data.values)
		#province_data

country = document.getElementById('country_svg')

d3.xml "provinces.svg", "image/svg+xml", (xml) ->
	console.log 'xml doc: ', xml.documentElement
	country.appendChild xml.documentElement

	paths = country.getElementsByTagName('path')

	for path in paths when path.id.indexOf('c4sa') is 0
		path.addEventListener 'click', on_province_clicked
		path.setAttribute('class', 'province')

	#console.log 'fs: ', document.getElementById('c4sa_pr_fs')
	return



Code4SA.template = (function(window,document,undefined) {
	var htmltemplate = '<div class="code4sa-embed"> \
<div id="overlay"></div> \
<div class=" pull-left well animate" id="embiggen_container" style="top: 0px"> \
<div class="btn btn-danger btn-sm" id="close"><span class="glyphicon glyphicon-remove"></span></div> \
<div id="vizcontainer" class="col-md-12"> \
<div id="titlecontainer" class="svg-container"></div> \
<div id="howto"> \
	<p>The graph plots parties\' candidates according to median age and percentage of women. The number of candidates is indicated by circle size.</p>\
	<p>Move your mouse over the relevant circle for more information about the party.</p> \
</div> \
<div id="quadcontainer" ></div> \
<p><small>Source: IEC - 2009 National and Regional Candidates List</small></p> \
<br clear="both" /> \
</div> \
<div id="infobox" class="col-md-3"> \
<div id="party_info" class="well"> \
<h3 id="lbl_party"></h3> \
<table class="table table-striped"> \
<tr><td>Total Candidates</td> <td><span id="lbl_total"></span></td></tr> \
<tr><td>Men:</td> <td><span id="lbl_males">50</span>%</td></tr> \
<tr><td>Women:</td> <td><span id="lbl_females">50</span>%</td></tr> \
<tr><td>Median Age:</td> <td><span id="lbl_median"></span> years</td></tr> \
<tr><td>Younger than 40 years:</td> <td><span id="lbl_young"></span>%</td></tr> \
<tr><td>Between 40 and 60:</td> <td><span id="lbl_middle"></span>%</td></tr> \
<tr><td>Between 60 and 80:</td> <td><span id="lbl_old"></span>%</td></tr> \
<tr><td># candidates over 80:</td> <td><span id="lbl_vold"></span></td></tr> \
</table> \
<span id="gender_pie"></span> \
<span id="age_pie"></span> \
<h4>Youngest Members</h4> \
<div id="youngest_members"><ul /></div> \
<h4>Oldest Members</h4> \
<div id="oldest_members"><ul /></div> \
</div> \
</div> \
<div id="code4sa_logo"><a href="http://www.code4sa.org"><img src="http://hood.code4sa.org/static/logo-184x100.png" /></a></div> \
</div> \
</div>';
	return {
		template: function() {
			return htmltemplate;
		},
		render: function(el) {
			el.innerHTML = htmltemplate;
		}
	}
})(this, this.document);

Code4SA.framework = (function(window,document,undefined) {
	var settings = {
		bindToElementId: "code4sa",
		project: "test",
		apiKey: ""
	};

	var el = null;

	//Private Methods
	var bindEl = function() {
		el = document.getElementById(settings.bindToElementId);
		Code4SA.template.render(el);
	};

	return {
		deploy: function(project) {
			bindEl();
			settings.project = project;
			el.className += "code4sa_deploy";
			console.log(el, settings);
			Code4SA.app.init();
		}
	};

})(this, this.document);


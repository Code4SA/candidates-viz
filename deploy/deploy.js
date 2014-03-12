

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
	<p><strong>Check back after April 22 2014 for an updated list with the 2014 candidates.</strong></p>\
</div> \
<div id="quadcontainer" ></div> \
<p><small>Source: IEC - 2009 National and Regional Candidates List</small></p> \
<br clear="both" /> \
</div> \
<div id="infobox" class="col-md-3"> \
<div id="party_info" class="well"> \
<h3 id="lbl_party"></h3> \
<dl class="dl-horizontal"> \
<dt>Total Candidates:</dt> <dd><span id="lbl_total"></span></dd> \
<dt>Men:</dt> <dd><span id="lbl_males">50</span>%</dd> \
<dt>Women:</dt> <dd><span id="lbl_females">50</span>%</dd> \
<dt>Median Age:</dt> <dd><span id="lbl_median"></span> years</dd> \
<dt>Younger than 40 years:</dt> <dd><span id="lbl_young"></span>%</dd> \
<dt>Between 40 and 60:</dt> <dd><span id="lbl_middle"></span>%</dd> \
<dt>Between 60 and 80:</dt> <dd><span id="lbl_old"></span>%</dd> \
<dt># candidates over 80:</dt> <dd><span id="lbl_vold"></span></dd> \
</dl> \
<span id="gender_pie"></span> \
<span id="age_pie"></span> \
<h4>Youngest Members</h4> \
<div id="youngest_members"><ul /></div> \
<h4>Oldest Members</h4> \
<div id="oldest_members"><ul /></div> \
</div> \
</div> \
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


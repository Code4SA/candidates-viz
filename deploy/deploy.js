var Code4SA = (function(window, document, undefined) {
	var settings = {
		bindToElementId: "code4sa",
		project: "test",
		apiKey: ""
	};

	var el = null;

	//Private Methods
	var bindEl = function() {
		el = document.getElementById(settings.bindToElementId);

	};

	return {
		deploy: function(project) {
			bindEl();
			settings.project = project;
			el.className += "code4sa_deploy";
			el.innerHTML = "Hello world";
			console.log(el, settings);
		}
	};

}(this, this.document));


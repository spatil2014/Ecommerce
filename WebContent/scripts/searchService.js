/**
 * Created by s.basanagouda.patil on 2/19/2016.
 */
(function(){
    app.factory('SearchService', function($http,$resource) {
        return $resource("data/All_data.json");
    });

    app.factory('selectedService', function(){
    	var selected;
    	return selected = {selectedVal:''};
    });
})();

/**
 * Created by s.basanagouda.patil on 2/19/2016.
 */
app.directive('resultGrid',function(){
    return{
        restrict:'E',
        templateUrl:'partials/searchresult-tpl.html',
        control:'=',
        link: function(scope, ele, attr) {
            scope.range = function() {
                var ret = [];

                for (var i=0; i<scope.noOfPages; i++) {
                    ret.push(i);
                }
                return ret;
            };

            scope.prevPage = function() {
                if (scope.currentPage > 0) {
                    scope.currentPage--;
                }
            };

            scope.prevPageDisabled = function() {
                return scope.currentPage === 0 ? "btn disabled" : "";
            };

            scope.pageCount = function() {
                return Math.ceil(scope.searchResults.length/scope.itemsPerPage)-1;
            };

            scope.nextPage = function() {
                if (scope.currentPage < scope.pageCount()) {
                    scope.currentPage++;
                }
            };

            scope.nextPageDisabled = function() {
                return scope.currentPage === scope.pageCount() ? "btn disabled" : "";
            };
            scope.setPage = function(n) {
                scope.currentPage = n;
            };

        }
    };
});

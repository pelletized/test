var feeds = [];


/**
* Filters out all duplicate items from an array by checking the specified key
* @param [key] {string} the name of the attribute of each object to compare for uniqueness
if the key is empty, the entire object will be compared
if the key === false then no filtering will be performed
* @return {array}
*/
angular.module('ui.unique',[]).filter('unique', ['$parse', function ($parse) {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var newItems = [],
        get = angular.isString(filterOn) ? $parse(filterOn) : function (item) { return item; };

      var extractValueToCompare = function (item) {
        return angular.isObject(item) ? get(item) : item;
      };

      angular.forEach(items, function (item) {
        var isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
}]);

angular.module('rssApp', ['ngResource', 'ngSanitize', 'ui.unique'])
	.factory('FeedLoader', function ($resource) {
		return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
			fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
		});
	})
	.service('FeedList', function ($rootScope, FeedLoader) {
		this.get = function() {
			var feedSources1 = {title: 'articles', url: 'http://www.jw.org/en/whats-new/rss/WhatsNewWebArticles/feed.xml'};
			var feedSources2 = {title: 'news', url: 'http://www.jw.org/en/news/rss/LatestNewsList/feed.xml'};
			var myDest = {};
			//var feedSources = [feedSources1, feedSources2];
			var feedSources = [{title: 'news', url: 'http://pipes.yahoo.com/pipes/pipe.run?_id=91847d734871ff638c652253a7924079&_render=rss'}];
			
			//angular.extend(myDest, feedSources1,feedSources2);
			//console.log(myDest);
			
			/*
			var feedSources = [
				{title: 'articles', url: 'http://www.jw.org/en/whats-new/rss/WhatsNewWebArticles/feed.xml'},				
				{title: 'news', url: 'http://www.jw.org/en/news/rss/LatestNewsList/feed.xml'}				
			];
			*/
			if (feeds.length === 0) {
				for (var i=0; i<feedSources.length; i++) {
					FeedLoader.fetch({q: feedSources[i].url, num: 20}, {}, function (data) {
						var feed = data.responseData.feed;
						feeds.push(feed);	
						/* create dupes error
						angular.forEach(feed, function(value, key) {
						   feeds.push(key + ': ' + value);
						 });
						 */
						
					});
				}
			}
			
			//console.log(feeds);			
			return feeds;
		};
	})
	.controller('FeedCtrl', function ($scope, FeedList) {
		$scope.feeds = FeedList.get();		
		$scope.$on('FeedList', function (event, data) {
			$scope.feeds = data;			
		});
		
		console.log($scope.feeds);
		
		$scope.getDetails = function () {
			alert('click');
		
		}					
		
	});
	
	
	
	

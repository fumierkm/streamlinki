/**
 * @param {number} time
 * @param {boolean?} reject
 * @returns {Function}
 */
function wait( time, reject ) {
	var method = reject
		? "reject"
		: "resolve";

	return function waitPromise( data ) {
		var defer = Promise.defer();

		setTimeout(function() {
			defer[ method ]( data );
		}, time );

		return defer.promise;
	};
}


export default wait;

import { Model } from "EmberData";


export default Model.extend({
	// we're not interested in any of the properties of this record
	// all properties will be deleted by the serializer

}).reopenClass({
	toString() { return "api/users/:user/follows/games"; }
});

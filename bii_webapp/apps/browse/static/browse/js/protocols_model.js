/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var ProtocolModel;
$(document).ready(function () {

    ProtocolModel = function (protocols) {
        if(!protocols)
            protocols=[{
                protocol_name: "",
                protocol_type: "",
                protocol_description: "",
                protocol_uri: "",
                protocol_version: "",
                protocol_parametername:"",
                protocol_componentname:"",
                protocol_componenttype:""
            }]

        var self = this;
        self.protocols = ko.observableArray(protocols);

        self.addProtocol = function () {
            self.protocols.push({
                protocol_name: "",
                protocol_type: "",
                protocol_description: "",
                protocol_uri: "",
                protocol_version: "",
                protocol_parametername:"",
                protocol_componentname:"",
                protocol_componenttype:""
            });
        };

        self.removeProtocol = function (protocol) {
            self.protocols.remove(protocol);
        };

        self.toJSON=function(){
            var protocols=[];
            for (var i = 0; i < self.protocols().length; i++) {
                var protocol = {
                    protocol_name: self.protocols()[i].protocol_name,
                    protocol_type: self.protocols()[i].protocol_type,
                    protocol_description: self.protocols()[i].protocol_description,
                    protocol_uri: self.protocols()[i].protocol_uri,
                    protocol_version: self.protocols()[i].protocol_version,
                    protocol_parametername: self.protocols()[i].protocol_parametername,
                    protocol_componentname: self.protocols()[i].protocol_componentname,
                    protocol_componenttype: self.protocols()[i].protocol_componenttype
                }
                protocols.push(protocol);
            }
            return{
                protocols:protocols
            }
        }
    };

});
/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */


var ContactModel = function (contacts) {
    if (!contacts)
        contacts = [
            {
               person_ref: "",
               person_last_name: "",
               person_first_name: "",
               person_mid_initials: "",
               person_email: "",
               person_phone: "",
               person_fax: "",
               person_address: "",
               person_affiliation: "",
               person_roles: ""
            }
        ]

    var self = this;
    self.contacts = ko.observableArray(contacts);

    self.addContact = function () {
        self.contacts.push({
           person_ref: "",
           person_last_name: "",
           person_first_name: "",
           person_mid_initials: "",
           person_email: "",
           person_phone: "",
           person_fax: "",
           person_address: "",
           person_affiliation: "",
           person_roles: ""
        });
    };

    self.removeContact = function (contact) {
        var index = self.contacts.indexOf(contact);
        if (index != self.contacts().length - 1) {
            var contacts = [];
            for (var i = 0; i < self.contacts().length; i++) {
                if (i != index) {
                    contacts.push(self.contacts()[i]);
                }
            }
            contacts.push(self.contacts()[index]);
            self.contacts(contacts);
        }
        self.contacts.remove(contact);
    };

    self.toJSON = function () {
        var contacts = [];
        for (var i = 0; i < self.contacts().length; i++) {
            var contact = {
               person_ref: self.contacts()[i].person_ref,
               person_last_name: self.contacts()[i].person_last_name,
               person_first_name: self.contacts()[i].person_first_name,
               person_mid_initials: self.contacts()[i].person_mid_initials,
               person_email: self.contacts()[i].person_email,
               person_phone: self.contacts()[i].person_phone,
               person_fax: self.contacts()[i].person_fax,
               person_address: self.contacts()[i].person_address,
               person_affiliation: self.contacts()[i].person_affiliation,
               person_roles: self.contacts()[i].person_roles
            }
            contacts.push(contact);
        }
        return{
            contacts: contacts
        }
    }
};

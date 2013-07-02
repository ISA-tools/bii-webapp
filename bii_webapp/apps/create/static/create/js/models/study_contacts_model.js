/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */


var StudyContactModel = function (contacts) {
    if (!contacts)
        contacts = [
            {
                s_person_ref: "",
                s_person_last_name: "",
                s_person_first_name: "",
                s_person_mid_initials: "",
                s_person_email: "",
                s_person_phone: "",
                s_person_fax: "",
                s_person_address: "",
                s_person_affiliation: "",
                s_person_roles: ""
            }
        ]

    var self = this;
    self.contacts = ko.observableArray(contacts);

    self.addContact = function () {
        self.contacts.push({
            s_person_ref: "",
            s_person_last_name: "",
            s_person_first_name: "",
            s_person_mid_initials: "",
            s_person_email: "",
            s_person_phone: "",
            s_person_fax: "",
            s_person_address: "",
            s_person_affiliation: "",
            s_person_roles: ""
        });
    };

    self.removeContact = function (contact) {
        self.contacts.remove(contact);
    };

    self.toJSON = function () {
        var contacts = [];
        for (var i = 0; i < self.contacts().length; i++) {
            var contact = {
                s_person_ref: self.contacts()[i].s_person_ref,
                s_person_last_name: self.contacts()[i].s_person_last_name,
                s_person_first_name: self.contacts()[i].s_person_first_name,
                s_person_mid_initials: self.contacts()[i].s_person_mid_initials,
                s_person_email: self.contacts()[i].s_person_email,
                s_person_phone: self.contacts()[i].s_person_phone,
                s_person_fax: self.contacts()[i].s_person_fax,
                s_person_address: self.contacts()[i].s_person_address,
                s_person_affiliation: self.contacts()[i].s_person_affiliation,
                s_person_roles: self.contacts()[i].s_person_roles
            }
            contacts.push(contact);
        }
        return{
            contacts: contacts
        }
    }
};

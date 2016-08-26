/**
 * Created by Next on 06.08.2016.
 */
var clinicsRestUrl = 'rest/clinics';
var editClinicWindow = $('#editClinic');
var editClinicForm = $('#clinicDetailsForm');
function renderClinics(data, type, doctor) {
    var clinics = doctor.clinics;
    var result = '';
    var filter = '';
    for (var i = 0; i < clinics.length; i++) {
        result += i + 1 + '. ' + ((clinics[i].name != '') ? '<strong>' + clinics[i].name + '</strong>' : '') + '<br>';
        result += '<strong>' + i18n['clinics.city'] + ': </strong>' + '<a onclick="getByCity(\'' + clinics[i].city + '\')">' + clinics[i].city + '</a><br>';
        result += '<strong>' + i18n['clinics.address'] + ': </strong>' + clinics[i].address + '<br>';
        result += '<a class="btn btn-xs btn-primary" onclick="editClinic(' + clinics[i].id + ',' + doctor.id + ',\'' + doctor.fullName + '\');">' + i18n['common.edit'] + '</a> ';
        result += '<a tabindex="0" class="btn btn-xs btn-success" data-slots=\'' + JSON.stringify(clinics[i].slots) + '\'>' + i18n['clinics.buttons.schedule'] + '</a> ';
        result += '<a class="btn btn-xs btn-danger" onclick="deleteClinic(' + clinics[i].id + ',' + doctor.id + ');">' + i18n['common.delete'] + '</a><br>';
        if (i < clinics.length-1) result += '<br>';
        filter += clinics[i].city + ' ';
    }
    if (clinics.length < 2)
        result += '<br><a class="btn btn-sm btn-default" onclick="addClinic(' + doctor.id + ',\'' + doctor.fullName + '\');">' + i18n['clinics.buttons.add'] + '</a>';
    if (type == 'display')
        return result;
    if (type == 'filter')
        return filter;
    return '';
}
function editClinic(id, doctorId, doctorName) {
    $.get(clinicsRestUrl + '/' + id + '/' + doctorId, function (clinic) {
        $.each(clinic, function (key, val) {
            editClinicForm.find('[name=\'' + key + '\']').val(val)
        });
        $('#doctorId', editClinicForm).val(doctorId);
        $('.title', editClinicWindow).text(i18n['clinics.edit'] + ' ' + doctorName);
        editClinicWindow.modal({backdrop: 'static'});
    })
}
function addClinic(doctorId, doctorName) {
    editClinicForm.find(':text').val('');
    $('.title', editClinicWindow).text(i18n['clinics.add'] + ' ' + doctorName);
    $('#id', editClinicForm).val(null);
    $('#doctorId', editClinicForm).val(doctorId);
    editClinicWindow.modal({backdrop: 'static'});
}
function deleteClinic(id, doctorId) {
    $.ajax({
        url: clinicsRestUrl + "/" + id + "/" + doctorId,
        type: 'DELETE',
        success: function () {
            updateTable();
            successNoty(i18n['app.deleted']);
        }
    });
}
editClinicForm.submit(function () {
    $.post(clinicsRestUrl, editClinicForm.serialize(), function () {
        editClinicWindow.modal('hide');
        updateTable();
        successNoty(i18n['app.saved']);
    });
    return false;
});
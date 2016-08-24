var editAppointmentWindow = $('#editAppointment');
var editForm = $('.editForm');
var appointmentsRestUrl = 'rest/appointments';
var patientsRestUrl = 'rest/patients';
var table;
$(function () {
    table = $('#dataTableA').DataTable({
        ajax: {
            url: appointmentsRestUrl + '/all/' + $('#patientId').val(),
            dataSrc: ''
        },
        dom: 'lrtip',
        paging: false,
        columns: [
            {
                defaultContent: '',
                render: function (data, type, row) {
                    return renderAppointmentInfo(row);
                }
            },
            {
                defaultContent: '',
                render: function (data, type, row) {
                    return renderAppointmentProblems(row);
                }
            },
            {
                defaultContent: '',
                render: function (data, type, row) {
                    return renderAppointmentDoctors(row);
                }
            }
        ],
        ordering: false,
        initComplete: function () {
            $.get(patientsRestUrl + '/' + $('#patientId').val(), function (patient) {
                $('#patient1').text(patient.name + ' (Age: ' + patient.age + ', Tel: ' + patient.telNumber + ')');
            });
            $('.datepicker').datepicker({
                format: 'dd/mm/yyyy',
                todayBtn: 'linked',
                clearBtn: true,
                // language: 'he',
                autoclose: true,
                todayHighlight: true
            });
            fillOptions();
            $('.nav').find('.active').removeClass('active');
            $('.nav a[href="patients"]').parent().addClass('active');
        }
    });
});
function fillOptions() {
    $('select').empty()
    $.get(appointmentsRestUrl + '/symptoms', function (symptoms) {
        $.each(symptoms, function (key, val) {
            $('#symptoms').append($('<option>').text(val.name));
        });
        $('#symptoms').multiselect({maxHeight:300});
    });
    $.get(appointmentsRestUrl + '/problems', function (problems) {
        $.each(problems, function (key, val) {
            $('#problems').append($('<option>').text(val.name));
        });
        $('#problems').multiselect({maxHeight:300});
    });
}
function updateTable() {
    $.get(appointmentsRestUrl + '/all/' + $('#patientId').val(), function (data) {
        table.clear().rows.add(data).draw();
    });
    fillOptions();
}
function renderAppointmentInfo(appointment) {
    var res = '<a class="btn btn-xs btn-success" onclick="editAppointment(' + appointment.id + ')" title="Edit">Edit</a> ';
    res += '<a class="btn btn-xs btn-danger" onclick="deleteAppointment(' + appointment.id + ')" title="Delete">Delete</a>';
    res += '<br>Appointment Date: ' + (appointment.appointmentDate ? appointment.appointmentDate : '');
    res += '<br>Apply Date: ' + (appointment.applyDate ? appointment.applyDate : '');
    res += '<br>Payment amount: ' + appointment.paymentAmount;
    res += '<br>Payment Date: ' + (appointment.paymentDate ? appointment.paymentDate : '');
    res += '<br>Cheque number: ' + appointment.checkNumber;
    return res;
}
function renderAppointmentProblems(appointment) {
    var res = '<strong>Problems: </strong>';
    var problems = appointment.problems;
    for (var i = 0; i < problems.length; i++) {
        res += problems[i].name;
        if (i < problems.length - 1) res += ', ';
    }
    res += '<br><strong>Symptoms: </strong>';
    var symptoms = appointment.symptoms;
    for (var i = 0; i < symptoms.length; i++) {
        res += symptoms[i].name;
        if (i < symptoms.length - 1) res += ', ';
    }
    return res;
}
function renderAppointmentDoctors(appointment) {
    var res = '';
    if (appointment.doctor) {
        res += '<strong>Doctor: </strong>' + renderDoctorInfo(appointment.doctor);
        res += '<br><a class="btn btn-xs btn-success" href="doctors?doctorAlt=false&appointmentId=' + appointment.id + '">Change</a> ';
        res += '<a class="btn btn-xs btn-danger" onclick="removeDoctor(' + appointment.id + ',false)">Remove</a><br>  ';
    } else {
        res += "<strong>Doctor: </strong>";
        res += '<a class="btn btn-xs btn-primary" href="doctors?doctorAlt=false&appointmentId=' + appointment.id + '">Add</a><br> ';

    }
    if (appointment.alternativeDoctor) {
        res += "<strong>Another Doctor: </strong>" + renderDoctorInfo(appointment.alternativeDoctor);
        res += '<br><a class="btn btn-xs btn-success" href="doctors?doctorAlt=true&appointmentId=' + appointment.id + '">Change</a> ';
        res += '<a class="btn btn-xs btn-danger" onclick="removeDoctor(' + appointment.id + ',true)">Remove</a> ';
    } else {
        res += "<strong>Another Doctor: </strong>";
        res += '<a class="btn btn-xs btn-primary" href="doctors?doctorAlt=true&appointmentId=' + appointment.id + '">Add</a> ';
    }
    return res;
}
function renderDoctorInfo(doctor) {
    var result = doctor.fullName + '<br>' +
        '<a href="mailto:' + doctor.email + '">' + doctor.email + '</a><br>' +
        'Tel: ' + doctor.telNumber + '<br>';
    if (doctor.telHome) result += 'Home tel: ' + doctor.telHome + '<br>';
    if (doctor.homeAddress) result += 'Home address: ' + doctor.homeAddress;
    return result;
}
function removeDoctor(id, doctorAlt) {
    $.ajax({
        url: appointmentsRestUrl + '/' + id + '/' + doctorAlt,
        type: 'DELETE',
        success: function () {
            updateTable();
            successNoty('Deleted');
        }
    });
}
function addAppointment(patientId) {
    $('.title', editAppointmentWindow).text('Add appointment for: ' + $('#patient1').text());
    $(':text', editForm).val('');
    $('#patientId').val(patientId);
    $('#applyDate').datepicker('update', new Date());
    $('option', editForm).removeAttr('selected').prop('selected', false);
    $('[multiple]').multiselect('refresh');
    $('textarea', editForm).val('');
    $('#id').val(null);
    $('.popover').popover('hide');
    editAppointmentWindow.modal({backdrop: 'static'});
}
function editAppointment(id) {
    $.get(appointmentsRestUrl + '/' + id, function (appointment) {
        $('option', editForm).removeAttr('selected').prop('selected', false);
        $('[multiple]').multiselect('refresh');
        $.each(appointment, function (key, val) {
            switch (key) {
                case 'symptoms':
                    $.each(val, function (k, v) {
                        $('option:contains(' + v.name + ')', $('#symptoms')).prop('selected', true);
                    });
                    $('#symptoms').multiselect('refresh');
                    break;
                case'problems':
                    $.each(val, function (k, v) {
                        $('option:contains(' + v.name + ')', $('#problems')).prop('selected', true);
                    });
                    $('#problems').multiselect('refresh');
                    break;
                default:
                    $('[name=\'' + key + '\']', editForm).val(val);
            }
        });
        $('.title', editAppointmentWindow).text('Edit appointment for: ' + $('#patient1').text());
        $('#addSpec').popover('hide');
        editAppointmentWindow.modal({backdrop: 'static'});
    });
}
editForm.submit(function () {
    $.post(appointmentsRestUrl, editForm.serialize(), function () {
        editAppointmentWindow.modal('hide');
        updateTable();
        successNoty('Saved');
    });
    return false;
});

/**
 * Created by DDNS on 02.08.2016.
 */
var table;
$(function () {
    table = $('#dataTable').DataTable({
        ajax: {
            url: "rest/doctors",
            dataSrc: ""
        },
        dom: "lrtip",
        paging: false,
        // scrollY: 400,
        columns: [
            {
                "defaultContent": "",
                "render": renderDoctorInfo
            },
            {
                "defaultContent": "",
                "render": renderSpecialization
            },
            {
                "defaultContent": "",
                "render": renderClinics
            },
            /*{
             "defaultContent": "",
             "render": renderCreateAppointment
             },*/
            {
                "defaultContent": "",
                "render": {}
            },
            {
                "defaultContent": "",
                "render": {}
            }
        ],
        ordering: false
    });
    $.get("rest/doctors/specs", function (specs) {
        $.each(specs, function (key, val) {
            $("#professions").append($('<option>').text(val.name));
        })
    });
    $.get("rest/doctors/quals", function (quals) {
        $.each(quals, function (key, val) {
            $("#qualifications").append($('<option>').text(val.name));
        })
    })
});
$("#namesearch").on('keyup', function () {
    table.columns(0).search(this.value).draw();
});
function getBySpeciality(name) {
    $.get("rest/doctors/by/?specialty=" + name, updateTableByData);
}
function getByQualification(name) {
    $.get("rest/doctors/by/?qualification=" + name, updateTableByData);
}
$("#professions").on('change', getBySpeciality(this.value));
$("#qualifications").on('change', getByQualification(this.value));
function updateTableByData(data) {
    table.clear().rows.add(data).draw();
}
function renderDoctorInfo(data, type, doctor) {
    if (type == 'display') {
        var result = '<h2><a onclick="editRow(' + doctor.id + ')" title="Edit">' + doctor.fullName + '</a></h2>' +
            '<a href="mailto:' + doctor.email + '">' + doctor.email + '</a><br>' +
            'Tel: ' + doctor.telNumber + '<br>';
        if (doctor.telHome) result += 'Home tel: ' + doctor.telHome + '<br>';
        if (doctor.homeAddress) result += 'Home address: ' + doctor.homeAddress;
        return result;
    }
    if (type == 'filter') {
        return doctor.fullName;
    }
    return "";
}
function renderSpecialization(data, type, doctor) {
    if (type == 'display') {
        var result = '<strong>Certificate: </strong>';
        if (doctor.certificate) result += doctor.certificate.name;
        result += '<br><strong>Profession: </strong>';
        var specialties = doctor.specialties;
        for (var i = 0; i < specialties.length; i++) {
            result += '<a onclick="getBySpecialty(\'' + specialties[i].name + '\')">' + specialties[i].name + '</a>';
            if (i < specialties.length - 1) result += ', ';
        }
        result += '<br><strong>Qualifications: </strong>';
        var qualifications = doctor.qualifications;
        for (i = 0; i < qualifications.length; i++) {
            result += '<a onclick="getByQualification(\'' + qualifications[i].name + '\')">' + qualifications[i].name + '</a>';
            if (i < qualifications.length - 1) result += ', ';
        }
        if (doctor.preferential) result += '<br><strong>Prefers: </strong>' + doctor.preferential;
        if (doctor.lections) result += '<br><strong>Reads lections: </strong>' + doctor.lections;
        result += '<br><strong>Target audience: </strong>';
        var target = doctor.targetAudiences;
        for (i = 0; i < target.length; i++) {
            result += target[i].name;
            if (i < target.length - 1) result += ', ';
        }
        if (doctor.comments) result += '<br>' + doctor.comments;
        return result;
    }
    return "";
}
function renderClinics(data, type, doctor) {
    return "";
}
function renderCreateAppointment(data, type, doctor) {
    return "";
}
function editRow(id) {
    $.get("rest/doctors/" + id, function (doctor) {
        $.each(doctor, function (key, val) {
            form.find("input[name='" + key + "']").val(val);
        });
        $('#editRow').modal();
    })
}
var form = $('#detailsForm');
function update(id) {
    $.get("rest/doctors/" + id, function (data) {
        $.each(data, function (key, value) {
            form.find("[name='" + key + "']").val(value);
        });
        $('#editRow').modal();
    })
}
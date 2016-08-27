<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="container-fluid">
    <h3>Patients
        <a class="btn btn-sm btn-info" id="addPatient" onclick="addPatient()">New patient</a>
    </h3>
    <div class="view-box">
        <div class="row">
            <div class="col-sm-6">
                <h5>Name</h5>
                <input class="form-control" type="text" id="namesearch">
            </div>
            <div class="col-sm-6">
                <h5>Telephone Number</h5>
                <input class="form-control" type="text" id="telsearch">
            </div>
        </div>
        <table class="table table-striped display" id="dataTable">
            <thead>
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Telephone</th>
                <th></th>
            </tr>
            </thead>
        </table>
    </div>
</div>
<jsp:include page="editPatient.jsp"/>
<script type="text/javascript" src="resources/js/patientDatatables.js"></script>
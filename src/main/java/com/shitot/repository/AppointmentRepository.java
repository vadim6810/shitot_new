package com.shitot.repository;

import com.shitot.model.*;

import java.util.List;


public interface AppointmentRepository {

    Appointment save(Appointment appointment);

    List<Problem> getAllProblems();

    List<Symptom> getAllSymptoms();

    List<Appointment> getAllByDoctor(int id);

    List<Appointment> getAllByAltDoctor(int id);

    List<Appointment> getAllByDoctorAndAlt(int id);

    List<Appointment> getAllByPatient(int id);

    List<Appointment> getAll();
//    List getJPQL(String s);

    Appointment get(int id);

    void setProblems(int id, String... problems);

    void setSymptoms(int id, String... symptoms);

    void setPatient(int id, int patientId);

    void setDoctor(Appointment id, int doctorId);

    void setAltDoctor(Appointment id, int altDoctorId);

    boolean removeDoctor(int appointmentId);

    boolean removeAltDoctor(int appointmentId);
}

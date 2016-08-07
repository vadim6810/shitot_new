package com.shitot.web.clinic;

import com.shitot.model.Clinic;
import com.shitot.model.Slot;
import com.shitot.service.ClinicService;
import com.shitot.web.ExceptionInfoHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Created by Oleg on 03.08.2016.
 */
@RestController
@RequestMapping("/rest/clinics")
public class ClinicRestController implements ExceptionInfoHandler{

    @Autowired
    private ClinicService service;

    @RequestMapping(value = "/cities", method = RequestMethod.GET)
    public List<String> getAllCities() {return service.getAllCities();}

    @RequestMapping(value = "/{id}/{doctorId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Clinic get(@PathVariable int id, @PathVariable int doctorId) {
        return service.get(id, doctorId);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<String> createOrUpdate(@Valid Clinic clinic, @RequestParam Integer doctorId,
                                                 BindingResult result) {
        if (result.hasErrors()) {
            StringBuilder sb = new StringBuilder();
            result.getFieldErrors()
                  .forEach(fe -> sb.append(fe.getField()).append(" ").append(fe.getDefaultMessage()).append("<br>"));
            return new ResponseEntity<>(sb.toString(), HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (clinic.isNew()) {
            service.save(clinic, doctorId);
        } else service.update(clinic, doctorId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}/{doctorId}", method = RequestMethod.DELETE)
    public void delete(@PathVariable int id, @PathVariable int doctorId) {
        service.delete(id,doctorId);
    }

    @RequestMapping(value = "/{id}/slots",method = RequestMethod.POST)
    public ResponseEntity<String> updateSlots(@RequestBody List<Slot> slots, @PathVariable("id") int clinicId){
        service.setSlots(clinicId,slots);
        return new ResponseEntity<>(HttpStatus.OK);
    }



    @RequestMapping(value = "/setclinic", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String setClinic(@RequestParam("id") Integer id, @RequestParam("name") String name,
                            @RequestParam("city") String city, @RequestParam("address") String address,
                            @RequestParam("doctorId") int doctorId) {
        service.setClinic(id, name, city, address, doctorId);
        return id + "<br>" + city + "<br>" + name + "<br>" + address;
    }

    @RequestMapping(value = "/slots/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Slot> getSlots(@PathVariable int id) {
        return service.getSlots(id);
    }

    @RequestMapping(value = "/dayslot/{dayofweek}/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Slot getDaySlot(@PathVariable int dayofweek, @PathVariable int id) {
        return service.getDaySlot(dayofweek, id);
    }

    @RequestMapping(value = "/setslot/{day}/{id}/{hours}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String setSlot(@PathVariable int day, @PathVariable int id, @PathVariable String hours) {
        String hoursString[] = hours.split(",");
        int hourseInt[] = new int[hoursString.length];
        for (int i = 0; i < hoursString.length; ++i)
            hourseInt[i] = Integer.parseInt(hoursString[i]);
        service.setSlot(day, id, hourseInt);
        return "OK";
    }

    @RequestMapping(value = "/deleteslot/{day}/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String deleteSlot(@PathVariable int day, @PathVariable int id) {
        service.deleteSlot(day, id);
        return "OK";
    }

}

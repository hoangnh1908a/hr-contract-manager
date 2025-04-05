package com.project.hrcm.controllers;

import com.project.hrcm.entities.Position;
import com.project.hrcm.models.requests.BaseRequest;
import com.project.hrcm.models.requests.IdRequest;
import com.project.hrcm.models.requests.NameRequest;
import com.project.hrcm.models.requests.StatusRequest;
import com.project.hrcm.services.PositionService;
import com.project.hrcm.utils.Constants;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/position")
public class PositionController {

  private final PositionService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<List<Position>> getPositions() {
    List<Position> positions = service.getPositions();
    return new ResponseEntity<>(positions, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Position> getPositionById(
      @Valid @RequestBody IdRequest idRequest, Locale locale) {
    return new ResponseEntity<>(
        service.getPositionById(idRequest.getId(), locale), HttpStatus.OK);
  }

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Position> createPosition(
      @Valid @RequestBody NameRequest nameRequest, Locale locale) {
    return new ResponseEntity<>(service.createPosition(nameRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Position> updatePosition(
      @Valid @RequestBody BaseRequest baseRequest, Locale locale) {
    return new ResponseEntity<>(service.updatePosition(baseRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deletePosition(
      @Valid @RequestBody IdRequest idRequest, Locale locale) {
    service.deletePosition(idRequest.getId(), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }

  @PostMapping("/lock")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Position> lockUser(
      @Valid @RequestBody StatusRequest statusRequest, Locale locale) {

    Position position = service.lockOrUnlockPosition(statusRequest, locale);

    return new ResponseEntity<>(position, HttpStatus.OK);
  }
}

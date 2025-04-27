package com.project.hrcm.controllers;

import com.project.hrcm.entities.Position;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.models.requests.StatusValidateRequest;
import com.project.hrcm.models.requests.noRequired.NameRequest;
import com.project.hrcm.services.PositionService;
import com.project.hrcm.utils.Constants;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
  public ResponseEntity<Page<Position>> getPositions(@RequestParam(required = false) String name, Pageable pageable) {
    Page<Position> positions = service.getPositions(name, pageable);
    return new ResponseEntity<>(positions, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Position> getPositionById(
          @Valid @RequestBody String id, Locale locale) {
    return new ResponseEntity<>(
        service.getPositionById(Integer.valueOf(id), locale), HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Position> createPosition(
          @Valid @RequestBody NameValidateRequest nameValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.createPosition(nameValidateRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Position> updatePosition(
          @Valid @RequestBody BaseValidateRequest baseValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.updatePosition(baseValidateRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deletePosition(
          @Valid @RequestBody String id, Locale locale) {
    service.deletePosition(Integer.valueOf(id), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }

  @PostMapping("/lock")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Position> lockUser(
          @Valid @RequestBody StatusValidateRequest statusValidateRequest, Locale locale) {

    Position position = service.lockOrUnlockPosition(statusValidateRequest, locale);

    return new ResponseEntity<>(position, HttpStatus.OK);
  }
}

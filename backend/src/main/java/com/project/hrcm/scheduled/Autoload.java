package com.project.hrcm.scheduled;

import com.project.hrcm.utils.InitialLoad;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class Autoload {

  private final InitialLoad initialLoad;

  @Scheduled(fixedRateString = "${scheduling.load-data}")
  public void loadData() {
    initialLoad.load();
  }
}

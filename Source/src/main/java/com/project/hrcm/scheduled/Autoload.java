package com.project.hrcm.scheduled;

import com.project.hrcm.utils.InitialLoad;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@AllArgsConstructor
@Service
public class Autoload {

    private final InitialLoad initialLoad;

    @Scheduled(fixedRateString = "${scheduling.autoload}")
    public void loadData() {
        initialLoad.load();
    }
}

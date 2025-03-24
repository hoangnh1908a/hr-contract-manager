package com.project.hrcm.models.requests;

import lombok.NoArgsConstructor;

import lombok.AllArgsConstructor;

import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequest {
    
    private String username;
    private String password;
}

package Demo.project.of.sprinboot.Controller;

import Demo.project.of.sprinboot.DTO.LoginRequest;
import Demo.project.of.sprinboot.DTO.Registerrequest;
import Demo.project.of.sprinboot.Model.User;
import Demo.project.of.sprinboot.Service.Userservice;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private Userservice userservice;

    @PostMapping("/public/login")
    public ResponseEntity<?> Loginuser(@RequestBody LoginRequest loginRequest) {
          return ResponseEntity.ok(userservice.login(loginRequest));
    }

    @PostMapping("/public/register")
    public ResponseEntity<?> registeruser(@RequestBody Registerrequest registerrequest){
        User user = new User();
        user.setUsername(registerrequest.getUsername());
        user.setPassword(registerrequest.getPassword());
        user.setEmail(registerrequest.getEmail());
        user.setRole("ROLE_USER");
        userservice.registerUser(user);
        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);

    }



}

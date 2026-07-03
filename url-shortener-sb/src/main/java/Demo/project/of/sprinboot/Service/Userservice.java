package Demo.project.of.sprinboot.Service;

import Demo.project.of.sprinboot.Model.User;
import Demo.project.of.sprinboot.Resposiory.UserResposiory;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class Userservice {
    private PasswordEncoder passwordEncoder;
    private UserResposiory  userResposiory;


    public User  registerUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userResposiory.save(user);
    }
}

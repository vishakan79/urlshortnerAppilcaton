package Demo.project.of.sprinboot.Service;

import Demo.project.of.sprinboot.Model.User;
import Demo.project.of.sprinboot.Resposiory.UserResposiory;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImp implements UserDetailsService {
    @Autowired
    private UserResposiory  userResposiory;

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userResposiory.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("username not found"+username));
        return UserDetailsimp.build(user);
    }
}

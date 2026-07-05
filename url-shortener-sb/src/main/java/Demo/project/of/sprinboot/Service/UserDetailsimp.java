package Demo.project.of.sprinboot.Service;

import Demo.project.of.sprinboot.Model.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
public class UserDetailsimp implements UserDetails {

    private static final long serialVersionUID = 1L;
    private String emial;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private String username;

    public static UserDetailsimp build(User user){
        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(user.getRole());
        return new UserDetailsimp(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(grantedAuthority),
                user.getUsername()
        );
    }

    public UserDetailsimp(String emial, String password, Collection<? extends GrantedAuthority> authorities, String username) {
        this.emial = emial;
        this.password = password;
        this.authorities = authorities;
        this.username = username;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }
}

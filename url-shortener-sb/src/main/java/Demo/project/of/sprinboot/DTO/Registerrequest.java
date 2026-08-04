package Demo.project.of.sprinboot.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;
@Data
@AllArgsConstructor
public class Registerrequest {
    private String username;
    private String email;
    private Set<String> role;
    private String password;
}

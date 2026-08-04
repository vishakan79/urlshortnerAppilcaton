package Demo.project.of.sprinboot.Resposiory;

import Demo.project.of.sprinboot.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserResposiory extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
}

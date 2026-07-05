package Demo.project.of.sprinboot.Resposiory;

import Demo.project.of.sprinboot.DTO.UrlMappingDto;
import Demo.project.of.sprinboot.Model.UrlMapping;
import Demo.project.of.sprinboot.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UrlMappingRespository extends JpaRepository<UrlMapping,Long> {
     UrlMapping findByShorturl(String shorturl);
     List<UrlMapping> findByUser(User user);
}

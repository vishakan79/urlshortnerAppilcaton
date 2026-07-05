package Demo.project.of.sprinboot.Service;

import Demo.project.of.sprinboot.DTO.UrlMappingDto;
import Demo.project.of.sprinboot.Model.UrlMapping;
import Demo.project.of.sprinboot.Model.User;
import Demo.project.of.sprinboot.Resposiory.UrlMappingRespository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@AllArgsConstructor
public class URLmappingService {
    private UrlMappingRespository urlMappingRespository;
    public UrlMappingDto createShortUrl(String originalurl, User user) {
        String shorturl =gernateshorturl( originalurl);
        UrlMapping urlMapping =new UrlMapping();
        urlMapping.setOriginalurl(originalurl);
        urlMapping.setShorturl(shorturl);
        urlMapping.setUser(user);
        urlMapping.setCreatedDate(LocalDateTime.now());
        UrlMapping SavedUrlMapping = urlMappingRespository.save(urlMapping);
        return converttoDo(SavedUrlMapping);
    }

    private UrlMappingDto converttoDo(UrlMapping savedUrlMapping) {
        UrlMappingDto urlMappingDto = new UrlMappingDto();
        urlMappingDto.setId(savedUrlMapping.getId());
        urlMappingDto.setOriginalurl(savedUrlMapping.getOriginalurl());
        urlMappingDto.setShortnerurl(savedUrlMapping.getShorturl());
        urlMappingDto.setClickCount(savedUrlMapping.getClickcount());
        urlMappingDto.setCreatedtime(savedUrlMapping.getCreatedDate());
        urlMappingDto.setUsername(savedUrlMapping.getUser().getUsername());
        return urlMappingDto;
    }

    private String gernateshorturl(String originalurl) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder stringBuilder = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            stringBuilder.append(characters.charAt(random.nextInt(characters.length())));
        }
        return stringBuilder.toString();

    }

    public List<UrlMappingDto> geturlsuser(User user) {
        return urlMappingRespository.findByUser(user).stream()
                .map(this::converttoDo).toList();
    }
}

package Demo.project.of.sprinboot.Service;

import Demo.project.of.sprinboot.DTO.ClickEventDTO;
import Demo.project.of.sprinboot.DTO.UrlMappingDto;
import Demo.project.of.sprinboot.Model.UrlMapping;
import Demo.project.of.sprinboot.Model.User;
import Demo.project.of.sprinboot.Model.clickevent;
import Demo.project.of.sprinboot.Resposiory.ClickEventRespostiory;
import Demo.project.of.sprinboot.Resposiory.UrlMappingRespository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class URLmappingService {
    private ClickEventRespostiory clickEventRespostiory;
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

    public List<ClickEventDTO> getclickeventbydate(String shorturl, LocalDateTime startDate, LocalDateTime endDate) {
        UrlMapping urlMapping = urlMappingRespository.findByShorturl(shorturl);
        if(urlMapping!=null){
            return  clickEventRespostiory.findByUrlmappingAndClickeventBetween(urlMapping,startDate,endDate)
                    .stream().collect(Collectors.groupingBy(click ->click.getClickevent().toLocalDate(),Collectors.counting()))
                    .entrySet().stream()
                    .map(entry ->{
                        ClickEventDTO clickEventDTO = new ClickEventDTO();
                        clickEventDTO.setClickDate(entry.getKey());
                        clickEventDTO.setCount(entry.getValue());
                        return clickEventDTO;
                    })
                    .collect(Collectors.toList());
        }
        return null;

    }

    public Map<LocalDate, Long> getTotalClickByuseranddate(User user, LocalDate startDate, LocalDate endDate) {
        List<UrlMapping> urlMappings = urlMappingRespository.findByUser(user);
        List<clickevent> clickEvents = clickEventRespostiory.findByUrlmappingInAndClickeventBetween( urlMappings, startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay());
        return clickEvents.stream()
                .collect(Collectors.groupingBy(click -> click.getClickevent().toLocalDate(),Collectors.counting()));
    }
}

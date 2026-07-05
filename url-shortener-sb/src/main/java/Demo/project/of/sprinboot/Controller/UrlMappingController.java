package Demo.project.of.sprinboot.Controller;

import Demo.project.of.sprinboot.DTO.UrlMappingDto;
import Demo.project.of.sprinboot.Model.User;
import Demo.project.of.sprinboot.Service.URLmappingService;
import Demo.project.of.sprinboot.Service.Userservice;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
@AllArgsConstructor
public class UrlMappingController {
    private URLmappingService  urlmappingService;
    private Userservice userservice;

    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDto> createshorturl(@RequestBody Map<String ,String> request, Principal principal)
    {
       String originalurl = request.get("originalUrl");
        User user =userservice.findbyusername(principal.getName());
        UrlMappingDto urlMappingDto = urlmappingService.createShortUrl(originalurl,user);
        return ResponseEntity.ok(urlMappingDto);

    }
    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDto>> getMyurls(Principal principal){
        User user =userservice.findbyusername(principal.getName());
        List<UrlMappingDto> urls = urlmappingService.geturlsuser(user);
        return ResponseEntity.ok(urls);
    }
}

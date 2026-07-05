package Demo.project.of.sprinboot.Controller;

import Demo.project.of.sprinboot.Model.UrlMapping;
import Demo.project.of.sprinboot.Service.URLmappingService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class RedirectController {
    private URLmappingService  urlmappingService;

    @GetMapping("/{shorturl}")
    public ResponseEntity<Void> redirect(@PathVariable String shorturl){
        UrlMapping urlMapping =urlmappingService.getOriginalUrl(shorturl);
        if(urlMapping!=null){
            HttpHeaders Httpheaders = new HttpHeaders();
            Httpheaders.add("Location",urlMapping.getOriginalurl());
           return  ResponseEntity.status(302).headers(Httpheaders).build();
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }
}

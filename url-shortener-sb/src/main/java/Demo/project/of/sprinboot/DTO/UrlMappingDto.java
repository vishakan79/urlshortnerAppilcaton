package Demo.project.of.sprinboot.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data

public class UrlMappingDto {

    private Long id;
    private String originalurl;
    private String shortnerurl;
    private int clickCount;
    private LocalDateTime createdtime;
    private String username;
}

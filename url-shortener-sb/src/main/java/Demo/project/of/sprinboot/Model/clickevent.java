package Demo.project.of.sprinboot.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class clickevent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime clickevent;

    @ManyToOne
    @JoinColumn(name = "url_mapping_id")
    private UrlMapping urlmapping;
}

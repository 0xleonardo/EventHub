package hr.tvz.dreamteam.eventhub.pdf.ticket;


import com.lowagie.text.DocumentException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Controller
@RequestMapping("/api")
@AllArgsConstructor
public class PdfController {

    private final PdfService pdfService;

    @GetMapping("/download-pdf/{ticketId}")
    public void downloadPDFResource(HttpServletResponse response, @PathVariable("ticketId") UUID ticketId) {
        try {
            Path file = Paths.get(pdfService.generatePdf(ticketId).getAbsolutePath());
            if (Files.exists(file)) {
                response.setContentType("application/pdf");
                response.addHeader("Content-Disposition",
                        "attachment; filename=" + file.getFileName());
                Files.copy(file, response.getOutputStream());
                response.getOutputStream().flush();
            }
        } catch (DocumentException | IOException ex) {
            ex.printStackTrace();
        }
    }

}

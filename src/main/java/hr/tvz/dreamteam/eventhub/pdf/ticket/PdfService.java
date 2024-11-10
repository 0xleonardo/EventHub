package hr.tvz.dreamteam.eventhub.pdf.ticket;

import com.lowagie.text.DocumentException;
import hr.tvz.dreamteam.eventhub.infrastructure.exception.EventException;
import hr.tvz.dreamteam.eventhub.pdf.qrcode.QRCodeService;
import hr.tvz.dreamteam.eventhub.web.tickets.TicketRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PdfService {

    private TicketRepository ticketRepository;
    private SpringTemplateEngine templateEngine;
    private QRCodeService qrCodeService;

    public File generatePdf(UUID ticketId) throws IOException, DocumentException {
        Context context = getContext(ticketId);
        String html = loadAndFillTemplate(context);
        return renderPdf(html);
    }

    private File renderPdf(String html) throws IOException, DocumentException {
        File file = File.createTempFile("students", ".pdf");
        OutputStream outputStream = new FileOutputStream(file);
        ITextRenderer renderer = new ITextRenderer(20f * 4f / 3f, 20);
        renderer.setDocumentFromString(html);
        renderer.layout();
        renderer.createPDF(outputStream);
        outputStream.close();
        file.deleteOnExit();
        return file;
    }

    private Context getContext(UUID ticketId) {
        Context context = new Context();

        var ticket = ticketRepository.findTicketById(ticketId);

        if (ticket.isPresent()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy. HH:mm");
            context.setVariable("eventname", ticket.get().getEvent().getName());
            context.setVariable("orderedby", "%s %s".formatted(ticket.get().getTransaction().getUser().getFirstName(), ticket.get().getTransaction().getUser().getLastName()));
            context.setVariable("ticketprice", (int) ticket.get().getPrice());
            context.setVariable("datetime", ticket.get().getEvent().getDatetimeFrom().format(formatter));

            var qrcode = qrCodeService.getQRCodeAsBase64String(ticket.get().getId().toString());
            context.setVariable("qrcode", qrcode);

        } else {
            throw EventException.notFound("No ticket found to generate PDF");
        }

        return context;
    }

    private String loadAndFillTemplate(Context context) {
        return templateEngine.process("ticket", context);
    }


}

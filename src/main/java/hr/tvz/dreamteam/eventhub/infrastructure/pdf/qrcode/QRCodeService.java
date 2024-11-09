package hr.tvz.dreamteam.eventhub.infrastructure.pdf.qrcode;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Component
public class QRCodeService {

    public String getQRCodeAsBase64String(String activateTicketId) {
        byte[] image = new byte[0];

        try {
            image = getQRCode("http://localhost:8080/api/activate-ticket/%s".formatted(activateTicketId), 500, 500);

        } catch (WriterException | IOException e) {
            e.printStackTrace();
        }

        return Base64.getEncoder().encodeToString(image);
    }

    private byte[] getQRCode(String text, int width, int height)
            throws WriterException, IOException {

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();

        MatrixToImageConfig con = new MatrixToImageConfig(0xFFFFFFFF, 0xFF00192F);

        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream, con);

        byte[] pngData = pngOutputStream.toByteArray();

        return pngData;
    }

}
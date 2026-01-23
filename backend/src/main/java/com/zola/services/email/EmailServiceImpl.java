package com.zola.services.email;

import com.zola.dto.request.email.Account;
import com.zola.dto.request.email.EmailRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailServiceImpl implements EmailService {

    EmailClient emailClient;

    @NonFinal
    @Value("${email.api-key}")
    String apiKey;

    @NonFinal
    @Value("${email.sender.email}")
    String senderEmail;

    @NonFinal
    @Value("${email.sender.name}")
    String senderName;

    @Override
    public void sendOtpEmail(String to, String otp) {
        String content = "<!DOCTYPE html>" +
                "<html lang='vi'>" +
                "<head>" +
                "  <meta charset='UTF-8'/>" +
                "  <meta name='viewport' content='width=device-width, initial-scale=1.0'/>" +
                "  <title>Mã OTP Zola</title>" +
                "</head>" +
                "<body style='margin:0; padding:0; background-color:#f0fdf4; font-family: Arial, sans-serif;'>" +
                "  <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f0fdf4; padding: 40px 0;'>" +
                "    <tr><td align='center'>" +
                "      <table width='560' cellpadding='0' cellspacing='0' style='background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 16px rgba(22,163,74,0.12);'>" +
                "        <!-- Header -->" +
                "        <tr><td align='center' style='background: linear-gradient(135deg, #16A34A, #15803d); padding: 36px 40px;'>" +
                "          <h1 style='margin:0; color:#ffffff; font-size:28px; letter-spacing:1px;'>Zola</h1>" +
                "          <p style='margin:8px 0 0; color:#bbf7d0; font-size:14px;'>Xác thực tài khoản của bạn</p>" +
                "        </td></tr>" +
                "        <!-- Body -->" +
                "        <tr><td style='padding: 40px 48px;'>" +
                "          <h2 style='margin:0 0 12px; color:#11181C; font-size:20px;'>Chào mừng bạn đến với Zola!</h2>" +
                "          <p style='margin:0 0 28px; color:#555; font-size:15px; line-height:1.6;'>Chúng tôi nhận được yêu cầu xác thực tài khoản của bạn. Sử dụng mã OTP bên dưới để hoàn tất quá trình xác thực:</p>" +
                "          <!-- OTP -->" +
                "          <table width='100%' cellpadding='0' cellspacing='0'><tr><td align='center' style='padding: 8px 0 32px;'>" +
                "            <p style='margin:0; color:#687076; font-size:12px; text-transform:uppercase; letter-spacing:2px;'>Mã xác thực OTP</p>" +
                "            <p style='margin:10px 0 0; color:#11181C; font-size:48px; font-weight:bold; letter-spacing:12px;'>" + otp + "</p>" +
                "          </td></tr></table>" +
                "          <!-- Warning -->" +
                "          <table width='100%' cellpadding='0' cellspacing='0'><tr>" +
                "            <td style='background-color:#f0fdf4; border-left: 4px solid #16A34A; border-radius:6px; padding: 12px 16px;'>" +
                "              <p style='margin:0; color:#15803d; font-size:13px;'>Mã này có hiệu lực trong <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>" +
                "            </td>" +
                "          </tr></table>" +
                "        </td></tr>" +
                "        <!-- Footer -->" +
                "        <tr><td style='background-color:#f9fafb; border-top: 1px solid #dcfce7; padding: 24px 48px; text-align:center;'>" +
                "          <p style='margin:0; color:#aaa; font-size:13px;'>Trân trọng,<br/><strong style='color:#16A34A;'>Đội ngũ Zola</strong></p>" +
                "          <p style='margin:12px 0 0; color:#ccc; font-size:11px;'>Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.</p>" +
                "        </td></tr>" +
                "      </table>" +
                "    </td></tr>" +
                "  </table>" +
                "</body>" +
                "</html>";
        EmailRequest emailRequest = EmailRequest.builder()
                .sender(Account.builder().name(senderName).email(senderEmail).build())
                .to(List.of(Account.builder().email(to).build()))
                .subject("Zola - Mã xác thực OTP của bạn")
                .htmlContent(content)
                .build();
        try {
            emailClient.sendEmail(apiKey, emailRequest);
            log.info("OTP email sent successfully to {} via Brevo", to);
        } catch (Exception e) {
            log.error("Failed to send email to {} via Brevo", to, e);
            throw new RuntimeException("Could not send email via Brevo. Please check API key or configuration.");
        }
    }
}

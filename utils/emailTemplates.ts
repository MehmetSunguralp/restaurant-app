export const verificationEmailTemplate = (code: string, title: string ) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2 style="text-align: center; color: #333;">Hesabınızı Doğrulayın</h2>
    <p>Merhaba,</p>
    <p>${title}</p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="font-size: 28px; font-weight: bold; background: #f0f0f0; padding: 12px 24px; border-radius: 8px;">${code}</span>
    </div>
    <p>Kod 10 dakika boyunca geçerlidir.</p>
    <p style="color: #666; font-size: 14px;">Bu e-postayı siz istemediyseniz, lütfen dikkate almayın.</p>
  </div>
`;

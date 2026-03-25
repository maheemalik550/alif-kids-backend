

export const templates = {
  otp: (type, payload) => {
    console.log('paylaod',payload)
     if (
      type === 'forgotPassword' 
    ) {
      return generateDefaultURLTemplate(payload)
    } 
  },
}
export const generateWithDrawRequest=(payload)=>{
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>New Withdraw Request</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:30px 10px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#1f2937;padding:20px;text-align:center;">
                  <h2 style="margin:0;color:#ffffff;font-size:20px;">
                    New Withdrawal Request
                  </h2>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px;color:#374151;">
                  <p style="margin:0 0 15px 0;font-size:14px;">
                    Hello Admin,
                  </p>

                  <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;">
                    A new withdrawal request has been submitted. Below are the details:
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">
                        Publisher Name
                      </td>
                      <td style="padding:10px;border:1px solid #e5e7eb;">
                        ${payload?.publisherId?.name || '-'}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">
                        Publisher Email
                      </td>
                      <td style="padding:10px;border:1px solid #e5e7eb;">
                        ${payload?.publisherId?.email || '-'}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">
                        Withdrawal Amount
                      </td>
                      <td style="padding:10px;border:1px solid #e5e7eb;">
                        <strong>${payload?.amount}</strong>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:25px 0 0 0;font-size:14px;line-height:1.6;">
                    Please review and process this request from the admin panel.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
                  © ${new Date().getFullYear()} Alif Kids. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `

}
export const generatePaidWithDrawRequest = (status, payload) => {
  const isPaid = status === "paid";
  const notes = payload?.requestId?.notes || [];

  const notesHtml = notes.length
    ? `
      <h3 style="margin:30px 0 10px 0;font-size:15px;color:#111827;">
        Notes
      </h3>
      ${notes
        .map(
          (note, index) => `
          <div style="margin-bottom:15px;padding:12px;border:1px solid #e5e7eb;border-radius:6px;">
            <p style="margin:0 0 8px 0;font-size:14px;color:#374151;">
              ${note?.text || ""}
            </p>

            ${
              note?.attachments?.length
                ? `
                <p style="margin:0;font-size:13px;color:#6b7280;">
                  Attachments:
                </p>
                <ul style="margin:6px 0 0 18px;padding:0;">
                  ${note.attachments
                    .map(
                      (file) => `
                      <li style="margin-bottom:4px;">
                        <a href="${file}" target="_blank" style="color:#2563eb;text-decoration:none;">
                          View attachment
                        </a>
                      </li>
                    `
                    )
                    .join("")}
                </ul>
              `
                : ""
            }
          </div>
        `
        )
        .join("")}
    `
    : "";

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Withdraw Request Approved</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:30px 10px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#16a34a;padding:20px;text-align:center;">
                  <h2 style="margin:0;color:#ffffff;font-size:20px;">
                    Withdraw Request Approved
                  </h2>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px;color:#374151;">
                  <p style="margin:0 0 15px 0;font-size:14px;">
                    Hello ${payload?.publisherId?.name || "Publisher"},
                  </p>

                  <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;">
                    Your withdrawal request has been successfully processed and marked as paid.
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">
                        Request ID
                      </td>
                      <td style="padding:10px;border:1px solid #e5e7eb;">
                        ${payload?.requestId?._id || "-"}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">
                        Amount Paid
                      </td>
                      <td style="padding:10px;border:1px solid #e5e7eb;">
                        <strong>${payload?.requestId?.amount || "-"}</strong>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:10px;border:1px solid #e5e7eb;font-weight:bold;">
                        Status
                      </td>
                      <td style="padding:10px;border:1px solid #e5e7eb;color:#16a34a;font-weight:bold;">
                        PAID
                      </td>
                    </tr>
                  </table>

                  ${notesHtml}

                  <p style="margin:25px 0 0 0;font-size:14px;line-height:1.6;">
                    If you have any questions regarding this transaction, please contact our support team.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
                  © ${new Date().getFullYear()} Alif Kids. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

// Default template for unsupported platforms
export const generateNewGuestEmail =  (payload) =>
  `<!DOCTYPE html>
<html lang="en" style="background-color:#000000; margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Alif Kids</title>
  <style>
    @media only screen and (max-width: 600px) {
      .app-badges img {
        width: 120px !important;
        height: auto !important;
      }
    }
  </style>
</head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
<table align="center" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #dddddd; background-color: #ffffff;">
 <tr>
              <td style="padding:0; line-height:0; font-size:0;">
                <a href="https://alifkids.app/" target="_blank">
                  <img src="https://media.kidsread.app/email-cover-new111.png" alt="Welcome Banner" style="display:block; width:100%; max-width:600px; height:auto; border:0; vertical-align:bottom; background-color:#000000;">
                </a>
              </td>
            </tr>   
<tr>
        <td align="center" style="padding: 20px 0; background-color: #007BFF; color: #ffffff; font-size: 24px;">
            Alif Kids - New User Registration
        </td>
    </tr>
    <tr>
        <td style="padding: 20px;">
            <p>Hello,</p>
            <p>You have a new user registered on your app <strong>Alif Kids</strong> website. Here are the details:</p>
            <table cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <tr>
                    <td width="30%" style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Name:</strong></td>
                    <td style="border: 1px solid #dddddd;">${payload?.name}</td>
                </tr>
                <tr>
                    <td width="30%" style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Parent Name:</strong></td>
                    <td style="border: 1px solid #dddddd;">${payload?.parentName}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
                    <td style="border: 1px solid #dddddd;">${payload?.email}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Country:</strong></td>
                    <td style="border: 1px solid #dddddd;">${payload?.country}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Device:</strong></td>
                    <td style="border: 1px solid #dddddd;">${payload?.device}</td>
                </tr>
            </table>
            <p style="margin-top: 20px;">Thank you,</p>
            <p>The Alif Kids Team</p>
        </td>
    </tr>
    <tr>
        <td align="center" style="padding: 10px; background-color: #f4f4f4; color: #555555; font-size: 12px;">
            &copy; 2024 Alif Kids. All rights reserved.
        </td>
    </tr>
</table>
</body>
</html>`
const generateWelcomeTemplate = (payload) =>
  `<!DOCTYPE html>
<html lang="en" style="background-color:#ffffff; margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Alif Kids</title>
  <style>
    @media only screen and (max-width: 600px) {
      .app-badges img {
        width: 120px !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, sans-serif; color:#000000;">
  <center style="width:100%; background-color:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff; border-collapse:collapse; margin:0; padding:0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#ffffff; color:#000000;">

            <!-- Banner -->
            <tr>
              <td style="padding:0; line-height:0; font-size:0;">
                <a href="https://alifkids.app/" target="_blank">
                  <img src="https://res.cloudinary.com/dayfv4et9/image/upload/v1757052722/Email_Template.png" alt="Welcome Banner" style="display:block; width:100%; max-width:600px; height:auto; border:0; vertical-align:bottom; background-color:#ffffff;">
                </a>
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td style="text-align:center; color:#e96249; font-size:28px; font-weight:bold; padding-top:20px; padding-bottom:10px;">
                WELCOME TO ALIF KIDS!
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.6; color:#000000;">
                <p style="margin:0 0 10px 0; color:#000000;"><strong>Dear ${payload?.name || 'Reader'},</strong></p>
                <p style="margin:0 0 10px 0; color:#000000;">Welcome to Alif Kids! You’re now just a tap away from exploring magical stories, exciting adventures, and inspiring lessons—created just for readers like you.</p>
                <p style="margin:0; color:#000000;">Start discovering a world of interactive, values-based books today.</p>
              </td>
            </tr>

            <!-- Explore Button -->
            <tr>
              <td align="center" style="padding: 20px;">
                <a href="https://alifkids.app/download" target="_blank" style="background-color:#e96249; padding:12px 60px; border-radius:30px; color:#ffffff; text-decoration:none; font-size:16px; font-weight:bold; display:inline-block;">Explore Books</a>
              </td>
            </tr>

            <!-- Sign-off -->
            <tr>
              <td style="padding: 20px; font-size:16px; line-height:1.6; color:#000000; text-align:left;">
                Happy reading!<br />
                <strong>The Alif Kids Team</strong>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="color:#000000; font-size:14px; padding:20px;">
                <p style="margin:0 0 10px 0;"><strong>AVAILABLE ON</strong></p>
                <table align="center" class="app-badges" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto; max-width:280px; width:100%;">
                  <tr>
                    <td align="center" style="padding:0 5px;">
                      <a href="https://play.google.com/store/apps/details?id=com.sidrproductions.alifkids&pcampaignid=web_share" target="_blank">
                        <img src="https://media.kidsread.app/Playstore.png" alt="Google Play Store" style="width:140px; max-width:100%; display:block; border:0;">
                      </a>
                    </td>
                    <td align="center" style="padding:0 5px;">
                      <a href="https://apps.apple.com/us/app/alif-kids/id6744365674" target="_blank">
                        <img src="https://media.kidsread.app/App%20Store.png" alt="App Store" style="width:140px; max-width:100%; display:block; border:0;">
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin-top:15px;">No longer want to receive these emails? <a href="#" style="color:#e96249; text-decoration:none;">Unsubscribe</a></p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`
const generateWelcomeTemplateNew = (payload) =>
  `<!DOCTYPE html>
<html lang="en" style="background-color:#ffffff; margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Alif Kids</title>
  <style>
    @media only screen and (max-width: 600px) {
      .app-badges img {
        width: 120px !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, sans-serif; color:#000000;">
  <center style="width:100%; background-color:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff; border-collapse:collapse; margin:0; padding:0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#ffffff; color:#000000;">

            <!-- Banner -->
            <tr>
              <td style="padding:0; line-height:0; font-size:0;">
                <a href="https://alifkids.app/" target="_blank">
                  <img src="https://res.cloudinary.com/dayfv4et9/image/upload/v1757052722/Email_Template.png" alt="Welcome Banner" style="display:block; width:100%; max-width:600px; height:auto; border:0; vertical-align:bottom; background-color:#ffffff;">
                </a>
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td style="text-align:center; color:#e96249; font-size:28px; font-weight:bold; padding-top:20px; padding-bottom:10px;">
                WELCOME TO ALIF KIDS!
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.6; color:#000000;">
                <p style="margin:0 0 10px 0; color:#000000;"><strong>Dear ${payload?.name || 'Reader'},</strong></p>
                <p style="margin:0 0 10px 0; color:#000000;">Welcome to Alif Kids! You’re now just a tap away from exploring magical stories, exciting adventures, and inspiring lessons—created just for readers like you.</p>
                <p style="margin:0; color:#000000;">Start discovering a world of interactive, values-based books today.</p>
              </td>
            </tr>

            <!-- Explore Button -->
            <tr>
              <td align="center" style="padding: 20px;">
                <a href="https://alifkids.app/download" target="_blank" style="background-color:#e96249; padding:12px 60px; border-radius:30px; color:#ffffff; text-decoration:none; font-size:16px; font-weight:bold; display:inline-block;">Explore Books</a>
              </td>
            </tr>

            <!-- Sign-off -->
            <tr>
              <td style="padding: 20px; font-size:16px; line-height:1.6; color:#000000; text-align:left;">
                Happy reading!<br />
                <strong>The Alif Kids Team</strong>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="color:#000000; font-size:14px; padding:20px;">
                <p style="margin:0 0 10px 0;"><strong>AVAILABLE ON</strong></p>
                <table align="center" class="app-badges" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto; max-width:280px; width:100%;">
                  <tr>
                    <td align="center" style="padding:0 5px;">
                      <a href="https://play.google.com/store/apps/details?id=com.sidrproductions.alifkids&pcampaignid=web_share" target="_blank">
                        <img src="https://media.kidsread.app/Playstore.png" alt="Google Play Store" style="width:140px; max-width:100%; display:block; border:0;">
                      </a>
                    </td>
                    <td align="center" style="padding:0 5px;">
                      <a href="https://apps.apple.com/us/app/alif-kids/id6744365674" target="_blank">
                        <img src="https://media.kidsread.app/App%20Store.png" alt="App Store" style="width:140px; max-width:100%; display:block; border:0;">
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin-top:15px;">No longer want to receive these emails? <a href="#" style="color:#e96249; text-decoration:none;">Unsubscribe</a></p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`
const generatePublisherWelcomeTemplateNew = (payload) =>
  `<!DOCTYPE html>
<html lang="en" style="background-color:#ffffff; margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Alif Kids</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .app-badges img {
        width: 120px !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, sans-serif; color:#000000; overflow-x:hidden;">
  <center style="width:100%; background-color:#ffffff; margin:0 auto;">
    <div style="max-width:600px; margin:0 auto; overflow:hidden;">
      <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="margin:0 auto; max-width:600px; width:100%; background-color:#ffffff; border-collapse:collapse;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:#ffffff; color:#000000;">

              <!-- Banner Image -->
              <tr>
                <td style="padding:0; line-height:0;">
                  <a href="https://alifkids.app/" target="_blank">
                    <img src="https://res.cloudinary.com/dayfv4et9/image/upload/v1757052722/Email_Template.png" alt="Welcome Banner" style="width:100%; max-width:600px; display:block; height:auto; border:0; vertical-align:bottom; background-color:#ffffff;">
                  </a>
                </td>
              </tr>

              <!-- Heading -->
              <tr>
                <td style="text-align:center; color:#e96249; font-size:28px; font-weight:bold; padding-top:20px; padding-bottom:10px;">
                  WELCOME TO ALIF KIDS!
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:20px; font-size:16px; line-height:1.6; color:#000000;">
                  <p style="margin:0 0 10px 0; color:#000000;"><strong>Hi ${payload?.name || 'User'},</strong></p>
                  <p style="margin:0 0 10px 0; color:#000000;">Welcome to the Alif Kids family! We’re thrilled to have you on board as a creator dedicated to empowering and inspiring young readers.</p>
                  <p style="margin:0; color:#000000;">Your account has been successfully created. You can now start uploading your books, setting your prices, and reaching a global audience of curious and bright minds.</p>
                </td>
              </tr>

              <!-- Button -->
              <tr>
                <td align="center" style="padding:20px;">
                  <a href="https://publish.alifkids.app/add-book" target="_blank" style="background-color:#e96249; padding:12px 60px; border-radius:30px; color:#ffffff; text-decoration:none; font-size:16px; font-weight:bold; display:inline-block;">Upload Book</a>
                </td>
              </tr>

              <!-- Help Message -->
              <tr>
                <td style="padding:20px; font-size:16px; line-height:1.6; text-align:center; color:#000000;">
                  <p style="margin:0 0 10px 0; color:#000000;">Need help? Our support team is always here for you.</p>
                  <p style="margin:0; color:#000000;">Let’s make storytelling magical again.</p>
                </td>
              </tr>

              <!-- Sign-off -->
              <tr>
                <td style="padding:20px; font-size:16px; line-height:1.6; text-align:left; color:#000000;">
                  Warm regards,<br>
                  <strong>The Alif Kids Team</strong>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="color:#000000; font-size:14px; padding:20px;">
                  <p style="margin:0 0 10px 0;"><strong>AVAILABLE ON</strong></p>
                  <table class="app-badges" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto; max-width:280px; width:100%;">
                    <tr>
                      <td align="center" style="padding:0 5px;">
                        <a href="https://play.google.com/store/apps/details?id=com.sidrproductions.alifkids&pcampaignid=web_share" target="_blank">
                          <img src="https://media.kidsread.app/Playstore.png" alt="Google Play Store" style="width:140px; max-width:100%; display:block; border:0;">
                        </a>
                      </td>
                      <td align="center" style="padding:0 5px;">
                        <a href="https://apps.apple.com/us/app/alif-kids/id6744365674" target="_blank">
                          <img src="https://media.kidsread.app/App%20Store.png" alt="App Store" style="width:140px; max-width:100%; display:block; border:0;">
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin-top:15px;">No longer want to receive these emails? <a href="#" style="color:#e96249; text-decoration:none;">Unsubscribe</a></p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>
`
{
  /* <p>No longer want to receive these emails? <a href="#">Unsubscribe</a></p> */
}

const generateDefaultOtpTemplate = (payload) =>
  `<!DOCTYPE html>
<html lang="en" style="background-color:#000000; margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Alif Kids OTP</title>
  <style>
    @media only screen and (max-width: 600px) {
      .app-badges img {
        width: 120px !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#000000; font-family:Arial, sans-serif; color:#fff;">
  <center style="width:100%; background-color:#000000;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000000; border-collapse:collapse; margin:0; padding:0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#000000; color:#fff;">

            <!-- Banner -->
            <tr>
              <td style="padding:0; line-height:0; font-size:0;">
                <a href="https://alifkids.app/" target="_blank">
                  <img src="https://media.kidsread.app/email-cover-new111.png" alt="Alif Kids Banner" style="display:block; width:100%; max-width:600px; height:auto; border:0; vertical-align:bottom; background-color:#000000;">
                </a>
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td style="text-align:center; color:#A94FA4; font-size:26px; font-weight:bold; padding-top:20px;">
                Your OTP Code
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.6; color:#fff;">
                <p style="margin:0 0 10px 0;  color:#fff;"><strong>Hi ${payload?.name || 'Reader'},</strong></p>
                <p style="margin:0 0 10px 0;  color:#fff;">We’re excited to see you back at Alif Kids!</p>
                <p style="margin:0;  color:#fff;">To continue your journey of magical stories and meaningful learning, please enter the following OTP:</p>
              </td>
            </tr>

            <!-- OTP -->
            <tr>
              <td align="center" style="background-color:#111111; color:#00c6ff; font-size:22px; font-weight:bold; padding:20px; border-radius:12px; letter-spacing:4px;">
                ${payload?.otp}
              </td>
            </tr>

            <!-- Note -->
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.6; color:#fff;">
                <p style="margin:0 0 10px 0;  color:#fff;">This code will expire in 5 minutes.</p>
                <p style="margin:0;  color:#fff;">If you didn’t request this, just ignore this email or <a href="mailto:support@alifkids.app" style="color:#00c6ff; text-decoration:none;">contact our support team</a>.</p>
              </td>
            </tr>

            <!-- Sign-off -->
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.6; text-align:left; color:#fff;">
                Keep learning,<br />
                <strong>The Alif Kids Team</strong>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="color:#fff; font-size:14px; padding:20px;">
                <p style="margin:0 0 10px 0;"><strong>AVAILABLE ON</strong></p>

                <!-- App Store Links -->
                <table align="center" class="app-badges" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; max-width:280px; width:100%;">
                  <tr>
                    <td align="center" style="padding:0 5px;">
                      <a href="https://play.google.com/store/apps/details?id=com.sidrproductions.alifkids&pcampaignid=web_share" target="_blank">
                        <img src="https://media.kidsread.app/Playstore.png" alt="Google Play Store" style="width:140px; max-width:100%; display:block; border:0;">
                      </a>
                    </td>
                    <td align="center" style="padding:0 5px;">
                      <a href="https://apps.apple.com/us/app/alif-kids/id6744365674" target="_blank">
                        <img src="https://media.kidsread.app/App%20Store.png" alt="App Store" style="width:140px; max-width:100%; display:block; border:0;">
                      </a>
                    </td>
                  </tr>
                </table>

               
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`
const generateDefaultOtpTemplateNew = (payload) =>
  `<!DOCTYPE html>
<html lang="en" style="background-color:#ffffff; margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Alif Kids OTP</title>
  <style>
    @media only screen and (max-width: 600px) {
      .app-badges img {
        width: 120px !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, sans-serif; color:#000000;">
  <center style="width:100%; background-color:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff; border-collapse:collapse; margin:0; padding:0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#ffffff; color:#000000;">

            <!-- Banner -->
            <tr>
              <td style="padding:0; line-height:0; font-size:0;">
                <a href="https://alifkids.app/" target="_blank">
                  <img src="https://res.cloudinary.com/dayfv4et9/image/upload/v1757052722/Email_Template.png" alt="Alif Kids Banner" style="display:block; width:100%; max-width:600px; height:auto; border:0; vertical-align:bottom; background-color:#ffffff;">
                </a>
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td style="text-align:center; color:#e96249; font-size:26px; font-weight:bold; padding-top:20px;">
                Your OTP Code
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.6; color:#000000;">
                <p style="margin:0 0 10px 0; color:#000000;"><strong>Hi  ${payload?.name || 'Reader'},</strong></p>
                <p style="margin:0 0 10px 0; color:#000000;">We’re excited to see you back at Alif Kids!</p>
                <p style="margin:0; color:#000000;">To continue your journey of magical stories and meaningful learning, please enter the following OTP:</p>
              </td>
            </tr>

            <!-- OTP -->
            <tr>
              <td align="center" style="background-color:#f7f7f7; color:#e96249; font-size:22px; font-weight:bold; padding:20px; border-radius:12px; letter-spacing:4px;">
                    ${payload?.otp}
              </td>
            </tr>

            <!-- Note -->
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.6; color:#000000;">
                <p style="margin:0 0 10px 0; color:#000000;">This code will expire in 10 minutes.</p>
                <p style="margin:0; color:#000000;">If you didn’t request this, just ignore this email or <a href="mailto:support@alifkids.app" style="color:#e96249; text-decoration:none;">contact our support team</a>.</p>
              </td>
            </tr>

            <!-- Sign-off -->
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.6; text-align:left; color:#000000;">
                Keep learning,<br />
                <strong>The Alif Kids Team</strong>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="color:#000000; font-size:14px; padding:20px;">
                <p style="margin:0 0 10px 0;"><strong>AVAILABLE ON</strong></p>

                <!-- App Store Links -->
                <table align="center" class="app-badges" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; max-width:280px; width:100%;">
                  <tr>
                    <td align="center" style="padding:0 5px;">
                      <a href="https://play.google.com/store/apps/details?id=com.sidrproductions.alifkids&pcampaignid=web_share" target="_blank">
                        <img src="https://media.kidsread.app/Playstore.png" alt="Google Play Store" style="width:140px; max-width:100%; display:block; border:0;">
                      </a>
                    </td>
                    <td align="center" style="padding:0 5px;">
                      <a href="https://apps.apple.com/us/app/alif-kids/id6744365674" target="_blank">
                        <img src="https://media.kidsread.app/App%20Store.png" alt="App Store" style="width:140px; max-width:100%; display:block; border:0;">
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin-top:15px; color:#000000;">No longer want to receive these emails? <a href="#" style="color:#e96249; text-decoration:none;">Unsubscribe</a></p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`
{
  /* <p style="margin-top:15px; color:#fff;">No longer want to receive these emails? <a href="#" style="color:#00c6ff; text-decoration:none;">Unsubscribe</a></p> */
}
const generatePublisherWelcomeTemplate = (payload) => `<!DOCTYPE html>
<html lang="en" style="background-color:#000000; margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Alif Kids</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .app-badges img {
        width: 120px !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#000000; font-family:Arial, sans-serif; color:#fff; overflow-x:hidden;">
  <center style="width:100%; background-color:#000000; margin:0 auto;">
    <div style="max-width:600px; margin:0 auto; overflow:hidden;">
      <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="margin:0 auto; max-width:600px; width:100%; background-color:#000000; border-collapse:collapse;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:#000000; color:#fff;">

              <!-- Banner Image -->
              <tr>
                <td style="padding:0; line-height:0;">
                  <a href="https://alifkids.app/" target="_blank">
                    <img src="https://media.kidsread.app/email-cover-new111.png" alt="Welcome Banner" style="width:100%; max-width:600px; display:block; height:auto; border:0; vertical-align:bottom; background-color:#000000;">
                  </a>
                </td>
              </tr>

              <!-- Heading -->
              <tr>
                <td style="text-align:center; color:#A94FA4; font-size:28px; font-weight:bold; padding-top:20px; padding-bottom:10px;">
                  WELCOME TO ALIF KIDS!
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:20px; font-size:16px; line-height:1.6; color:#fff;">
                  <p style="margin:0 0 10px 0;"><strong>Hi ${payload?.name || 'User'},</strong></p>
                  <p style="margin:0 0 10px 0;">Welcome to the Alif Kids family! We’re thrilled to have you on board as a creator dedicated to empowering and inspiring young readers.</p>
                  <p style="margin:0;">Your account has been successfully created. You can now start uploading your books, setting your prices, and reaching a global audience of curious and bright minds.</p>
                </td>
              </tr>

              <!-- Button -->
              <tr>
                <td align="center" style="padding:20px;">
                  <a href="https://publish.alifkids.app/add-book" target="_blank" style="background-color:#00c6ff; padding:12px 60px; border-radius:30px; color:#fff; text-decoration:none; font-size:16px; font-weight:bold; display:inline-block;">Upload Book</a>
                </td>
              </tr>

              <!-- Help Message -->
              <tr>
                <td style="padding:20px; font-size:16px; line-height:1.6; text-align:center; color:#fff;">
                  <p style="margin:0 0 10px 0;">Need help? Our support team is always here for you.</p>
                  <p style="margin:0;">Let’s make storytelling magical again.</p>
                </td>
              </tr>

              <!-- Sign-off -->
              <tr>
                <td style="padding:20px; font-size:16px; line-height:1.6; text-align:left; color:#fff;">
                  Warm regards,<br>
                  <strong>The Alif Kids Team</strong>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="color:#fff; font-size:14px; padding:20px;">
                  <p style="margin:0 0 10px 0;"><strong>AVAILABLE ON</strong></p>
                  <table class="app-badges" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto; max-width:280px; width:100%;">
                    <tr>
                      <td align="center" style="padding:0 5px;">
                        <a href="https://play.google.com/store/apps/details?id=com.sidrproductions.alifkids&pcampaignid=web_share" target="_blank">
                          <img src="https://media.kidsread.app/Playstore.png" alt="Google Play Store" style="width:140px; max-width:100%; display:block; border:0;">
                        </a>
                      </td>
                      <td align="center" style="padding:0 5px;">
                        <a href="https://apps.apple.com/us/app/alif-kids/id6744365674" target="_blank">
                          <img src="https://media.kidsread.app/App%20Store.png" alt="App Store" style="width:140px; max-width:100%; display:block; border:0;">
                        </a>
                      </td>
                    </tr>
                  </table>
                 
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>
`
{
  /* <p>No longer want to receive these emails? <a href="#">Unsubscribe</a></p> */
}
const generateDefaultURLTemplate = (payload) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Invitation</title>
</head>
<body>
  <h1>Welcome! You've been invited as an Admin</h1>
  <p>Hello ${payload?.name},</p>
  <p>otp ${payload?.otp},</p>

  <p>We are excited to have you join us. Click the button below to set up your password and access the admin dashboard:</p>
  <p>
    <a href="${payload?.otp}" style="padding: 10px 15px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px;">
      Set Up Password
    </a>
  </p>
  <p>If you didn’t expect this invitation, feel free to ignore this email.</p>
  <p>Regards,</p>
  <p><strong>My School Journey Team</strong></p>
</body>
</html>`

const generateResetPasswordTemplate = (payload) => `<!DOCTYPE html>
<html lang="en" style="background-color:#000000; margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Alif Kids OTP</title>
  <style>
    @media only screen and (max-width: 600px) {
      .app-badges img {
        width: 120px !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#000000; font-family:Arial, sans-serif; color:#fff;">
  <center style="width:100%; background-color:#000000;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000000; border-collapse:collapse; margin:0; padding:0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#000000; color:#fff;">

            <!-- Banner -->
            <tr>
              <td style="padding:0; line-height:0; font-size:0;">
                <a href="https://alifkids.app/" target="_blank">
                  <img src="https://media.kidsread.app/email-cover-new111.png" alt="Alif Kids Banner" style="display:block; width:100%; max-width:600px; height:auto; border:0; vertical-align:bottom; background-color:#000000;">
                </a>
              </td>
            </tr>
                   <!-- Heading -->
        <tr>
          <td style="text-align:center; color:#A94FA4; font-size:26px; font-weight:bold; padding-top:20px; padding-bottom:10px;">
            Password Reset Request
          </td>
        </tr>

        <!-- Intro Content -->
               <tr>
          <td style="padding:20px; font-size:16px; line-height:1.6; color:#000000;">
            <p style="margin:0 0 10px 0; color:#000000;"><strong>Hi [Name],</strong></p>
            <p style="margin:0 0 10px 0; color:#000000;">We received a request to reset your Alif Kids password.</p>
            <p style="margin:0; color:#000000;">Your OTP to reset the password is:</p>
          </td>
        </tr>

            <!-- OTP -->
          <tr>
              <td align="center" style="background-color:#f7f7f7; color:#e96249; font-size:22px; font-weight:bold; padding:20px; border-radius:12px; letter-spacing:4px;">
            ${payload?.otp}
              </td>
            </tr>

            <!-- If not requested message -->
        <tr>
          <td style="padding:20px; font-size:16px; line-height:1.6;">
            <p style="margin:0;">If you didn’t request this, please ignore this email or <a href="mailto:support@alifkids.app" style="color:#00c6ff; text-decoration:none;">contact us</a> immediately.</p>
          </td>
        </tr>

        <!-- Sign-off -->
        <tr>
          <td style="padding:20px; font-size:16px; line-height:1.6;">
            Stay creative,<br />
            <strong>Alif Kids Support</strong>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="font-size:14px; padding:20px; color:#fff;">
            <p style="margin:0 0 10px 0;"><strong>AVAILABLE ON</strong></p>
            <table align="center" class="app-badges" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto; max-width:280px; width:100%;">
              <tr>
                <td style="padding:0 5px;">
                  <a href="https://play.google.com/store/apps/details?id=com.sidrproductions.alifkids&pcampaignid=web_share" target="_blank">
                    <img src="https://media.kidsread.app/Playstore.png" alt="Google Play Store" style="width:140px; max-width:100%; display:block; border:0;">
                  </a>
                </td>
                <td style="padding:0 5px;">
                  <a href="https://apps.apple.com/us/app/alif-kids/id6744365674" target="_blank">
                    <img src="https://media.kidsread.app/App%20Store.png" alt="App Store" style="width:140px; max-width:100%; display:block; border:0;">
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin-top:15px;"><a href="#" style="color:#00c6ff; text-decoration:none;">Unsubscribe</a></p>
          </td>
        </tr>

      </table>
    </div>
  </center>
</body>
</html>`
const generateResetPasswordTemplateNew = (payload) => `
<!DOCTYPE html>
<html lang="en" style="background-color:#ffffff; margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset - Alif Kids</title>
  <style>
    @media only screen and (max-width: 600px) {
      .app-badges img {
        width: 120px !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, sans-serif; color:#000000;">
  <center style="width:100%; background-color:#ffffff;">
    <div style="max-width:600px; margin:0 auto;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; color:#000000;">

        <!-- Banner -->
        <tr>
          <td style="padding:0; line-height:0;">
            <a href="https://alifkids.app/" target="_blank">
              <img src="https://res.cloudinary.com/dayfv4et9/image/upload/v1757052722/Email_Template.png" alt="Alif Kids Banner" style="width:100%; max-width:600px; display:block; border:0; background-color:#ffffff;">
            </a>
          </td>
        </tr>

        <!-- Heading -->
        <tr>
          <td style="text-align:center; color:#e96249; font-size:26px; font-weight:bold; padding-top:20px; padding-bottom:10px;">
            Password Reset Request
          </td>
        </tr>

        <!-- Intro Content -->
        <tr>
          <td style="padding:20px; font-size:16px; line-height:1.6; color:#000000;">
            <p style="margin:0 0 10px 0; color:#000000;"><strong>Hi ${payload?.name || 'User'},</strong></p>
            <p style="margin:0 0 10px 0; color:#000000;">We received a request to reset your Alif Kids password.</p>
            <p style="margin:0; color:#000000;">Click the button below to set a new password:</p>
          </td>
        </tr>

        <!-- Reset Button -->
        <tr>
          <td align="center" style="padding:30px 0;">
            ${payload?.otp}
          </td>
        </tr>

        <!-- If not requested message -->
        <tr>
          <td style="padding:20px; font-size:16px; line-height:1.6; color:#000000;">
            <p style="margin:0; color:#000000;">If you didn’t request this, please ignore this email or <a href="mailto:support@alifkids.app" style="color:#e96249; text-decoration:none;">contact us</a> immediately.</p>
          </td>
        </tr>

        <!-- Sign-off -->
        <tr>
          <td style="padding:20px; font-size:16px; line-height:1.6; color:#000000;">
            Stay creative,<br />
            <strong>Alif Kids Support</strong>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="font-size:14px; padding:20px; color:#000000;">
            <p style="margin:0 0 10px 0;"><strong>AVAILABLE ON</strong></p>
            <table align="center" class="app-badges" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto; max-width:280px; width:100%;">
              <tr>
                <td style="padding:0 5px;">
                  <a href="https://play.google.com/store/apps/details?id=com.sidrproductions.alifkids&pcampaignid=web_share" target="_blank">
                    <img src="https://media.kidsread.app/Playstore.png" alt="Google Play Store" style="width:140px; max-width:100%; display:block; border:0;">
                  </a>
                </td>
                <td style="padding:0 5px;">
                  <a href="https://apps.apple.com/us/app/alif-kids/id6744365674" target="_blank">
                    <img src="https://media.kidsread.app/App%20Store.png" alt="App Store" style="width:140px; max-width:100%; display:block; border:0;">
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin-top:15px;"><a href="#" style="color:#e96249; text-decoration:none;">Unsubscribe</a></p>
          </td>
        </tr>

      </table>
    </div>
  </center>
</body>
</html>
`

const generateNewUserEmail = (type, payload) => `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
<table align="center" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #dddddd; background-color: #ffffff;">
    <tr>
        <td align="center" style="padding: 20px 0; background-color: #007BFF; color: #ffffff; font-size: 24px;">
            Alif Kids - New ${type?.toUpperCase()} Registration
        </td>
    </tr>
    <tr>
        <td style="padding: 20px;">
            <p>Hello,</p>
            <p>You have a new user registered on your app <strong>Alif Kids</strong> website. Here are the details:</p>
            <table cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <tr>
                    <td width="30%" style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Name:</strong></td>
                    <td style="border: 1px solid #dddddd;">${payload?.name}</td>
                </tr>
                <tr>
                    <td width="30%" style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>User Type:</strong></td>
                    <td style="border: 1px solid #dddddd;">${payload?.userType}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
                    <td style="border: 1px solid #dddddd;">${payload?.email}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Country:</strong></td>
                    <td style="border: 1px solid #dddddd;">${payload?.country || payload?.countryId?.name}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Device:</strong></td>
                    <td style="border: 1px solid #dddddd;">${payload?.deviceType}</td>
                </tr>
            </table>
            <p style="margin-top: 20px;">Thank you,</p>
            <p>The Alif Kids Team</p>
        </td>
    </tr>
    <tr>
        <td align="center" style="padding: 10px; background-color: #f4f4f4; color: #555555; font-size: 12px;">
            &copy; 2024 Alif Kids. All rights reserved.
        </td>
    </tr>
</table>
</body>`

 const generateBookPreviewTemplate = (type, payload) => `
<!DOCTYPE html>
<html lang="en" style="background-color:#000000; margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Book is Ready for Preview</title>
  <style>
    @media only screen and (max-width: 600px) {
      .app-badges img {
        width: 120px !important;
        height: auto !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#000000; font-family:Arial, sans-serif; color:#fff;">
  <center style="width:100%; background-color:#000000;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000000; border-collapse:collapse; margin:0; padding:0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#000000; color:#fff;">

            <!-- Banner -->
            <tr>
              <td style="padding:0; line-height:0; font-size:0;">
                <a href="https://publish.alifkids.app/" target="_blank">
                  <img src="https://media.kidsread.app/email-cover-new111.png" alt="Book Preview Banner" style="display:block; width:100%; max-width:600px; height:auto; border:0; vertical-align:bottom; background-color:#000000;">
                </a>
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td style="text-align:center; color:#A94FA4; font-size:28px; font-weight:bold; padding-top:20px; padding-bottom:10px;">
                YOUR BOOK IS READY TO PREVIEW!
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.6; color:#fff;">
                <p style="margin:0 0 10px 0;"><strong>Dear ${payload?.publisherName || "Publisher"},</strong></p>
                <p style="margin:0;">Great news! Your book <strong>${payload?.bookTitle || "Book"}</strong> is now ready for preview.</p>
                <p style="margin:10px 0;">Please visit the <strong>Publisher Portal</strong> to review and finalize your book before publishing.</p>
              </td>
            </tr>

            <!-- Preview Button -->
            <tr>
              <td align="center" style="padding: 20px;">
                <a href="https://publisher.kidsread.app/" target="_blank" style="background-color:#00c6ff; padding:12px 60px; border-radius:30px; color:#fff; text-decoration:none; font-size:16px; font-weight:bold; display:inline-block;">Preview Book</a>
              </td>
            </tr>

            <!-- Sign-off -->
            <tr>
              <td style="padding: 20px; font-size:16px; line-height:1.6; color:#fff; text-align:left;">
                Thank you for contributing to Kids Read!<br />
                <strong>The Kids Read Team</strong>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="color:#fff; font-size:14px; padding:20px;">
                <p style="margin:0 0 10px 0;"><strong>AVAILABLE ON</strong></p>
                <table align="center" class="app-badges" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto; max-width:280px; width:100%;">
                  <tr>
                    <td align="center" style="padding:0 5px;">
                      <a href="https://play.google.com/store/apps/details?id=com.sidrproductions.alifkids&pcampaignid=web_share" target="_blank">
                        <img src="https://media.kidsread.app/Playstore.png" alt="Google Play Store" style="width:140px; max-width:100%; display:block; border:0;">
                      </a>
                    </td>
                    <td align="center" style="padding:0 5px;">
                      <a href="https://apps.apple.com/us/app/alif-kids/id6744365674" target="_blank">
                        <img src="https://media.kidsread.app/App%20Store.png" alt="App Store" style="width:140px; max-width:100%; display:block; border:0;">
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`

export interface EmailTemplates {
  otp: (name: string, otpCode: string) => string;
  forgot: (name: string, otpCode: string) => string;
  reset: (name: string, otpCode: string) => string;
  confirm: (name: string) => string;
  contact: (name: string, email: string, message: string) => string;
  contactReply: (name: string, reply: string) => string;
  newUser: (user: any) => string;
  newSubscription: (user: any) => string;
}

const emailTemplates: EmailTemplates = {
  otp: (name: string, otpCode: string) => {
    return `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
              <td align="center">
                  <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; padding: 20px;">
                      <tr>
                          <td align="center" style="padding-bottom: 20px;">
                              <!-- Logo Image -->
                              <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/iseojhst6iyxlqwrr0bt.png" alt="ANF App" style="display: block; width: 200px;">
                          </td>
                      </tr>
                      <tr>
                          <td align="left" style="padding: 0 20px;">
                              <p style="font-size: 18px; color: #333333; line-height: 1.5;"><strong>Dear ${name},</strong></p>
                              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                  Thank you for signing up at <strong>ANF App</strong>! To complete your registration and gain access to your account, please use the following One-Time Password (OTP):
                              </p>
                              <p style="font-size: 24px; color: #ffffff; background-color: #7E2275; padding: 10px 20px; text-align: center; letter-spacing: 3px;">
                                  ${otpCode}
                              </p>
                              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                  Once you've entered the OTP, your account will be verified, and you'll be able to explore our platform and its features. If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@anfapp.app" style="color: #5C6BC0; text-decoration: none;">support@anfapp.app</a>.
                              </p>
                              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                  Thank you for choosing ANF App.
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
                              <a href="https://www.facebook.com/anfapp"><img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/yhx0xspcil9ocz79eohg.png"/></a>
                              <a href="https://www.instagram.com/anfapp"><img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/boscvi6ay07jskjd0ge5.png"/></a>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
                              <!-- Footer -->
                              <p style="font-size: 14px; color: #999999; line-height: 1.5;">
                                  Dubai, United Arab Emirates<br>
                                  <a href="mailto:hello@anfapp.app" style="color: #7E2275; text-decoration: none;">hello@anfapp.app</a>
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding: 10px;">
                              <!-- Landscape Image -->
                              <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/gmrs9x7ahbklncjbx1e3.png" alt="Landscape Image" style="display: block; width: 100%; max-width: 600px;">
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>`;
  },

  forgot: (name: string, otpCode: string) => {
    return `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
              <td align="center">
                  <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; padding: 20px;">
                      <tr>
                          <td align="center" style="padding-bottom: 20px;">
                              <!-- Logo Image -->
                              <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/iseojhst6iyxlqwrr0bt.png" alt="ANF App" style="display: block; width: 200px;">
                          </td>
                      </tr>
                      <tr>
                          <td align="left" style="padding: 0 20px;">
                              <p style="font-size: 18px; color: #333333; line-height: 1.5;"><strong>Dear ${name},</strong></p>
                              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                  Your request at <strong>ANF App</strong> for forgot password has been accepted, please use the following One-Time Password (OTP):
                              </p>
                              <p style="font-size: 24px; color: #ffffff; background-color: #7E2275; padding: 10px 20px; text-align: center; letter-spacing: 3px;">
                                  ${otpCode}
                              </p>
                              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                  Once you've entered the OTP, you will be able to change your password. If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@anfapp.app" style="color: #5C6BC0; text-decoration: none;">support@anfapp.app</a>.
                              </p>
                              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                  Thank you for choosing ANF App.
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
                              <a href="https://www.facebook.com/anfapp"><img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/yhx0xspcil9ocz79eohg.png"/></a>
                              <a href="https://www.instagram.com/anfapp"><img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/boscvi6ay07jskjd0ge5.png"/></a>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
                              <!-- Footer -->
                              <p style="font-size: 14px; color: #999999; line-height: 1.5;">
                                  Dubai, United Arab Emirates<br>
                                  <a href="mailto:hello@anfapp.app" style="color: #7E2275; text-decoration: none;">hello@anfapp.app</a>
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding: 10px;">
                              <!-- Landscape Image -->
                              <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/gmrs9x7ahbklncjbx1e3.png" alt="Landscape Image" style="display: block; width: 100%; max-width: 600px;">
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>`;
  },

  reset: (name: string, otpCode: string) => {
    return `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
              <td align="center">
                  <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; padding: 20px;">
                      <tr>
                          <td align="center" style="padding-bottom: 20px;">
                              <!-- Logo Image -->
                              <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/iseojhst6iyxlqwrr0bt.png" alt="ANF App" style="display: block; width: 200px;">
                          </td>
                      </tr>
                      <tr>
                          <td align="left" style="padding: 0 20px;">
                              <p style="font-size: 18px; color: #333333; line-height: 1.5;"><strong>Dear ${name},</strong></p>
                              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                  Your request at <strong>ANF App</strong> for reset password has been accepted, please use the following One-Time Password (OTP):
                              </p>
                              <p style="font-size: 24px; color: #ffffff; background-color: #7E2275; padding: 10px 20px; text-align: center; letter-spacing: 3px;">
                                  ${otpCode}
                              </p>
                              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                  Once you've entered the OTP, you will be able to change your password. If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@anfapp.app" style="color: #5C6BC0; text-decoration: none;">support@anfapp.app</a>.
                              </p>
                              <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                                  Thank you for choosing ANF App.
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
                              <a href="https://www.facebook.com/anfapp"><img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/yhx0xspcil9ocz79eohg.png"/></a>
                              <a href="https://www.instagram.com/anfapp"><img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/boscvi6ay07jskjd0ge5.png"/></a>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
                              <!-- Footer -->
                              <p style="font-size: 14px; color: #999999; line-height: 1.5;">
                                  Dubai, United Arab Emirates<br>
                                  <a href="mailto:hello@anfapp.app" style="color: #7E2275; text-decoration: none;">hello@anfapp.app</a>
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding: 10px;">
                              <!-- Landscape Image -->
                              <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/gmrs9x7ahbklncjbx1e3.png" alt="Landscape Image" style="display: block; width: 100%; max-width: 600px;">
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>`;
  },

  confirm: (name: string) => {
    return `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
          <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="600"
                  style="background-color: #ffffff; padding: 20px;">
                  <tr>
                      <td align="center" style="padding-bottom: 20px;">
                          <!-- Logo Image -->
                          <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/iseojhst6iyxlqwrr0bt.png"
                              alt="ANF App" style="display: block; width: 200px;">
                      </td>
                  </tr>
                  <tr>
                      <td align="left" style="padding: 0 20px;">
                          <p style="font-size: 20px; font-weight: bold; color: #333333; line-height: 1.2;">
                              <strong>Dear ${name},</strong></p>
                          <p style="font-size: 18px; font-weight: bold; color: #333333; line-height: 1.5;">
                              Congratulations!</p>
                          <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                              Your account at <strong>ANF App</strong> has been successfully verified, and
                              you are now officially part of our community. We're excited to have you on board!
                          </p>
                          <p style="font-size: 16px; font-weight: bold; color: #7E2275; line-height: 1.5;">
                              Here are a few next steps to get started:
                          </p>
                          <ul
                              style="font-size: 16px; list-style-type: none; color: #333333; line-height: 1.5; padding-left: 20px;">
                              <li style="margin-bottom: 10px;">
                                  <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/cahnmr5gcgddmsospusi.png"
                                      alt="Check Icon"
                                      style="vertical-align: middle; width: 20px; height: 20px; margin-right: 10px;">
                                  Log in to your account
                              </li>
                              <li style="margin-bottom: 10px;">
                                  <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/cahnmr5gcgddmsospusi.png"
                                      alt="Check Icon"
                                      style="vertical-align: middle; width: 20px; height: 20px; margin-right: 10px;">
                                  Explore the platform and update your profile with relevant information.
                              </li>
                              <li style="margin-bottom: 10px;">
                                  <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/cahnmr5gcgddmsospusi.png"
                                      alt="Check Icon"
                                      style="vertical-align: middle; width: 20px; height: 20px; margin-right: 10px;">
                                  Follow and stay connected with us on social media channels for updates and
                                  announcements.
                              </li>
                          </ul>
                          <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                              If you have any questions or need assistance at any point, our support team is here to
                              help. Feel free to reach out to us at <a href="mailto:support@anfapp.app"
                                  style="color: #5C6BC0; text-decoration: none;">support@anfapp.app</a>.
                          </p>
                          <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                              Once again, welcome to ANF App! We're looking forward to seeing you
                              thrive in our community.
                          </p>
                      </td>
                  </tr>
                  <tr>
                      <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
                          <a href="https://www.facebook.com/anfapp"><img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/yhx0xspcil9ocz79eohg.png"/></a>
                          <a href="https://www.instagram.com/anfapp"><img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/boscvi6ay07jskjd0ge5.png"/></a>
                      </td>
                  </tr>
                  <tr>
                      <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
                          <!-- Footer -->
                          <p style="font-size: 14px; color: #999999; line-height: 1.5;">
                              Dubai, United Arab Emirates<br>
                              <a href="mailto:hello@anfapp.app"
                                  style="color: #7E2275; text-decoration: none;">hello@anfapp.app</a>
                          </p>
                      </td>
                  </tr>
                  <tr>
                      <td align="center" style="padding: 10px;">
                          <!-- Landscape Image -->
                          <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/gmrs9x7ahbklncjbx1e3.png" alt="Landscape Image"
                              style="display: block; width: 100%; max-width: 600px;">
                      </td>
                  </tr>
              </table>
          </td>
      </tr>
  </table>
  </body>`;
  },

  contact: (name: string, email: string, message: string) => {
    return `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
<table align="center" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #dddddd; background-color: #ffffff;">
    <tr>
        <td align="center" style="padding: 20px 0; background-color: #007BFF; color: #ffffff; font-size: 24px;">
            ANF App - Contact Us
        </td>
    </tr>
    <tr>
        <td style="padding: 20px;">
            <p>Hello,</p>
            <p>You have received a new message through the contact form on the <strong>ANF App</strong> website. Here are the details:</p>
            <table cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <tr>
                    <td width="30%" style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Name:</strong></td>
                    <td style="border: 1px solid #dddddd;">${name}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
                    <td style="border: 1px solid #dddddd;">${email}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Message:</strong></td>
                    <td style="border: 1px solid #dddddd;">${message}</td>
                </tr>
            </table>
            <p style="margin-top: 20px;">Thank you,</p>
            <p>The ANF App Team</p>
        </td>
    </tr>
    <tr>
        <td align="center" style="padding: 10px; background-color: #f4f4f4; color: #555555; font-size: 12px;">
            &copy; 2024 ANF App. All rights reserved.
        </td>
    </tr>
</table>
</body>`;
  },

  contactReply: (name: string, reply: string) => {
    return `
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; padding: 20px;">
                <tr>
                    <td align="center" style="padding-bottom: 20px;">
                        <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/iseojhst6iyxlqwrr0bt.png" alt="ANF App" style="display: block; width: 200px;">
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding: 0 20px;">
                        <p style="font-size: 18px; color: #333333; line-height: 1.5;"><strong>Dear ${name},</strong></p>
                        <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                            Thank you for reaching out to us at <strong>ANF App</strong>. We appreciate you taking the time to contact us, and we wanted to respond to your message.
                        </p>
                        <p style="font-size: 16px; color: #ffffff; background-color: #7E2275; padding: 10px 10px;  letter-spacing: 1px;">
                             ${reply}
                        </p>
                        <p style="font-size: 16px; color: #333333; line-height: 1.5;">
                             If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@anfapp.app" style="color: #5C6BC0; text-decoration: none;">support@anfapp.app</a>.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding-top: 20px; padding-bottom: 20px;">
                        <!-- Footer -->
                        <p style="font-size: 14px; color: #999999; line-height: 1.5;">
                            Dubai, United Arab Emirates<br>
                            <a href="mailto:hello@anfapp.app" style="color: #7E2275; text-decoration: none;">hello@anfapp.app</a>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 10px;">
                        <!-- Landscape Image -->
                        <img src="https://res.cloudinary.com/da0if9ftl/image/upload/v1724592210/icons/gmrs9x7ahbklncjbx1e3.png" alt="Landscape Image" style="display: block; width: 100%; max-width: 600px;">
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>`;
  },

  newUser: (user: any) => {
    return `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
<table align="center" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #dddddd; background-color: #ffffff;">
    <tr>
        <td align="center" style="padding: 20px 0; background-color: #007BFF; color: #ffffff; font-size: 24px;">
            New User Registration on ANF App
        </td>
    </tr>
    <tr>
        <td style="padding: 20px;">
            <p>Hello,</p>
            <p>You have a new user registered on your app <strong>ANF App</strong> website. Here are the details:</p>
            <table cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <tr>
                    <td width="30%" style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Name:</strong></td>
                    <td style="border: 1px solid #dddddd;">${user?.name}</td>
                </tr>
                <tr>
                    <td width="30%" style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Parent Name:</strong></td>
                    <td style="border: 1px solid #dddddd;">${user?.parentName}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
                    <td style="border: 1px solid #dddddd;">${user?.email}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Country:</strong></td>
                    <td style="border: 1px solid #dddddd;">${user?.country}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Device:</strong></td>
                    <td style="border: 1px solid #dddddd;">${user?.device}</td>
                </tr>
            </table>
            <p style="margin-top: 20px;">Thank you,</p>
            <p>The ANF App Team</p>
        </td>
    </tr>
    <tr>
        <td align="center" style="padding: 10px; background-color: #f4f4f4; color: #555555; font-size: 12px;">
            &copy; 2024 ANF App. All rights reserved.
        </td>
    </tr>
</table>
</body>`;
  },

  newSubscription: (user: any) => {
    return `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
<table align="center" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #dddddd; background-color: #ffffff;">
    <tr>
        <td align="center" style="padding: 20px 0; background-color: #007BFF; color: #ffffff; font-size: 24px;">
               New User Registration on ANF App
        </td>
    </tr>
    <tr>
        <td style="padding: 20px;">
            <p>Hello,</p>
            <p>You have a new user registered on your app <strong>ANF App</strong> website. Here are the details:</p>
            <table cellpadding="5" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <tr>
                    <td width="30%" style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Name:</strong></td>
                    <td style="border: 1px solid #dddddd;">${user?.name}</td>
                </tr>
                <tr>
                    <td width="30%" style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Parent Name:</strong></td>
                    <td style="border: 1px solid #dddddd;">${user?.parentName}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
                    <td style="border: 1px solid #dddddd;">${user?.email}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Country:</strong></td>
                    <td style="border: 1px solid #dddddd;">${user?.country}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #dddddd; background-color: #f9f9f9;"><strong>Device:</strong></td>
                    <td style="border: 1px solid #dddddd;">${user?.device}</td>
                </tr>
            </table>
            <p style="margin-top: 20px;">Thank you,</p>
            <p>The ANF App Team</p>
        </td>
    </tr>
    <tr>
        <td align="center" style="padding: 10px; background-color: #f4f4f4; color: #555555; font-size: 12px;">
            &copy; 2024 ANF App. All rights reserved.
        </td>
    </tr>
</table>
</body>`;
  },
};

export default emailTemplates;

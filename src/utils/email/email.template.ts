interface UserCredentialsEmailData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const userCredentialsEmailTemplate = ({
  name,
  email,
  password,
  role,
}: UserCredentialsEmailData) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <title>SAS DoorBD Account</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 30px;
          }

          .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
          }

          .title {
            font-size: 24px;
            font-weight: bold;
          }

          .credentials {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
          }

          .warning {
            margin-top: 20px;
            color: #d97706;
          }
        </style>
      </head>

      <body>
        <div class="container">

          <div class="title">
            Welcome to SAS DoorBD
          </div>

          <p>Hello ${name},</p>

          <p>
            Your account has been created by an administrator.
          </p>

          <div class="credentials">

            <p>
              <strong>Email:</strong>
              ${email}
            </p>

            <p>
              <strong>Temporary Password:</strong>
              ${password}
            </p>

            <p>
              <strong>Role:</strong>
              ${role}
            </p>

          </div>

          <p class="warning">
            Please change your password after your first login.
          </p>

          <p>
            Regards,<br />
            SAS DoorBD Team
          </p>

        </div>
      </body>
    </html>
  `;
};
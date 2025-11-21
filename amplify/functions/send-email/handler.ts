import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { Schema } from '../../data/resource';

const sesClient = new SESClient({});

export const handler: Schema['sendContactEmail']['functionHandler'] = async (event) => {
  try {
    const { companyName, contactName, phoneNumber, services, message } = event.arguments;

    const servicesList = services && services.length > 0
      ? services.filter((s): s is string => s !== null).map((s) => `- ${s}`).join('\n')
      : '- Not specified';

    const emailBody = `Hello,

A new information request has been submitted:

Services of Interest:
${servicesList}

Company Name: ${companyName || 'Not provided'}
Contact Name: ${contactName || 'Not provided'}
Phone Number: ${phoneNumber || 'Not provided'}

Additional Message:
${message || 'None'}

Thank you!`;

    const command = new SendEmailCommand({
      Source: 'sciotobussys@gmail.com', // Must be verified in SES
      Destination: {
        ToAddresses: ['sciotobussys@gmail.com'],
      },
      Message: {
        Subject: {
          Data: 'Information Request from SBSys Website',
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: emailBody,
            Charset: 'UTF-8',
          },
        },
      },
    });

    await sesClient.send(command);

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

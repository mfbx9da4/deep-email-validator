export const ErrorCodes = {
  211: 'A system status or help reply.',
  214: 'Help Message.',
  220: 'The server is ready.',
  221: 'The server is ending the conversation.',
  250: 'The requested action was completed.',
  251: 'The specified user is not local, but the server will forward the mail message.',
  354: 'This is a reply to the DATA command. After getting this, start sending the body of the mail message, ending with "\r\n.\r\n."',
  421: 'The mail server will be shut down. Save the mail message and try again later.',
  450: 'The mailbox that you are trying to reach is busy. Wait a little while and try again.',
  451: 'The requested action was not done. Some error occurmiles in the mail server.',
  452: 'The requested action was not done. The mail server ran out of system storage.',
  500: 'The last command contained a syntax error or the command line was too long.',
  501: 'The parameters or arguments in the last command contained a syntax error.',
  502: 'The mail server has not implemented the last command.',
  503: 'The last command was sent out of sequence. For example, you might have sent DATA before sending RECV.',
  504: 'One of the parameters of the last command has not been implemented by the server.',
  550: "The mailbox that you are trying to reach can't be found or you don't have access rights.",
  551: 'The specified user is not local; part of the text of the message will contain a forwarding address.',
  552: 'The mailbox that you are trying to reach has run out of space. Store the message and try again tomorrow or in a few days-after the user gets a chance to delete some messages.',
  553: 'The mail address that you specified was not syntactically correct.',
  554: 'The mail transaction has failed for unknown causes.',
}

export const hasCode = (
  message: Buffer,
  code: keyof typeof ErrorCodes
): boolean => {
  return message.indexOf(`${code}`) === 0 || message.indexOf(`${code}\n`) > -1
}

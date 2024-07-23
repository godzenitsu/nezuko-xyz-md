import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import axios from 'axios'; // Import axios for HTTP requests

const handleRepoCommand = async (m, Matrix) => {
  const repoUrl = 'https://api.github.com/repos/godzenitsu/Nezuko';
  try {
    const response = await axios.get(repoUrl);
    const repoData = response.data;

    const { full_name, name, forks_count, stargazers_count, created_at, updated_at, owner } = repoData;

    const messageText = `📊 Repository Information:
    \n⎊ *Name:* ${name}
    \n⎊ *Stars:* ${stargazers_count}
    \n⎊ *Forks:* ${forks_count}
    \n⎊ *Created At:* ${new Date(created_at).toLocaleDateString()}
    \n⎊ *Last Updated:* ${new Date(updated_at).toLocaleDateString()}
    \n⎊ *Owner:* ${owner.login}`;

    const repoMessage = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: messageText
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "© Powered By Nezuko"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
             ...(await prepareWAMessageMedia({ image: { url: `https://telegra.ph/file/76db12f1a28abf0953e4f.jpg` } }, { upload: Matrix.waUploadToServer })),
              title: "",
              gifPlayback: true,
              subtitle: "",
              hasMediaAttachment: false 
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "Contact Owner",
                    id: ".owner"
                  })
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "Click Here To Fork",
                    url: `https://github.com/godzenitsu/Nezuko/fork`
                  })
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "Join Our Community",
                    url: `https://whatsapp.com/channel/0029VajGivBJ93wYPGJjHt2U`
                  })
                }
              ],
            }),
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 9999,
              isForwarded: true,
            }
          }),
        },
      },
    }, {});

    await Matrix.relayMessage(repoMessage.key.remoteJid, repoMessage.message, {
      messageId: repoMessage.key.id
    });
    await m.React("✅");

  } catch (error) {
    console.error("Error processing your request:", error);
    m.reply('Error processing your request.');
    await m.React("❌");
  }
};

const searchRepo = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const validCommands = ['repo', 'sc', 'script'];

  if (validCommands.includes(cmd)) {
    await handleRepoCommand(m, Matrix);
  }
};

export default searchRepo;

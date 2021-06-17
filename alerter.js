import slack from '@slack/web-api'


const slackClient = new slack.WebClient('YOUR-SLACK-KEY-HERE');

export default async (message) => {
  try {
    await slackClient.chat.postMessage({
      channel: '#your-channel',
      text: message,
    });
  } catch (error) {
    console.log(error)
  }
}

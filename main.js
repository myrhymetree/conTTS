import { config } from 'dotenv';
import { request } from 'axios';

config();
const API_KEY = process.env.API_KEY;

let inputText = `“네빌......대체.....어떻게.........?”
하지만 네빌은 론과 헤르미온느를 보자마자, 곧장 기쁨의 함성을 내지르며 그들을 와락 껴안았다. 보면 볼수록 네빌의 꼴은 말이 아니었다. 한쪽 눈은 노랗고 푸르스름하게 멍이 든 채 잔뜩 부었고, 얼굴에는 여기저기 파인 자국이 나 있었다. 전체적으로 너저분하기 짝이 없는 몰골은 그가 얼마나 힘들게 지내 왔는지를 보여 주었다. 그럼에도 불구하고, 잔뜩 얻어터진 그의 얼굴은 행복으로 빛이 났다. 네빌은 헤르미온느를 안고 있던 팔을 풀고서 입을 열었다.
“너희가 올 줄 알았어! 단지 시간문제일 뿐이라고 시무스에게 줄곧 얘기했지!”
“네빌, 무슨 일이 있었던 거야?”`;

let data = JSON.stringify({
  "actor_id": "622964d6255364be41659078",
  "text": inputText,
  "lang": "auto",
  "tempo": 1,
  "volume": 100,
  "pitch": 0,
  "xapi_hd": true,
  "max_seconds": 60,
  "model_version": "latest",
  "xapi_audio_format": "wav"
});

let postConfig = {
  method: "post",
  url: `https://typecast.ai/api/speak`,
  headers: { 
    "Content-Type": "application/json", 
    "Authorization": `Bearer ${API_KEY}`
  },
  data : data
};

let status;

async function startPolling() {
  try {
    // 처음 요청 보내기
    const response = await request(postConfig);
    console.log('Initial Response:', JSON.stringify(response.data));
    let speakV2Url = response.data.result.speak_v2_url;

    // 폴링 설정
    let getConfig = {
      method: "get",
      url: speakV2Url,
      headers: { 
        "Authorization": `Bearer ${API_KEY}`
      }
    };

    const poll = async () => {
      try {
        const pollResponse = await request(getConfig);
        status = pollResponse.data.result.status;
        console.log('Polling Response:', pollResponse.data.result);

        if (status === 'done') {
          console.log('Audio Download URL:', pollResponse.data.result.audio_download_url);
          clearInterval(pollingInterval); // 폴링 중지
        }
      } catch (error) {
        console.error('Error during polling:', error);
      }
    };

    // 폴링 시작
    const interval = 1000; // 1초마다 요청
    const pollingInterval = setInterval(poll, interval);
  } catch (error) {
    console.error('Error in initial request:', error);
  }
}

// 폴링 시작 함수 호출
startPolling();
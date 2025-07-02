// AI俳句生成服务
// 需要先安装: npm install openai

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || 'sk-0a183ae4cbb1446facfc99e37576886b'
});

// 生成俳句的系统提示词
const HAIKU_SYSTEM_PROMPT = `你是一个专业的俳句创作大师。请根据用户提供的主题，创作一首符合5-7-5音节结构的中文俳句。

要求：
1. 严格遵循5-7-5音节结构（第一句5个音节，第二句7个音节，第三句5个音节）
2. 体现季节感或自然意象
3. 意境优美，富有诗意
4. 语言简洁，意蕴深远
5. 体现禅意和静谧感

请只返回三行俳句，不要添加任何解释或额外内容。
格式示例：
樱花飞舞时
温暖春风轻抚面  
新绿满枝头`;

/**
 * 根据主题生成俳句
 * @param {string} theme - 俳句主题
 * @returns {Promise<string[]>} - 返回包含三行俳句的数组
 */
export async function generateHaiku(theme) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: HAIKU_SYSTEM_PROMPT },
        { role: "user", content: `请以"${theme}"为主题创作一首俳句` }
      ],
      model: "deepseek-chat",
      temperature: 0.8, // 增加创意性
      max_tokens: 100,
    });

    const haikuText = completion.choices[0].message.content.trim();
    
    // 将俳句分割成三行
    const lines = haikuText.split('\n').filter(line => line.trim() !== '');
    
    // 确保有三行，如果不足则使用默认俳句
    if (lines.length >= 3) {
      return [lines[0].trim(), lines[1].trim(), lines[2].trim()];
    } else {
      // 备用俳句
      return ['静夜思绪飞', '月光洒满窗台上', '诗意自心来'];
    }
    
  } catch (error) {
    console.error('AI俳句生成失败:', error);
    
    // 错误时返回主题相关的备用俳句
    const fallbackHaikus = {
      '春天': ['樱花飞舞时', '温暖春风轻抚面', '新绿满枝头'],
      '夏天': ['蝉鸣声阵阵', '绿荫下乘凉避暑', '清风徐徐来'],
      '秋天': ['黄叶满地舞', '秋风萧瑟送归雁', '丰收在田间'],
      '冬天': ['雪花纷纷落', '寒风刺骨人归家', '炉火温暖心'],
      '月亮': ['皎月当空照', '清辉洒向人间路', '思君不见君'],
      '山水': ['青山如黛远', '碧水潺潺绕石流', '鸟啼花香浓'],
      '樱花': ['粉樱满枝头', '花瓣随风轻飘舞', '春意入心扉'],
      '茶': ['一盏清茶香', '静坐品味人生味', '禅心自然来'],
    };
    
    return fallbackHaikus[theme] || fallbackHaikus['默认'] || ['静夜思绪飞', '月光洒满窗台上', '诗意自心来'];
  }
} 
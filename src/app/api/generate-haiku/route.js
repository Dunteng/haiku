import { NextResponse } from 'next/server';

// 兜底俳句数据
const fallbackHaikus = {
  '春天': ['樱花飞舞时', '温暖春风轻抚面', '新绿满枝头'],
  '夏天': ['蝉鸣声阵阵', '绿荫下乘凉避暑', '清风徐徐来'],
  '秋天': ['黄叶满地舞', '秋风萧瑟送归雁', '丰收在田间'],
  '冬天': ['雪花纷纷落', '寒风刺骨人归家', '炉火温暖心'],
  '月亮': ['皎月当空照', '清辉洒向人间路', '思君不见君'],
  '山水': ['青山如黛远', '碧水潺潺绕石流', '鸟啼花香浓'],
  '樱花': ['粉樱满枝头', '花瓣随风轻飘舞', '春意入心扉'],
  '茶': ['一盏清茶香', '静坐品味人生味', '禅心自然来'],
  '爱情': ['相思如潮水', '千里共婵娟月圆', '情深不言语'],
  '友情': ['知己难再得', '酒逢知己千杯少', '友谊永如山'],
  '雨': ['细雨润无声', '青石板上起涟漪', '听雨思故人'],
  '雪': ['雪花纷纷落', '银装素裹天地白', '万籁俱寂静'],
  '风': ['轻风过竹林', '叶影摇曳奏天籁', '心境自悠然'],
  '花': ['百花竞芬芳', '蜂蝶共舞醉春光', '岁月静好时'],
  '默认': ['静夜思绪飞', '月光洒满窗台上', '诗意自心来']
};

// 根据主题获取随机变体俳句
function getRandomHaikuByTheme(theme) {
  const variations = {
    '春天': [
      ['樱花飞舞时', '温暖春风轻抚面', '新绿满枝头'],
      ['柳絮随风舞', '桃花笑春风和煦', '万物复苏时'],
      ['春雨润万物', '嫩芽破土见阳光', '生机盎然景']
    ],
    '夏天': [
      ['蝉鸣声阵阵', '绿荫下乘凉避暑', '清风徐徐来'],
      ['荷花池塘边', '蜻蜓点水起涟漪', '夏日午后闲'],
      ['绿树成荫浓', '知了声声唱夏歌', '暑气渐消散']
    ],
    '秋天': [
      ['黄叶满地舞', '秋风萧瑟送归雁', '丰收在田间'],
      ['枫叶红如火', '秋高气爽雁南飞', '果实挂满枝'],
      ['金桂飘香时', '秋月如钩挂西楼', '思绪满怀秋']
    ],
    '冬天': [
      ['雪花纷纷落', '寒风刺骨人归家', '炉火温暖心'],
      ['梅花傲雪开', '寒冬腊月展风采', '坚韧品格高'],
      ['雪覆千山白', '寒梅独自斗严寒', '冬日有暖阳']
    ]
  };
  
  const themeVariations = variations[theme];
  if (themeVariations) {
    const randomIndex = Math.floor(Math.random() * themeVariations.length);
    return themeVariations[randomIndex];
  }
  
  return fallbackHaikus[theme] || fallbackHaikus['默认'];
}

// AI服务状态
let openai = null;
let HAIKU_SYSTEM_PROMPT = '';

// 生成俳句的系统提示词
HAIKU_SYSTEM_PROMPT = `你是一个专业的俳句创作大师。请根据用户提供的主题，创作一首符合5-7-5音节结构的中文俳句。

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



export async function POST(request) {
  try {
    const { theme } = await request.json();
    
    if (!theme) {
      return NextResponse.json({ error: '请提供俳句主题' }, { status: 400 });
    }

    // 尝试使用AI生成俳句
    try {
      // 如果openai未初始化，尝试动态导入
      if (!openai) {
        console.log('🔄 尝试初始化AI服务...');
        const { default: OpenAI } = await import("openai");
        
        openai = new OpenAI({
          baseURL: 'https://api.deepseek.com',
          apiKey: 'sk-0a183ae4cbb1446facfc99e37576886b'
        });
        console.log('✅ AI服务动态初始化成功');
      }
      
      console.log(`🤖 使用AI生成俳句，主题: ${theme}`);
      
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: HAIKU_SYSTEM_PROMPT },
          { role: "user", content: `请以"${theme}"为主题创作一首俳句` }
        ],
        model: "deepseek-chat",
        temperature: 0.8,
        max_tokens: 100,
      });

      const haikuText = completion.choices[0].message.content.trim();
      
      // 将俳句分割成三行
      const lines = haikuText.split('\n').filter(line => line.trim() !== '');
      
      // 确保有三行
      if (lines.length >= 3) {
        console.log('✅ AI生成成功');
        return NextResponse.json({
          lines: [lines[0].trim(), lines[1].trim(), lines[2].trim()],
          theme,
          source: 'ai'
        });
      }
    } catch (aiError) {
      console.log('⚠️ AI服务不可用或调用失败，使用兜底数据:', aiError.message);
    }
    
    // AI不可用或调用失败时，使用兜底数据
    console.log(`📚 使用兜底数据，主题: ${theme}`);
    const lines = getRandomHaikuByTheme(theme);
    
    return NextResponse.json({
      lines,
      theme,
      source: 'fallback'
    });
    
  } catch (error) {
    console.error('API路由错误:', error);
    
    // 最终兜底
    return NextResponse.json({
      lines: ['静夜思绪飞', '月光洒满窗台上', '诗意自心来'],
      theme: '默认',
      source: 'error_fallback'
    });
  }
} 
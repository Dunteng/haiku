'use client';

import { useState } from 'react';

interface Haiku {
  id: string;
  lines: [string, string, string];
  theme: string;
  timestamp: Date;
}

export default function HaikuGenerator() {
  const [theme, setTheme] = useState('');
  const [currentHaiku, setCurrentHaiku] = useState<Haiku | null>(null);
  const [haikuHistory, setHaikuHistory] = useState<Haiku[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingHaiku, setEditingHaiku] = useState<Haiku | null>(null);

  // 模拟俳句生成逻辑 - 实际项目中可以集成AI API
  const generateHaiku = async () => {
    if (!theme.trim()) return;
    
    setIsGenerating(true);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 示例俳句生成逻辑（实际应该调用AI服务）
    const sampleHaikus = {
      '春天': ['樱花飞舞时', '温暖春风轻抚面', '新绿满枝头'],
      '夏天': ['蝉鸣声阵阵', '绿荫下乘凉避暑', '清风徐徐来'],
      '秋天': ['黄叶满地舞', '秋风萧瑟送归雁', '丰收在田间'],
      '冬天': ['雪花纷纷落', '寒风刺骨人归家', '炉火温暖心'],
      '月亮': ['皎月当空照', '清辉洒向人间路', '思君不见君'],
      '山水': ['青山如黛远', '碧水潺潺绕石流', '鸟啼花香浓'],
      '樱花': ['粉樱满枝头', '花瓣随风轻飘舞', '春意入心扉'],
      '茶': ['一盏清茶香', '静坐品味人生味', '禅心自然来'],
      '默认': ['静夜思绪飞', '月光洒满窗台上', '诗意自心来']
    };
    
    const haikuLines = sampleHaikus[theme as keyof typeof sampleHaikus] || sampleHaikus['默认'];
    
    const newHaiku: Haiku = {
      id: Date.now().toString(),
      lines: [haikuLines[0], haikuLines[1], haikuLines[2]],
      theme,
      timestamp: new Date()
    };
    
    setCurrentHaiku(newHaiku);
    setHaikuHistory(prev => [newHaiku, ...prev.slice(0, 9)]); // 保留最近10个
    setIsGenerating(false);
  };

  const editHaiku = (haiku: Haiku) => {
    setEditingHaiku({...haiku});
  };

  const saveEditedHaiku = () => {
    if (!editingHaiku) return;
    
    setCurrentHaiku(editingHaiku);
    setHaikuHistory(prev => 
      prev.map(h => h.id === editingHaiku.id ? editingHaiku : h)
    );
    setEditingHaiku(null);
  };

  const selectFromHistory = (haiku: Haiku) => {
    setCurrentHaiku(haiku);
    setTheme(haiku.theme);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-neutral-100 relative">
      {/* 和风背景装饰 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-rose-200"></div>
        <div className="absolute top-40 left-16 w-20 h-20 rounded-full bg-emerald-200"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 rounded-full bg-amber-200"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full bg-slate-200"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <div className="inline-block relative mb-8">
            <h1 className="text-5xl md:text-6xl font-light text-stone-800 mb-4 tracking-wide">
              俳句
            </h1>
            <div className="w-16 h-0.5 bg-rose-300 mx-auto mb-2"></div>
            <div className="text-sm text-stone-500 tracking-[0.2em] font-light">
              HAIKU GENERATOR
            </div>
          </div>
          <p className="text-lg text-stone-600 mb-6 font-light leading-relaxed">
            静心创作，感受文字间的诗意与禅境
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full text-stone-500 text-sm border border-stone-200/50 shadow-sm">
            <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
            <span>五 · 七 · 五</span>
            <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
            <span>诗韵天成</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 主创作区域 */}
          <div className="lg:col-span-2 space-y-10">
            {/* 输入区域 */}
            <div className="group">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-stone-200/50 shadow-lg hover:shadow-rose-100/50 transition-all duration-700">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      placeholder="请输入创作主题..."
                      className="w-full px-5 py-4 bg-stone-50/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 outline-none text-lg text-stone-700 placeholder-stone-400 transition-all duration-300 font-light"
                      onKeyPress={(e) => e.key === 'Enter' && !isGenerating && generateHaiku()}
                    />
                  </div>
                  <button
                    onClick={generateHaiku}
                    disabled={!theme.trim() || isGenerating}
                    className="px-8 py-4 bg-gradient-to-r from-rose-300 to-rose-400 text-white rounded-xl hover:from-rose-400 hover:to-rose-500 disabled:from-stone-300 disabled:to-stone-400 disabled:cursor-not-allowed transition-all duration-300 font-light text-lg shadow-lg hover:shadow-rose-200/50 transform hover:scale-[1.02] whitespace-nowrap relative overflow-hidden"
                  >
                    {isGenerating && (
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-400/80 to-rose-500/80">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </div>
                    )}
                    <span className="relative z-10">
                      {isGenerating ? '创作中 ···' : '创作俳句'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* 俳句显示区域 */}
            {currentHaiku && (
              <div className="group">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 border border-stone-200/50 shadow-xl hover:shadow-rose-100/60 transition-all duration-700">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-rose-300 to-rose-400 rounded-full"></div>
                      <h2 className="text-xl font-light text-stone-700 tracking-wide">当前作品</h2>
                    </div>
                    <button
                      onClick={() => editHaiku(currentHaiku)}
                      className="px-5 py-2 bg-stone-100 text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-rose-200 transition-all duration-300 font-light flex items-center gap-2 hover:scale-105"
                    >
                      <span className="text-sm">✎</span>
                      <span>编辑</span>
                    </button>
                  </div>
                  
                  <div className="text-center relative">
                    <div className="relative bg-gradient-to-b from-stone-50/80 to-white/80 rounded-xl p-8 border border-stone-100/50">
                      <div className="text-3xl md:text-4xl font-light text-stone-800 leading-relaxed space-y-6 tracking-wide">
                        <div className="relative hover:text-rose-600 transition-colors duration-500 py-2">
                          <span className="relative z-10">{currentHaiku.lines[0]}</span>
                          <div className="absolute -right-6 top-0 text-xs text-rose-400 opacity-60 font-normal">五</div>
                          <div className="absolute inset-0 bg-rose-50/0 hover:bg-rose-50/30 rounded-lg transition-all duration-500 -z-10"></div>
                        </div>
                        <div className="relative hover:text-rose-600 transition-colors duration-500 py-2">
                          <span className="relative z-10">{currentHaiku.lines[1]}</span>
                          <div className="absolute -right-6 top-0 text-xs text-rose-400 opacity-60 font-normal">七</div>
                          <div className="absolute inset-0 bg-rose-50/0 hover:bg-rose-50/30 rounded-lg transition-all duration-500 -z-10"></div>
                        </div>
                        <div className="relative hover:text-rose-600 transition-colors duration-500 py-2">
                          <span className="relative z-10">{currentHaiku.lines[2]}</span>
                          <div className="absolute -right-6 top-0 text-xs text-rose-400 opacity-60 font-normal">五</div>
                          <div className="absolute inset-0 bg-rose-50/0 hover:bg-rose-50/30 rounded-lg transition-all duration-500 -z-10"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center items-center gap-8 text-stone-500">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div>
                        <span className="text-sm font-light">主题：{currentHaiku.theme}</span>
                      </div>
                      <div className="w-px h-4 bg-stone-300"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        <span className="text-sm font-light">五七五音律</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 历史记录区域 */}
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-gradient-to-b from-amber-300 to-amber-400 rounded-full"></div>
                <h3 className="text-lg font-light text-stone-700 tracking-wide">历史作品</h3>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto japanese-scrollbar">
                {haikuHistory.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-4 opacity-20">🌸</div>
                    <p className="text-stone-400 font-light">暂无作品</p>
                    <p className="text-stone-300 text-sm mt-2 font-light">开始您的诗意创作吧</p>
                  </div>
                ) : (
                  haikuHistory.map((haiku) => (
                    <div
                      key={haiku.id}
                      className="p-5 bg-stone-50/60 border border-stone-100/80 rounded-xl hover:bg-white/80 hover:border-rose-200/60 cursor-pointer transition-all duration-400 group hover:scale-[1.02] hover:shadow-md"
                      onClick={() => selectFromHistory(haiku)}
                    >
                      <div className="text-sm text-stone-700 space-y-2 font-light leading-relaxed">
                        <div className="group-hover:text-rose-600 transition-colors duration-300">{haiku.lines[0]}</div>
                        <div className="group-hover:text-rose-600 transition-colors duration-300">{haiku.lines[1]}</div>
                        <div className="group-hover:text-rose-600 transition-colors duration-300">{haiku.lines[2]}</div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100/60">
                        <span className="text-xs text-stone-500 bg-rose-50/60 px-3 py-1 rounded-full font-light">
                          {haiku.theme}
                        </span>
                        <span className="text-xs text-stone-400 font-light">
                          {haiku.timestamp.toLocaleString('zh-CN', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 编辑模态框 */}
        {editingHaiku && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/98 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg border border-stone-200/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-gradient-to-b from-emerald-300 to-emerald-400 rounded-full"></div>
                <h3 className="text-xl font-light text-stone-700 tracking-wide">编辑俳句</h3>
              </div>
              
              <div className="space-y-6">
                {editingHaiku.lines.map((line, index) => (
                  <div key={index}>
                    <label className="block text-sm font-light text-stone-600 mb-2 flex items-center gap-2">
                      第{index + 1}句 （{index === 1 ? '七' : '五'}音节）
                      <div className="w-1 h-1 bg-rose-400 rounded-full"></div>
                    </label>
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => {
                        const newLines = [...editingHaiku.lines];
                        newLines[index] = e.target.value;
                        setEditingHaiku({
                          ...editingHaiku,
                          lines: newLines as [string, string, string]
                        });
                      }}
                      className="w-full px-4 py-3 bg-stone-50/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 outline-none text-stone-700 placeholder-stone-400 transition-all duration-300 font-light"
                      placeholder={`请输入第${index + 1}句...`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={saveEditedHaiku}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-300 to-emerald-400 text-white rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 font-light shadow-lg hover:shadow-emerald-200/50 transform hover:scale-[1.02]"
                >
                  保存
                </button>
                <button
                  onClick={() => setEditingHaiku(null)}
                  className="flex-1 px-6 py-3 bg-stone-100 text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 hover:border-rose-200 transition-all duration-300 font-light"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

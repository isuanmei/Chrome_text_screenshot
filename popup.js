// 样式配置
const styleConfigs = {
  simple: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    lineHeight: 1.5,
    paragraphSpacing: 20,
    padding: 20
  },
  warm: {
    backgroundColor: '#fff9f0',
    textColor: '#5c4b51',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    lineHeight: 1.6,
    paragraphSpacing: 24,
    padding: 24
  },
  dark: {
    backgroundColor: '#2c2c2c',
    textColor: '#e0e0e0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '16px',
    lineHeight: 1.5,
    paragraphSpacing: 20,
    padding: 20
  }
};

// 获取DOM元素
const textInput = document.getElementById('textInput');
const styleOptions = document.querySelectorAll('.style-option');
const previewContainer = document.querySelector('.preview-container');
const previewCanvas = document.getElementById('previewCanvas');
const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');

// 当前选中的样式
let currentStyle = 'simple';

// 样式选择事件处理
styleOptions.forEach(option => {
  option.addEventListener('click', () => {
    styleOptions.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');
    currentStyle = option.dataset.style;
    if (textInput.value) {
      renderPreview();
    }
  });
});

// 渲染预览图片
function renderPreview() {
  const text = textInput.value.trim();
  if (!text) return;

  const style = styleConfigs[currentStyle];
  const ctx = previewCanvas.getContext('2d');
  const width = 375;
  
  // 计算文本布局
  ctx.font = `${style.fontSize} ${style.fontFamily}`;
  const padding = style.padding;
  const lineHeight = parseFloat(style.fontSize) * style.lineHeight;
  const paragraphSpacing = style.paragraphSpacing;
  
  // 分段处理文本
  const paragraphs = text.split('\n').filter(p => p.trim());
  const lines = [];
  
  paragraphs.forEach(paragraph => {
    const words = paragraph.split('');
    let line = '';
    
    words.forEach(word => {
      const testLine = line + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width - padding * 2) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    });
    
    if (line) {
      lines.push(line);
    }
    lines.push(''); // 段落间距
  });
  
  // 设置画布尺寸
  const height = lines.length * lineHeight + padding * 2;
  previewCanvas.width = width;
  previewCanvas.height = height;
  
  // 绘制背景
  ctx.fillStyle = style.backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  // 绘制文本
  ctx.fillStyle = style.textColor;
  ctx.font = `${style.fontSize} ${style.fontFamily}`;
  ctx.textBaseline = 'top';
  
  lines.forEach((line, index) => {
    const y = padding + index * lineHeight;
    ctx.fillText(line, padding, y);
  });
  
  // 显示预览和下载按钮
  previewContainer.style.display = 'block';
  downloadBtn.disabled = false;
}

// 预览按钮点击事件
previewBtn.addEventListener('click', renderPreview);

// 下载按钮点击事件
downloadBtn.addEventListener('click', () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '');
  const link = document.createElement('a');
  link.download = `text2img_${timestamp}.png`;
  link.href = previewCanvas.toDataURL('image/png', 0.9);
  link.click();
});

// 文本输入事件
textInput.addEventListener('input', () => {
  if (textInput.value.trim()) {
    previewBtn.disabled = false;
  } else {
    previewBtn.disabled = true;
    downloadBtn.disabled = true;
    previewContainer.style.display = 'none';
  }
});
// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化文件上传
    initFileUpload();
    
    // 初始化示例图片点击事件
    initSampleImages();
    
    // 初始化分析按钮状态
    updateAnalyzeButton();
});
// 滚动到演示区域
function scrollToDemo() {
    document.getElementById('demo').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// 初始化文件上传
function initFileUpload() {
    const fileInput = document.getElementById('imageUpload');
    const uploadArea = document.getElementById('uploadArea');
    
    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            handleImageUpload(file);
        }
    });
        // 拖放功能
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary)';
        this.style.backgroundColor = 'rgba(58, 134, 255, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--gray-light)';
        this.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--gray-light)';
        this.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                handleImageUpload(file);
            } else {
                alert('请上传图片文件');
            }
        }
    });
}
// 初始化示例图片
function initSampleImages() {
    const sampleThumbs = document.querySelectorAll('.sample-thumb');
    
    sampleThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const imageType = this.getAttribute('data-image');
            loadSampleImage(imageType);
        });
    });
}
// 加载示例图片
function loadSampleImage(imageType) {
    // 在实际项目中，这里会加载真实的示例图片
    // 这里我们模拟加载过程
    const placeholder = document.getElementById('previewPlaceholder');
    const canvas = document.getElementById('imageCanvas');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    // 显示加载状态
    placeholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>加载示例图片...</p>';
    
    // 模拟加载延迟
    setTimeout(() => {
        placeholder.classList.add('hidden');
        canvas.classList.remove('hidden');
                // 根据图片类型设置不同的演示图片
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        
        // 创建模拟的眼底图片
        drawSampleRetinaImage(ctx, imageType);
        
        // 启用分析按钮
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-search"></i> 开始AI分析';
    }, 800);
}
// 绘制示例眼底图片
function drawSampleRetinaImage(ctx, type) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // 创建渐变背景
    const gradient = ctx.createRadialGradient(
        width/2, height/2, 0,
        width/2, height/2, width/2
    );
    
    // 根据图片类型设置不同颜色
    if (type === 'normal') {
        gradient.addColorStop(0, 'rgb(180, 200, 220)');
        gradient.addColorStop(1, 'rgb(100, 130, 180)');
    } else if (type === 'dr') {
        gradient.addColorStop(0, 'rgb(220, 180, 180)');
        gradient.addColorStop(1, 'rgb(180, 100, 100)');
    } else { // glaucoma
        gradient.addColorStop(0, 'rgb(180, 200, 180)');
        gradient.addColorStop(1, 'rgb(100, 150, 100)');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 绘制视盘（眼底的亮点）
    ctx.beginPath();
    ctx.arc(width/2, height/2.5, width/8, 0, Math.PI * 2);
    const discGradient = ctx.createRadialGradient(
        width/2, height/2.5, 0,
        width/2, height/2.5, width/8
    );
    discGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    discGradient.addColorStop(1, 'rgba(200, 200, 200, 0.7)');
    ctx.fillStyle = discGradient;
    ctx.fill();
        // 绘制血管
    drawRetinalVessels(ctx, width, height, type);
    
    // 根据类型添加病变特征
    if (type === 'dr') {
        // 糖尿病视网膜病变特征：出血点、微动脉瘤
        drawDRFeatures(ctx, width, height);
    } else if (type === 'glaucoma') {
        // 青光眼特征：杯盘比增大
        drawGlaucomaFeatures(ctx, width, height);
    }
}
// 绘制眼底血管
function drawRetinalVessels(ctx, width, height) {
    ctx.strokeStyle = 'rgb(180, 100, 100)';
    ctx.lineWidth = 2;
    
    const centerX = width/2;
    const centerY = height/2.5;
    
    // 绘制4条主要血管
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI / 2) + Math.PI/4;
        const length = width/3;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        
        // 创建弯曲的血管
        for (let j = 0; j <= 10; j++) {
            const t = j / 10;
            const x = centerX + Math.cos(angle) * length * t + 
                      Math.sin(angle) * 20 * Math.sin(t * Math.PI);
            const y = centerY + Math.sin(angle) * length * t + 
                      Math.cos(angle) * 20 * Math.sin(t * Math.PI);
            
            if (j === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }
}
// 绘制糖尿病视网膜病变特征
function drawDRFeatures(ctx, width, height) {
    // 绘制出血点（红色小点）
    ctx.fillStyle = 'rgba(200, 50, 50, 0.8)';
    
    for (let i = 0; i < 15; i++) {
        const x = width/2 + (Math.random() - 0.5) * width/1.5;
        const y = height/2 + (Math.random() - 0.5) * height/1.5;
        const radius = 2 + Math.random() * 4;
        
        // 确保点在合理范围内
        if (Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2)) < width/2.5) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 绘制硬性渗出（黄色点）
    ctx.fillStyle = 'rgba(255, 220, 100, 0.9)';
    
    for (let i = 0; i < 8; i++) {
        const x = width/2 + (Math.random() - 0.5) * width/2;
        const y = height/2 + (Math.random() - 0.5) * height/2;
        const radius = 3 + Math.random() * 5;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
// 绘制青光眼特征
function drawGlaucomaFeatures(ctx, width, height) {
    const centerX = width/2;
    const centerY = height/2.5;
    
    // 绘制扩大的视杯
    ctx.beginPath();
    ctx.arc(centerX, centerY, width/12, 0, Math.PI * 2);
    const cupGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, width/12
    );
    cupGradient.addColorStop(0, 'rgba(150, 150, 150, 0.8)');
    cupGradient.addColorStop(1, 'rgba(100, 100, 100, 0.6)');
    ctx.fillStyle = cupGradient;
    ctx.fill();
    
    // 绘制血管被推挤的效果
    ctx.strokeStyle = 'rgb(150, 80, 80)';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, width/6, 0, Math.PI * 2);
    ctx.stroke();
}
// 处理图片上传
function handleImageUpload(file) {
    if (!file.type.match('image.*')) {
        alert('请选择图片文件');
        return;
    }
    
    const reader = new FileReader();
    const placeholder = document.getElementById('previewPlaceholder');
    const canvas = document.getElementById('imageCanvas');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    placeholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>加载图片中...</p>';
    
    reader.onload = function(e) {
        const img = new Image();
        
        img.onload = function() {
            placeholder.classList.add('hidden');
            canvas.classList.remove('hidden');
            
            // 调整画布大小以适应图片
            const maxWidth = 600;
            const maxHeight = 400;
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (maxHeight / height) * width;
                height = maxHeight;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // 启用分析按钮
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fas fa-search"></i> 开始AI分析';
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}
// 更新分析按钮状态
function updateAnalyzeButton() {
    const canvas = document.getElementById('imageCanvas');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    // 检查画布是否有内容
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, 1, 1).data;
    
    // 如果画布是空的（默认状态），禁用按钮
    if (imageData[3] === 0) { // 检查alpha通道
        analyzeBtn.disabled = true;
    }
}

// 分析图片
function analyzeImage() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const qualityCheck = document.getElementById('qualityCheck').checked;
    
    // 禁用按钮并显示加载状态
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI分析中...';
    
    // 模拟AI分析过程
    setTimeout(() => {
        // 执行图像质量评估
        if (qualityCheck) {
            performQualityAssessment();
        }
        
        // 执行疾病检测
        performDiseaseDetection();
        
        // 生成报告
        generateReport();
        
        // 重新启用分析按钮
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-search"></i> 重新分析';
    }, 1500);
}
// 执行图像质量评估
function performQualityAssessment() {
    const qualityResults = document.getElementById('qualityResults');
    
    // 模拟质量评估结果
    const qualityScore = Math.floor(Math.random() * 30) + 70; // 70-100之间的随机分数
    const isQualified = qualityScore >= 75;
    
    let qualityHTML = `
        <div class="quality-score ${isQualified ? 'qualified' : 'unqualified'}">
            <div class="score-circle">
                <span class="score-value">${qualityScore}</span>
                <span class="score-label">/100</span>
            </div>
            <div class="score-text">
                <h4>${isQualified ? '图片质量合格' : '图片质量不合格'}</h4>
                <p>${isQualified ? '图片质量良好,适合用于AI分析' : '建议重新拍摄更清晰的图片'}</p>
            </div>
        </div>
        <div class="quality-details">
            <div class="quality-item">
                <span class="quality-label">清晰度:</span>
                <span class="quality-value">${qualityScore >= 80 ? '优秀' : qualityScore >= 70 ? '良好' : '一般'}</span>
            </div>
            <div class="quality-item">
                <span class="quality-label">亮度:</span>
                <span class="quality-value">正常</span>
            </div>
            <div class="quality-item">
                <span class="quality-label">对比度:</span>
                <span class="quality-value">良好</span>
            </div>
            <div class="quality-item">
                <span class="quality-label">对焦:</span>
                <span class="quality-value">${qualityScore >= 80 ? '准确' : '轻微模糊'}</span>
            </div>
        </div>
    `;
     // 添加CSS样式
        const style = document.createElement('style');
            style.textContent = `
        .quality-score {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
        }
        .score-circle {
            position: relative;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
                    .qualified .score-circle {
            background: conic-gradient(var(--success) ${qualityScore * 3.6}deg, #f0f0f0 0deg);
        }
        .unqualified .score-circle {
            background: conic-gradient(var(--danger) ${qualityScore * 3.6}deg, #f0f0f0 0deg);
        }
        .score-circle:before {
            content: '';
            position: absolute;
            width: 70px;
            height: 70px;
            background-color: white;
            border-radius: 50%;
        }
        .score-value {
            font-size: 1.8rem;
            font-weight: 700;
            position: relative;
            z-index: 1;
        }
        .score-label {
            font-size: 1rem;
            color: var(--gray);
            position: relative;
            z-index: 1;
        }
                    .score-text h4 {
            margin-bottom: 5px;
            color: var(--dark);
        }
        .score-text p {
            color: var(--gray);
            font-size: 0.9rem;
        }
        .quality-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .quality-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .quality-label {
            color: var(--gray);
        }
        .quality-value {
            font-weight: 500;
        }
    `;
    qualityResults.innerHTML = '';
    qualityResults.appendChild(style);
    qualityResults.innerHTML += qualityHTML;
}
